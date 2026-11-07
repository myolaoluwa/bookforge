import {beforeEach,describe,it,expect,vi} from 'vitest';
const mocks=vi.hoisted(()=>({rpc:vi.fn(),fetch:vi.fn()}));
vi.mock('../../lib/bookforge/config',()=>({inquiriesReady:()=>true}));
vi.mock('../../lib/bookforge/database',()=>({serviceClient:()=>({rpc:mocks.rpc})}));
vi.mock('../../lib/bookforge/mail',()=>({deliverInquiryEmails:async()=> 'pending'}));
import {POST} from '../../app/api/inquiries/route';
import {inquirySchema} from '../../lib/bookforge/validation';
const inquiry={requestId:'83dd1965-a9cc-4b2e-bbf1-fcb65071509a',name:'Test author',email:'author@example.com',service:'other',serviceOther:'Illustrated poetry layout',stage:'other',stageOther:'The poems are edited and the illustrations are being finished.',description:'I need help balancing the poems with full-page illustrations.',consent:true,turnstileToken:'test-token'};
beforeEach(()=>{mocks.rpc.mockReset();mocks.fetch.mockReset();vi.stubGlobal('fetch',mocks.fetch);vi.stubEnv('TURNSTILE_SECRET_KEY','test-only');vi.stubEnv('RATE_LIMIT_SALT','test-only');mocks.fetch.mockResolvedValue(Response.json({success:true,hostname:'bookforge.ink',action:'proposal'}));mocks.rpc.mockResolvedValue({data:[{id:'test-inquiry',reference_code:'BF-TEST'}],error:null})});
const request=(body:unknown)=>new Request('https://bookforge.ink/api/inquiries',{method:'POST',headers:{origin:'https://bookforge.ink','content-type':'application/json'},body:JSON.stringify(body)});
describe('custom inquiry context',()=>{
 it('preserves custom help and stage in the saved project brief',async()=>{const response=await POST(request(inquiry));expect(response.status).toBe(201);const payload=mocks.rpc.mock.calls[0][1].p_payload;expect(payload.service).toBe('other');expect(payload.stage).toBe('other');expect(payload.description).toContain(inquiry.serviceOther);expect(payload.description).toContain(inquiry.stageOther);expect(payload.description).toContain(inquiry.description);expect(payload).not.toHaveProperty('serviceOther');expect(payload).not.toHaveProperty('stageOther')});
 it.each([{serviceOther:''},{stageOther:''},{serviceOther:'a'.repeat(201)},{stageOther:'a'.repeat(301)},{service:'book-cover-design'},{stage:'ready'}])('rejects missing, excessive or stale custom context: %j',async change=>{const response=await POST(request({...inquiry,...change}));expect(response.status).toBe(422);expect(mocks.rpc).not.toHaveBeenCalled()});
 it('keeps the combined stored description within the database limit',()=>{expect(inquirySchema.safeParse({...inquiry,description:'x'.repeat(6000)}).success).toBe(false)});
 it('stores the service-specific stage label for an existing service',async()=>{const response=await POST(request({...inquiry,service:'ebook-formatting',serviceOther:'',stage:'ready',stageOther:''}));expect(response.status).toBe(201);expect(mocks.rpc.mock.calls[0][1].p_payload.description).toContain('Final manuscript ready for EPUB formatting')});
});
