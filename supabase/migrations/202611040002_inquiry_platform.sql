-- Preserve the author-selected publishing platform in the private inquiry.
begin;
alter table public.inquiries add column publishing_platform text not null default 'unsure' check(publishing_platform in ('unsure','amazon-kdp','ingramspark','other','not-needed'));
create or replace function public.submit_inquiry(p_request_id uuid,p_fingerprint text,p_rate_key text,p_payload jsonb)
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
 insert into public.inquiries(request_id,fingerprint,name,email,service,selected_package,stage,project_title,genre,word_count,formats,preferred_deadline,description,publishing_platform)
 values(p_request_id,p_fingerprint,p_payload->>'name',p_payload->>'email',p_payload->>'service',coalesce(p_payload->>'package',''),p_payload->>'stage',coalesce(p_payload->>'projectTitle',''),coalesce(p_payload->>'genre',''),(p_payload->>'wordCount')::integer,coalesce(p_payload->'formats','[]'),coalesce(p_payload->>'deadline',''),p_payload->>'description',coalesce(p_payload->>'platform','unsure')) returning * into stored;
 insert into public.email_events(inquiry_id,kind) values(stored.id,'receipt'),(stored.id,'notification');
 insert into public.audit_logs(action,resource,resource_id) values('INQUIRY_CREATED','inquiries',stored.id);
 return query select stored.id,stored.reference_code;
end;$$;
revoke all on function public.submit_inquiry(uuid,text,text,jsonb) from public,anon,authenticated;
grant execute on function public.submit_inquiry(uuid,text,text,jsonb) to service_role;

commit;
