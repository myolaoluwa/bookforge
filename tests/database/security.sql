\set ON_ERROR_STOP on
begin;
insert into auth.users(id) values('00000000-0000-4000-8000-000000000001'),('00000000-0000-4000-8000-000000000002'),('00000000-0000-4000-8000-000000000003');
insert into public.profiles(id,display_name,role) values('00000000-0000-4000-8000-000000000001','Test owner','owner'),('00000000-0000-4000-8000-000000000002','Test editor','editor'),('00000000-0000-4000-8000-000000000003','Test viewer','viewer');
insert into public.projects(slug,title,summary,body,status,permission_approved,data) values('approved','Approved fixture','A test project','Documented contribution','published',true,'{"cover":"/media/fixture","alt":"Approved test cover","deliverables":["Interior"]}'),('private','Private fixture','A test draft','Never public','draft',false,'{}');
set local role anon;
do $$begin
 if (select count(*) from public.projects)<>1 then raise exception 'Anonymous project visibility failed';end if;
 if exists(select from public.inquiries) then raise exception 'Anonymous inquiry leakage';end if;
 if exists(select from public.profiles) then raise exception 'Anonymous profile leakage';end if;
 if exists(select from public.content_revisions) then raise exception 'Revision leakage';end if;
 if exists(select from storage.objects) then raise exception 'Storage leakage';end if;
 begin insert into public.projects(slug,title) values('attack','Injected');raise exception 'Anonymous write allowed';exception when insufficient_privilege then null;end;
end;$$;
reset role;
set local role authenticated;
set local request.jwt.claim.sub='00000000-0000-4000-8000-000000000003';
do $$begin
 if public.studio_role()<>'viewer' then raise exception 'Viewer identification failed';end if;
 if (select count(*) from public.projects)<>2 then raise exception 'Viewer draft access failed';end if;
 begin insert into public.projects(slug,title) values('viewer-write','Forbidden');raise exception 'Viewer write allowed';exception when insufficient_privilege then null;end;
 update public.profiles set role='owner' where id=auth.uid();
 if public.studio_role()<>'viewer' then raise exception 'Self role escalation';end if;
end;$$;
set local request.jwt.claim.sub='00000000-0000-4000-8000-000000000002';
do $$begin
 insert into public.services(slug,title,summary,body,status) values('editing-test','Editing fixture','Specific help','Real detail','published');
 begin insert into public.projects(slug,title,summary,body,status,permission_approved) values('unapproved','No rights','Test','Test','published',false);raise exception 'Permission bypass';exception when check_violation then null;end;
 begin insert into public.projects(slug,title,summary,body,status,permission_approved) values('no-cover','No cover','Test','Test','published',true);raise exception 'Asset bypass';exception when check_violation then null;end;
 delete from public.projects where slug='private';
 if not exists(select from public.projects where slug='private') then raise exception 'Editor deleted project';end if;
end;$$;
set local request.jwt.claim.sub='00000000-0000-4000-8000-000000000001';
do $$begin
 delete from public.projects where slug='private';
 if exists(select from public.projects where slug='private') then raise exception 'Owner delete failed';end if;
 if not exists(select from public.audit_logs where action='DELETE') then raise exception 'Delete audit missing';end if;
end;$$;
reset role;
set local role service_role;
select * from public.submit_inquiry('10000000-0000-4000-8000-000000000001','hash-a','rate-test','{"name":"Test author","email":"test@example.com","service":"ebook-formatting","stage":"unsure","formats":["ebook","paperback"],"platform":"amazon-kdp","description":"A test manuscript for the integration suite.","consent":true}');
select * from public.submit_inquiry('10000000-0000-4000-8000-000000000001','hash-a','rate-test','{"name":"Test author","email":"test@example.com","service":"ebook-formatting","stage":"unsure","formats":["ebook","paperback"],"platform":"amazon-kdp","description":"A test manuscript for the integration suite.","consent":true}');
do $$declare saved_id uuid;begin
 if not exists(select from public.inquiries where publishing_platform='amazon-kdp' and formats='["ebook","paperback"]'::jsonb and stage='unsure') then raise exception 'Format/platform choices were not preserved';end if;
 if (select count(*) from public.inquiries)<>1 then raise exception 'Duplicate inquiry';end if;
 if (select count(*) from public.email_events)<>2 then raise exception 'Transactional outbox missing or duplicated';end if;
 begin perform * from public.submit_inquiry('10000000-0000-4000-8000-000000000001','different','rate-test','{}');raise exception 'Changed retry accepted';exception when raise_exception then if sqlerrm<>'idempotency_conflict' then raise;end if;end;
 select id into saved_id from public.inquiries limit 1;
 if (select count(*) from public.claim_email(saved_id,'receipt'))<>1 then raise exception 'Mail claim failed';end if;
 if (select count(*) from public.claim_email(saved_id,'receipt'))<>0 then raise exception 'Concurrent mail claim allowed';end if;
end;$$;
reset role;
set local role authenticated;
set local request.jwt.claim.sub='00000000-0000-4000-8000-000000000003';
do $$begin if exists(select from public.inquiries) then raise exception 'Viewer read private inquiries';end if;end;$$;
reset role;
rollback;
\echo 'PASS: migration, anonymous isolation, role restrictions, publication guards, audit, idempotency and outbox locking'
