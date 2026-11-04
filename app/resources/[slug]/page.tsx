import Link from 'next/link';
import {notFound} from 'next/navigation';
import {PageIntro,Arrow,CTA} from '@/components/bookforge/ui';
import {authorResources} from '@/lib/bookforge/resources';
import {metadata} from '@/lib/bookforge/seo';
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const r=authorResources.find(r=>r.slug===slug);return metadata(r?.title||'Checklist not found',r?.summary||'Author resources.','/resources/'+slug)}
export default async function Resource({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const r=authorResources.find(r=>r.slug===slug);if(!r)notFound();return <><PageIntro label="From the Bookforge desk" title={r.title}><p>{r.intro}</p></PageIntro><section className="paper-section"><article className="wrap body-section resource-article"><ol>{r.items.map(([title,copy])=><li key={title}><h2>{title}</h2><p>{copy}</p></li>)}</ol><p className="fine-print">General preparation guidance. Your project’s agreed scope, permissions and production requirements take precedence.</p><Link className="text-link" href="/resources">All author resources <Arrow/></Link><div className="page-end"><CTA>Get a tailored quote</CTA></div></article></section></>}
