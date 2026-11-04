import Image from 'next/image';
import {notFound} from 'next/navigation';
import {published} from '@/lib/bookforge/database';
import {metadata,paragraphs} from '@/lib/bookforge/seo';
import {PageIntro,CTA} from '@/components/bookforge/ui';
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const person=(await published('team')).find(e=>e.slug===slug);return metadata(person?.title||'Profile not found',person?.summary||'Meet the Bookforge studio.','/team/'+slug)}
export default async function Profile({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const person=(await published('team')).find(e=>e.slug===slug);if(!person)notFound();return <><PageIntro label={String(person.data.role||'The studio')} title={person.title}><p>{person.summary}</p></PageIntro><section className="paper-section"><div className="wrap body-section prose">{typeof person.data.cover==='string'&&<Image className="detail-cover" src={person.data.cover} alt={String(person.data.alt||person.title)} width={480} height={560}/>}{paragraphs(person.body).map((p,i)=><p key={i}>{p}</p>)}<CTA/></div></section></>}
