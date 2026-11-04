import Link from 'next/link';
import {notFound} from 'next/navigation';
import {published} from '@/lib/bookforge/database';
import {metadata,paragraphs} from '@/lib/bookforge/seo';
import {PageIntro,CTA} from '@/components/bookforge/ui';
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const item=(await published('articles')).find(e=>e.slug===slug);return metadata(item?.title||'Article not found',item?.summary||'Bookforge editorial notes.','/insights/'+slug)}
export default async function Article({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const item=(await published('articles')).find(e=>e.slug===slug);if(!item)notFound();return <><PageIntro label="From the publishing desk" title={item.title}><p>{item.summary}</p></PageIntro><article className="paper-section"><div className="wrap body-section prose"><p className="fine-print">Updated {new Date(item.updated_at).toISOString().slice(0,10)}{typeof item.data.author==='string'&&' · '+item.data.author}</p>{paragraphs(item.body).map((p,i)=><p key={i}>{p}</p>)}{typeof item.data.source==='string'&&<p><Link className="text-link" href={item.data.source}>Reference source</Link></p>}<CTA/></div></article></>}
