import Image from 'next/image';
import {notFound} from 'next/navigation';
import {published} from '@/lib/bookforge/database';
import {metadata,paragraphs} from '@/lib/bookforge/seo';
import {PageIntro,CTA} from '@/components/bookforge/ui';
import {adeleProfile} from '@/lib/bookforge/team';
import '../profile.css';
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const person=(await published('team')).find(e=>e.slug===slug);return metadata(person?.title||(slug===adeleProfile.slug?adeleProfile.name:'Profile not found'),person?.summary||(slug===adeleProfile.slug?adeleProfile.summary:'Meet the Bookforge studio.'),'/team/'+slug)}
export default async function Profile({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const person=(await published('team')).find(e=>e.slug===slug);
 if(!person&&slug===adeleProfile.slug)return <><PageIntro label={adeleProfile.role} title={adeleProfile.name}><p>{adeleProfile.summary}</p></PageIntro><section className="paper-section"><div className="wrap body-section adele-profile-layout"><aside><Image className="detail-cover" src={adeleProfile.portrait} alt={adeleProfile.alt} width={1122} height={1402}/><p className="adele-profile-credit">Adele Affie <span>Studio Director, BookForge</span></p><a className="text-link" href={adeleProfile.source} target="_blank" rel="noopener noreferrer">View my Fiverr profile & reviews ↗</a></aside><div className="prose">{adeleProfile.introduction.map(p=><p key={p}>{p}</p>)}<h2>My core expertise</h2><ul className="adele-expertise">{adeleProfile.expertise.map(item=><li key={item.title}><h3>{item.title}</h3><p>{item.description}</p></li>)}</ul>{adeleProfile.closing.map(p=><p key={p}>{p}</p>)}<CTA>Tell us about your book</CTA></div></div></section></>;
 if(!person)notFound();return <><PageIntro label={String(person.data.role||'The studio')} title={person.title}><p>{person.summary}</p></PageIntro><section className="paper-section"><div className="wrap body-section prose">{typeof person.data.cover==='string'&&<Image className="detail-cover" src={person.data.cover} alt={String(person.data.alt||person.title)} width={480} height={560}/>}{paragraphs(person.body).map((p,i)=><p key={i}>{p}</p>)}<CTA/></div></section></>;
}
