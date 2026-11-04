import {serviceClient} from './database';
import {mailReady} from './config';
export async function deliverInquiryEmails(inquiryId:string){
 if(!mailReady())return 'pending';const db=serviceClient();if(!db)return 'pending';
 const {data:inquiry,error}=await db.from('inquiries').select('id,reference_code,name,email,service,status').eq('id',inquiryId).single();if(error||!inquiry)return 'pending';
 let complete=true;
 for(const kind of ['receipt','notification']){
  const {data:jobs,error:claimError}=await db.rpc('claim_email',{p_inquiry_id:inquiryId,p_kind:kind});if(claimError){complete=false;continue}const job=jobs?.[0];
  if(!job){const {data:existing}=await db.from('email_events').select('status').eq('inquiry_id',inquiryId).eq('kind',kind).single();if(existing?.status!=='sent')complete=false;continue}
  const recipient=kind==='receipt'?inquiry.email:process.env.AGENCY_INBOX!;
  const text=kind==='receipt'?`Hello ${inquiry.name},\n\nYour Bookforge inquiry has been received.\nReference: ${inquiry.reference_code}\nService: ${inquiry.service}\n\nThis receipt confirms your inquiry was saved. It is not a proposal or a commitment to a delivery date. Please keep your reference for follow up.\n\nBookforge Publishing Studio`:`New Bookforge inquiry\nReference: ${inquiry.reference_code}\nService: ${inquiry.service}\n\nSign in to the studio admin to review the private inquiry. This notification intentionally omits the manuscript description.`;
  try{const result=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+process.env.RESEND_API_KEY,'Content-Type':'application/json','Idempotency-Key':'bookforge/'+job.id},body:JSON.stringify({from:process.env.MAIL_FROM,to:[recipient],subject:kind==='receipt'?'Your Bookforge inquiry · '+inquiry.reference_code:'New Bookforge inquiry · '+inquiry.reference_code,text}),signal:AbortSignal.timeout(15000)});if(!result.ok)throw new Error('Mail provider rejected request');const response=await result.json() as {id:string};if(!response.id)throw new Error('Missing provider reference');const {error:recordError}=await db.from('email_events').update({status:'sent',provider_message_id:response.id,locked_until:null}).eq('id',job.id);if(recordError)complete=false}catch{complete=false;await db.from('email_events').update({status:'pending',locked_until:null}).eq('id',job.id)}
 }
 return complete?'sent':'pending';
}
