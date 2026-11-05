import Link from 'next/link';
import {PageIntro,Arrow} from '@/components/bookforge/ui';
import {authorResources} from '@/lib/bookforge/resources';
import {metadata} from '@/lib/bookforge/seo';
export const generateMetadata=()=>metadata('Practical author checklists','Prepare your manuscript brief, review proofs and understand your final book production handoff.','/resources');
export default function Resources(){return <><PageIntro scene="editing" label="A little preparation goes a long way" title="Make the next step clearer."><p>Practical studio checklists for preparing a brief, reviewing a proof and keeping track of your finished files. No signup required.</p></PageIntro><section className="paper-section"><div className="wrap body-section resource-list">{authorResources.map(r=><article key={r.slug}><h2><Link href={'/resources/'+r.slug}>{r.title}</Link></h2><p>{r.summary}</p><Link className="text-link" href={'/resources/'+r.slug}>Read the checklist <Arrow/></Link></article>)}</div></section></>}
