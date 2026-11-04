-- Apply with the Supabase CLI to a dedicated project. No real people or client data is seeded.
create table public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null,
 role text not null check(role in ('owner','editor','viewer')),
 status text not null default 'active' check(status in ('active','disabled')),
 created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create function public.studio_role() returns text language sql stable security definer set search_path=public,pg_temp as $$select role from public.profiles where id=auth.uid() and status='active'$$;
revoke all on function public.studio_role() from public;
grant execute on function public.studio_role() to anon,authenticated;
create policy profile_read on public.profiles for select to authenticated using(id=auth.uid() or public.studio_role()='owner');
create policy profile_owner_update on public.profiles for update to authenticated using(public.studio_role()='owner') with check(public.studio_role()='owner');
-- No anonymous or self signup profile insertion. Owner bootstrapping is a reviewed SQL operation.

create table public.content_revisions(id uuid primary key default gen_random_uuid(),resource text not null,resource_id uuid not null,revision jsonb not null,actor uuid,created_at timestamptz not null default now());
create table public.audit_logs(id uuid primary key default gen_random_uuid(),actor uuid,action text not null,resource text not null,resource_id uuid not null,created_at timestamptz not null default now());
alter table public.content_revisions enable row level security;
alter table public.audit_logs enable row level security;
create policy revisions_staff_read on public.content_revisions for select to authenticated using(public.studio_role() in ('owner','editor'));
create policy audit_owner_read on public.audit_logs for select to authenticated using(public.studio_role()='owner');
create function public.record_content_change() returns trigger language plpgsql security definer set search_path=public,pg_temp as $$
begin
 if tg_op='DELETE' then
  insert into public.audit_logs(actor,action,resource,resource_id) values(auth.uid(),tg_op,tg_table_name,old.id);
  return old;
 end if;
 insert into public.audit_logs(actor,action,resource,resource_id) values(auth.uid(),tg_op,tg_table_name,new.id);
 insert into public.content_revisions(resource,resource_id,revision,actor) values(tg_table_name,new.id,to_jsonb(new),auth.uid());
 return new;
end;$$;
revoke all on function public.record_content_change() from public;

do $$declare resource text;begin
 foreach resource in array array['projects','services','packages','team','testimonials','articles','media','settings','redirects'] loop
 execute format('create table public.%I (
 id uuid primary key default gen_random_uuid(),slug text not null unique check(slug ~ ''^[a-z0-9]+(-[a-z0-9]+)*$''),
 title text not null check(length(title) between 2 and 200),summary text not null default '''',body text not null default '''',
 status text not null default ''draft'' check(status in (''draft'',''published'',''archived'')),permission_approved boolean not null default false,
 data jsonb not null default ''{}'',seo_title text,seo_description text,updated_at timestamptz not null default now(),
 constraint meaningful_publication check(status<>''published'' or (length(summary)>0 and length(body)>0))
 )',resource);
 execute format('alter table public.%I enable row level security',resource);
 execute format('create index %I on public.%I(status,updated_at desc)',resource||'_status_date',resource);
 execute format('create policy staff_read on public.%I for select to authenticated using(public.studio_role() in (''owner'',''editor'',''viewer''))',resource);
 execute format('create policy staff_insert on public.%I for insert to authenticated with check(public.studio_role() in (''owner'',''editor''))',resource);
 execute format('create policy staff_update on public.%I for update to authenticated using(public.studio_role() in (''owner'',''editor'')) with check(public.studio_role() in (''owner'',''editor''))',resource);
 execute format('create policy owner_delete on public.%I for delete to authenticated using(public.studio_role()=''owner'')',resource);
 if resource in ('projects','team','testimonials','media') then
  execute format('alter table public.%I add constraint permission_before_publish check(status<>''published'' or permission_approved)',resource);
  execute format('create policy public_read on public.%I for select to anon,authenticated using(status=''published'' and permission_approved)',resource);
 elsif resource not in ('settings') then
  execute format('create policy public_read on public.%I for select to anon,authenticated using(status=''published'')',resource);
 end if;
 execute format('create trigger content_audit after insert or update or delete on public.%I for each row execute function public.record_content_change()',resource);
 end loop;
end;$$;
alter table public.projects add constraint project_assets_before_publish check(status<>'published' or (coalesce(data->>'cover','') ~ '^/media/[a-zA-Z0-9/_.-]+$' and length(coalesce(data->>'alt',''))>0 and jsonb_array_length(coalesce(data->'deliverables','[]'))>0));
alter table public.testimonials add constraint source_before_publish check(status<>'published' or coalesce(data->>'source','') ~ '^https?://');

