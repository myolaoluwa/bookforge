import {describe,it,expect,vi,beforeEach} from 'vitest';
const mocks=vi.hoisted(()=>({role:'viewer',upsert:vi.fn(),deleteEntry:vi.fn()}));
vi.mock('../../lib/bookforge/database',()=>({adminIdentity:async()=>({role:mocks.role,db:{from:()=>({upsert:(entry:unknown)=>{mocks.upsert(entry);return {select:()=>({single:async()=>({data:entry,error:null})})}},delete:()=>{mocks.deleteEntry();return {eq:async()=>({error:null})}}})}})}));
import {POST,DELETE} from '../../app/api/admin/[resource]/route';
const params={params:Promise.resolve({resource:'projects'})};
const entry={slug:'test-project',title:'Test project',summary:'A documented contribution.',body:'A real scoped contribution for a test fixture.',status:'published',permission_approved:false,data:{cover:'/media/fixture',alt:'Test cover',deliverables:['Interior']}};
const request=(body:unknown,method='POST')=>new Request('http://localhost/api/admin/projects',{method,headers:{origin:'http://localhost','Content-Type':'application/json'},body:JSON.stringify(body)});
beforeEach(()=>{mocks.role='viewer';mocks.upsert.mockClear();mocks.deleteEntry.mockClear()});
describe('CMS route permissions',()=>{
 it('blocks viewer writes on the server',async()=>{expect((await POST(request(entry),params)).status).toBe(403);expect(mocks.upsert).not.toHaveBeenCalled()});
 it('blocks publishing client work without permission',async()=>{mocks.role='editor';expect((await POST(request(entry),params)).status).toBe(422);expect(mocks.upsert).not.toHaveBeenCalled()});
 it('lets an editor save approved publication',async()=>{mocks.role='editor';expect((await POST(request({...entry,permission_approved:true}),params)).status).toBe(200);expect(mocks.upsert).toHaveBeenCalledOnce()});
 it('rejects editor deletes',async()=>{mocks.role='editor';expect((await DELETE(request({id:'00000000-0000-4000-8000-000000000001'},'DELETE'),params)).status).toBe(403)});
 it('allows owner deletes',async()=>{mocks.role='owner';expect((await DELETE(request({id:'00000000-0000-4000-8000-000000000001'},'DELETE'),params)).status).toBe(200)});
});
