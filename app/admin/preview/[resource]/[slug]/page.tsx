import Link from 'next/link';
import {redirect,notFound} from 'next/navigation';
import {adminIdentity} from '@/lib/bookforge/database';
import {resourceSchema} from '@/lib/bookforge/validation';
import {paragraphs} from '@/lib/bookforge/seo';
import {PageIntro} from '@/components/bookforge/ui';
export default async function Preview({params}:{params:Promise<{resource:string;slug:string}>}){const identity=await adminIdentity();if(!identity)redirect('/admin/login');const {resource,slug}=await params;if(!resourceSchema.safeParse(resource).success)notFound();const {data}=await identity.db.from(resource).select('*').eq('slug',slug).maybeSingle();if(!data)notFound();return <><PageIntro label={'Private preview · '+data.status} title={data.title}><p>{data.summary}</p></PageIntro><section className="paper-section"><div className="wrap body-section prose">{paragraphs(data.body).map((p,i)=><p key={i}>{p}</p>)}<Link href={'/admin/'+resource} className="button">Return to the content manager</Link></div></section></>}