create table public.inquiries(
 id uuid primary key default gen_random_uuid(),request_id uuid not null unique,fingerprint text not null,
 reference_code text not null unique default ('BF-'||upper(substr(replace(gen_random_uuid()::text,'-',''),1,12))),
 name text not null check(length(name) between 2 and 100),email text not null check(length(email)<=254),
 service text not null,selected_package text not null default '',stage text not null,project_title text not null default '',genre text not null default '',word_count integer,
 formats jsonb not null default '[]',preferred_deadline text not null default '',description text not null check(length(description) between 20 and 6000),
 consent_version text not null default '2026-11-04-contact-v1',status text not null default 'new' check(status in ('new','reviewing','needs_information','proposal_sent','won','closed','archived')),
 created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create index inquiry_status_created on public.inquiries(status,created_at desc);
create table public.inquiry_notes(id uuid primary key default gen_random_uuid(),inquiry_id uuid not null references public.inquiries(id) on delete cascade,author_id uuid not null references public.profiles(id),body text not null check(length(body) between 1 and 4000),created_at timestamptz not null default now());
create table public.email_events(id uuid primary key default gen_random_uuid(),inquiry_id uuid not null references public.inquiries(id) on delete cascade,kind text not null check(kind in ('receipt','notification')),status text not null default 'pending' check(status in ('pending','sending','sent')),attempts integer not null default 0,locked_until timestamptz,provider_message_id text,created_at timestamptz not null default now(),unique(inquiry_id,kind));
create table public.inquiry_rate_limits(rate_key text primary key,window_start timestamptz not null default now(),attempts integer not null default 0);
alter table public.inquiries enable row level security;
alter table public.inquiry_notes enable row level security;
alter table public.email_events enable row level security;
alter table public.inquiry_rate_limits enable row level security;
create policy inquiry_staff_read on public.inquiries for select to authenticated using(public.studio_role() in ('owner','editor'));
create policy inquiry_staff_update on public.inquiries for update to authenticated using(public.studio_role() in ('owner','editor')) with check(public.studio_role() in ('owner','editor'));
-- Prevent editing original contact payload through direct PostgREST. Allow workflow fields only.
revoke update on public.inquiries from authenticated;
grant update(status,updated_at) on public.inquiries to authenticated;
create policy note_staff_read on public.inquiry_notes for select to authenticated using(public.studio_role() in ('owner','editor'));
create policy note_staff_insert on public.inquiry_notes for insert to authenticated with check(public.studio_role() in ('owner','editor') and author_id=auth.uid());
create policy email_staff_read on public.email_events for select to authenticated using(public.studio_role() in ('owner','editor'));

create function public.submit_inquiry(p_request_id uuid,p_fingerprint text,p_rate_key text,p_payload jsonb)
 returns table(id uuid,reference_code text) language plpgsql security definer set search_path=public,pg_temp as $$
declare existing public.inquiries; stored public.inquiries; rate_count integer;
begin
 perform pg_advisory_xact_lock(hashtextextended(p_request_id::text,0));
 select * into existing from public.inquiries i where i.request_id=p_request_id;
 if found then
  if existing.fingerprint<>p_fingerprint then raise exception 'idempotency_conflict';end if;
  return query select existing.id,existing.reference_code;return;
 end if;
 if p_payload->>'consent'<>'true' then raise exception 'consent_required';end if;
 insert into public.inquiry_rate_limits(rate_key,attempts) values(p_rate_key,1)
 on conflict(rate_key) do update set attempts=case when inquiry_rate_limits.window_start<now()-interval '1 hour' then 1 else inquiry_rate_limits.attempts+1 end,
 window_start=case when inquiry_rate_limits.window_start<now()-interval '1 hour' then now() else inquiry_rate_limits.window_start end
 returning attempts into rate_count;
 if rate_count>5 then raise exception 'rate_limited';end if;
 insert into public.inquiries(request_id,fingerprint,name,email,service,selected_package,stage,project_title,genre,word_count,formats,preferred_deadline,description)
 values(p_request_id,p_fingerprint,p_payload->>'name',p_payload->>'email',p_payload->>'service',coalesce(p_payload->>'package',''),p_payload->>'stage',coalesce(p_payload->>'projectTitle',''),coalesce(p_payload->>'genre',''),(p_payload->>'wordCount')::integer,coalesce(p_payload->'formats','[]'),coalesce(p_payload->>'deadline',''),p_payload->>'description') returning * into stored;
 insert into public.email_events(inquiry_id,kind) values(stored.id,'receipt'),(stored.id,'notification');
 insert into public.audit_logs(action,resource,resource_id) values('INQUIRY_CREATED','inquiries',stored.id);
 return query select stored.id,stored.reference_code;
end;$$;
revoke all on function public.submit_inquiry(uuid,text,text,jsonb) from public,anon,authenticated;
grant execute on function public.submit_inquiry(uuid,text,text,jsonb) to service_role;
create function public.claim_email(p_inquiry_id uuid,p_kind text) returns setof public.email_events language sql security definer set search_path=public,pg_temp as $$
 update public.email_events set status='sending',locked_until=now()+interval '2 minutes',attempts=attempts+1
 where inquiry_id=p_inquiry_id and kind=p_kind and status<>'sent' and (locked_until is null or locked_until<now()) and (attempts=0 or created_at>now()-interval '23 hours') returning *;
$$;
revoke all on function public.claim_email(uuid,text) from public,anon,authenticated;
grant execute on function public.claim_email(uuid,text) to service_role;

-- Originals stay private. No public bucket policy is installed.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('bookforge-originals','bookforge-originals',false,8388608,array['image/jpeg','image/png','image/webp']) on conflict(id) do nothing;
create policy originals_staff_read on storage.objects for select to authenticated using(bucket_id='bookforge-originals' and public.studio_role() in ('owner','editor'));
create policy originals_staff_insert on storage.objects for insert to authenticated with check(bucket_id='bookforge-originals' and public.studio_role() in ('owner','editor'));
create policy originals_owner_delete on storage.objects for delete to authenticated using(bucket_id='bookforge-originals' and public.studio_role()='owner');
