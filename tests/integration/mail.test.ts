import {describe,it,expect,vi,beforeEach} from 'vitest';
const mocks=vi.hoisted(()=>({rpc:vi.fn(),single:vi.fn(),update:vi.fn(),fetch:vi.fn(),recordFailure:false,alreadySent:false}));
vi.mock('../../lib/bookforge/config',()=>({mailReady:()=>true}));
vi.mock('../../lib/bookforge/database',()=>({serviceClient:()=>({rpc:mocks.rpc,from:(table:string)=>table==='inquiries'?{select:()=>({eq:()=>({single:async()=>({data:{id:'inquiry-id',reference_code:'BF-TEST',name:'Test author',email:'test@example.com',service:'ebook-formatting'},error:null})})})}:{update:(payload:unknown)=>{mocks.update(payload);return {eq:async()=>({error:mocks.recordFailure?{message:'recording unavailable'}:null})}},select:()=>({eq:()=>({eq:()=>({single:async()=>({data:{status:mocks.alreadySent?'sent':'pending'}})})})})}})}));
import {deliverInquiryEmails} from '../../lib/bookforge/mail';
beforeEach(()=>{mocks.rpc.mockReset();mocks.update.mockReset();mocks.fetch.mockReset();mocks.recordFailure=false;mocks.alreadySent=false;vi.stubGlobal('fetch',mocks.fetch);vi.stubEnv('RESEND_API_KEY','test-only-key');vi.stubEnv('MAIL_FROM','Studio <test@example.com>');vi.stubEnv('AGENCY_INBOX','studio@example.com');mocks.rpc.mockImplementation((_name,args)=>Promise.resolve({data:[{id:'job-'+args.p_kind}],error:null}));mocks.fetch.mockImplementation(async()=>Response.json({id:'provider-test'}))});
describe('transactional email state',()=>{
 it('sends receipt and notification with distinct stable idempotency keys',async()=>{expect(await deliverInquiryEmails('inquiry-id')).toBe('sent');expect(mocks.fetch).toHaveBeenCalledTimes(2);expect(mocks.fetch.mock.calls[0][1].headers['Idempotency-Key']).toBe('bookforge/job-receipt');expect(mocks.fetch.mock.calls[1][1].headers['Idempotency-Key']).toBe('bookforge/job-notification')});
 it('keeps failed provider delivery pending',async()=>{mocks.fetch.mockResolvedValue(Response.json({message:'unavailable'},{status:503}));expect(await deliverInquiryEmails('inquiry-id')).toBe('pending');expect(mocks.update).toHaveBeenCalledWith({status:'pending',locked_until:null})});
 it('does not claim delivery when recording provider success fails',async()=>{mocks.recordFailure=true;expect(await deliverInquiryEmails('inquiry-id')).toBe('pending')});
 it('does not resend already completed jobs',async()=>{mocks.alreadySent=true;mocks.rpc.mockResolvedValue({data:[],error:null});expect(await deliverInquiryEmails('inquiry-id')).toBe('sent');expect(mocks.fetch).not.toHaveBeenCalled()});
 it('does not report success for a locked or uncertain job',async()=>{mocks.rpc.mockResolvedValue({data:[],error:null});expect(await deliverInquiryEmails('inquiry-id')).toBe('pending');expect(mocks.fetch).not.toHaveBeenCalled()});
});

