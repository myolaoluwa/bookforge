import { z } from 'zod';
import { services, packages, resources } from './content';
const text=(min:number,max:number)=>z.string().trim().min(min).max(max);
export const inquirySchema=z.object({
 requestId:z.string().uuid(),name:text(2,100),email:z.string().trim().email().max(254).refine(x=>!/[\r\n]/.test(x)),
 service:z.string().refine(s=>s==='unsure'||services.some(item=>item.slug===s),'Choose a service'),
 package:z.string().max(50).optional().default(''),stage:z.enum(['idea','draft','editing','ready','published','unsure']),
 projectTitle:text(0,200).default(''),genre:text(0,100).default(''),wordCount:z.number().int().min(0).max(5000000).optional(),
 platform:z.enum(['unsure','amazon-kdp','ingramspark','other','not-needed']).default('unsure'),
 formats:z.array(z.enum(['ebook','paperback','hardcover'])).max(3).default([]),deadline:z.string().max(30).default(''),
 description:text(20,6000),consent:z.literal(true),website:z.string().max(0).default(''),turnstileToken:text(1,4096)
}).strict().superRefine((value,ctx)=>{if(value.package && (value.service!=='goodreads-author-setup'||!packages.some(p=>p.slug===value.package)))ctx.addIssue({code:'custom',path:['package'],message:'Choose a Goodreads package or leave it blank'})});
export type Inquiry = z.infer<typeof inquirySchema>;
const safeData=z.object({storage_path:z.string().regex(/^[a-f0-9-]+\.(jpg|png|webp)$/).optional(),mime:z.enum(['image/jpeg','image/png','image/webp']).optional(),bytes:z.number().int().min(1).max(2000000).optional(),author:z.string().max(120).optional(),genre:z.string().max(100).optional(),services:z.array(z.string().max(80)).max(12).optional(),members:z.array(z.string().uuid()).max(12).optional(),cover:z.string().regex(/^\/media\/[a-zA-Z0-9_-]+$/).max(300).optional(),alt:z.string().max(300).optional(),deliverables:z.array(z.string().max(300)).max(20).optional(),source:z.string().url().max(1000).refine(s=>/^https?:\/\//.test(s),'Use an HTTP or HTTPS source').optional(),images:z.array(z.object({path:z.string().regex(/^\/media\/[a-zA-Z0-9_-]+$/).max(300),alt:text(5,300)}).strict()).max(12).optional(),role:z.string().max(100).optional(),target:z.string().regex(/^\/(?!\/)[a-zA-Z0-9/_-]*$/).max(300).optional(),rights_note:z.string().max(1000).optional()}).strict();
export const entrySchema=z.object({id:z.string().uuid().optional(),slug:text(1,120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),title:text(2,200),summary:text(0,600).default(''),body:text(0,20000).default(''),status:z.enum(['draft','published','archived']),permission_approved:z.boolean().default(false),data:safeData.default({}),seo_title:text(0,70).nullable().default(null),seo_description:text(0,180).nullable().default(null)}).strict();
export function canPublish(resource:string,entry:z.infer<typeof entrySchema>){
 if(entry.status!=='published')return true;
 if(!entry.summary || !entry.body)return false;
 if(['projects','team','testimonials','media'].includes(resource)&&!entry.permission_approved)return false;
 if(resource==='projects'&&(!entry.data.cover||!entry.data.alt||!entry.data.deliverables?.length))return false;
 if(resource==='testimonials'&&!entry.data.source)return false;
 return true;
}
export const resourceSchema=z.enum(resources);
export const statusSchema=z.enum(['new','reviewing','needs_information','proposal_sent','won','closed','archived']);
export const noteSchema=z.object({body:text(1,4000)}).strict();
export function canWrite(role:string|undefined){return role==='owner'||role==='editor'}
export function canDelete(role:string|undefined){return role==='owner'}
