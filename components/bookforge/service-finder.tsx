'use client';
import Link from 'next/link';
import {useState,useSyncExternalStore} from 'react';
import {Arrow} from './ui';
import {services} from '@/lib/bookforge/content';

const suggestions:Record<string,string[]>={draft:['manuscript-editing'],ready:['ebook-formatting','paperback-formatting'],cover:['book-cover-design'],publish:['kdp-publishing-preparation'],discovery:['goodreads-author-setup','book-marketing']};
const subscribeReady=()=>()=>{};
export function ServiceFinder(){const ready=useSyncExternalStore(subscribeReady,()=>true,()=>false);const [need,setNeed]=useState('unsure');const matches=suggestions[need]||[];return <div className="service-finder"><label htmlFor="service-need">Where would a little help make the difference?</label><select disabled={!ready} id="service-need" value={need} onChange={e=>setNeed(e.target.value)}><option value="unsure">I’m not sure where to begin</option><option value="draft">My manuscript needs editorial care</option><option value="ready">My edited book needs its interior prepared</option><option value="cover">My book needs a cover</option><option value="publish">I’m preparing to publish on KDP</option><option value="discovery">My author presence needs attention</option></select><div className="finder-result" aria-live="polite"><p>{matches.length?'These services could fit your next step. We will confirm the scope after reading your brief.':'You do not need the perfect brief. Tell us where you are, and we can clarify the next step.'}</p>{matches.map(slug=><Link className="text-link" key={slug} href={'/services/'+slug}>{services.find(s=>s.slug===slug)?.name}<Arrow/></Link>)}<Link className="text-link" href={'/request-a-proposal'+(matches.length===1?'?service='+matches[0]:'')}>Get a tailored quote <Arrow/></Link></div></div>}
