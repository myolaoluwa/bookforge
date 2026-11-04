import {describe,it,expect,vi,beforeEach} from 'vitest';
import {POST as submit} from '../../app/api/inquiries/route';
import {GET as adminRead,POST as adminWrite} from '../../app/api/admin/[resource]/route';
import {GET as health} from '../../app/api/health/route';
beforeEach(()=>{vi.stubEnv('SUPABASE_URL','');vi.stubEnv('SUPABASE_ANON_KEY','');vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY','');vi.stubEnv('RESEND_API_KEY','')});
describe('fail closed server boundaries',()=>{
 it('rejects cross site inquiry writes',async()=>{const response=await submit(new Request('http://localhost/api/inquiries',{method:'POST',headers:{origin:'https://attacker.example','content-type':'application/json'},body:'{}'}));expect(response.status).toBe(403)});
 it('does not fake successful delivery when unconfigured',async()=>{const response=await submit(new Request('http://localhost/api/inquiries',{method:'POST',headers:{origin:'http://localhost','content-type':'application/json'},body:'{}'}));expect(response.status).toBe(503);expect(await response.text()).toContain('No information has been saved or sent')});
 it('rejects anonymous CMS reads',async()=>{expect((await adminRead(new Request('http://localhost/api/admin/projects'),{params:Promise.resolve({resource:'projects'})})).status).toBe(401)});
 it('rejects anonymous CMS writes',async()=>{expect((await adminWrite(new Request('http://localhost/api/admin/projects',{method:'POST',headers:{origin:'http://localhost'}}),{params:Promise.resolve({resource:'projects'})})).status).toBe(401)});
 it('returns flags without secrets or a false healthy status',async()=>{const response=await health();expect(await response.json()).toEqual({status:'setup_required',databaseConfigured:false,inquiriesConfigured:false,emailConfigured:false})});
});
