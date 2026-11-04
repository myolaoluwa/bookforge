import {inquirySchema} from '@/lib/bookforge/validation';
import {inquiriesReady} from '@/lib/bookforge/config';
import {serviceClient} from '@/lib/bookforge/database';
import {json,sameOrigin,smallJson} from '@/lib/bookforge/http';
import {deliverInquiryEmails} from '@/lib/bookforge/mail';
async function hash(text:string){const value=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));return Array.from(new Uint8Array(value),b=>b.toString(16).padStart(2,'0')).join('')}
export async function POST(request:Request){
 if(!sameOrigin(request))return json({message:'This request must come from the studio website.'},403);
 if(!inquiriesReady())return json({message:'Inquiry delivery is not configured. No information has been saved or sent.'},503);
 let input:unknown;try{input=await smallJson(request)}catch{return json({message:'We could not read this inquiry. Please check the form.'},400)}
 const parsed=inquirySchema.safeParse(input);if(!parsed.success)return json({message:'Check your contact information, service, project description and consent.',fields:parsed.error.flatten().fieldErrors},422);
 const {turnstileToken,requestId,...raw}=parsed.data;
 const details={...raw,website:undefined};
 try{
  const verify=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:new URLSearchParams({secret:process.env.TURNSTILE_SECRET_KEY!,response:turnstileToken,idempotency_key:requestId}),signal:AbortSignal.timeout(10000)});const verdict=await verify.json() as {success:boolean;hostname?:string;action?:string};
  if(!verdict.success||verdict.hostname!==new URL(request.url).hostname||verdict.action!=='proposal')return json({message:'Verification expired or failed. Please complete it again.'},422);
  const ip=request.headers.get('cf-connecting-ip')||'unknown';const fingerprint=await hash(JSON.stringify(details));const ipHash=await hash(process.env.RATE_LIMIT_SALT!+ip);
  const db=serviceClient()!;const {data,error}=await db.rpc('submit_inquiry',{p_request_id:requestId,p_fingerprint:fingerprint,p_rate_key:ipHash,p_payload:details});
  if(error){if(error.message.includes('rate_limited'))return json({message:'Too many inquiries were received. Please try again later.'},429);if(error.message.includes('idempotency_conflict'))return json({message:'This submission changed during a retry. Reload the page before sending a new inquiry.'},409);throw error}
  const saved=data?.[0];if(!saved)throw new Error('No saved reference');const emailStatus=await deliverInquiryEmails(saved.id);return json({reference:saved.reference_code,emailStatus},201);
 }catch{return json({message:'We could not confirm your inquiry. Your details remain in the form. Retry with the same page to avoid a duplicate.'},503)}
}
