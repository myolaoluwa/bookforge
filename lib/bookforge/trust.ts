import profile from '@/content/studio-profile.json';

export const studioProfile=profile;
export function consultationUrl(value=process.env.CONSULTATION_URL||profile.consultationUrl){
 try{const url=new URL(value);return url.protocol==='https:'&&!url.username&&!url.password?url.href:''}catch{return ''}
}
export function startingPrice(entry:{from:number|null;scope:string;currency:string}|undefined){
 if(!entry||typeof entry.from!=='number'||!Number.isFinite(entry.from)||entry.from<0||!entry.scope.trim())return null;
 try{return new Intl.NumberFormat('en',{style:'currency',currency:entry.currency}).format(entry.from)}catch{return null}
}
export function priceLabel(service:string){return startingPrice(profile.pricing.find(p=>p.service===service))}
export const authorQuestions=[
 ['What happens after I request a quote?','We review your brief and clarify anything needed to define the work. A written proposal sets out deliverables, responsibilities, timing, cost and review stages. An inquiry does not place an order or reserve a production slot.'],
 ['Do I need to know all the technical details?','No. Tell us what you have and what you hope to publish. You can choose “I’m not sure” for formats and publishing platforms. We can identify the decisions that belong in your brief.'],
 ['Is editing included in formatting?','Editing changes or corrects the text. Formatting shapes the reading layout. They are separate services; your proposal identifies which work is included. Final text should be agreed before full pagination.'],
 ['Can I see a sample before the full layout?','The proposal should identify the sample or first direction you will review, the feedback checkpoint and the approval needed before the full production stage. The viewer on this site contains labeled original demonstrations.'],
 ['How are revisions and corrections handled?','Your proposal defines included review rounds, the window for reporting corrections and how extra work is quoted. Author rewrites, additional editions and changes after approval can affect layout and timing. Any provider-error correction commitment must be stated in the proposal.'],
 ['What happens to my manuscript and rights?','Keep control of your manuscript and publishing accounts. Do not send full manuscripts or passwords through the public inquiry form. Before production, agree file access, confidentiality, retention, design licenses, source files and any portfolio permission in writing.'],
 ['When do I pay, and what if I cancel?','Payment stages, accepted methods and cancellation arrangements must appear in your written proposal before you accept it. The website does not take a payment or create a publishing contract when you request a quote.'],
 ['Do you guarantee sales or publishing approval?','No. Retailers, printers and reader communities make their own decisions. A project can define file checks and support responsibilities; it cannot guarantee sales, reviews, rankings or platform approval.']
] as const;
export const serviceConsiderations=[
 ['Formats & platforms','Print and ebook editions have different requirements. Name your intended formats and platform, or ask for help choosing.'],
 ['Complexity','Images, tables, footnotes, illustration, indexing and specialist layouts can change scope and cost.'],
 ['Timing & review','The start date, first sample, review rounds and final handoff are agreed around your manuscript and the studio’s capacity.'],
 ['Files & ownership','Your proposal identifies final file formats, any source files, artwork licenses and the rights that transfer.']
] as const;
