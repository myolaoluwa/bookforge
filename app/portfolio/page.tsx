import Image from 'next/image';
import Link from 'next/link';
import {PageIntro,EmptyState,CTA,Arrow} from '@/components/bookforge/ui';
import {SelectedWork} from '@/components/bookforge/trust';
import {published} from '@/lib/bookforge/database';
import {services} from '@/lib/bookforge/content';
import {metadata} from '@/lib/bookforge/seo';
export const generateMetadata=()=>metadata('Book design & formatting portfolio','Explore original BookForge design concepts and permission approved book covers, interiors and publishing projects.','/portfolio');
export default async function Portfolio({searchParams}:{searchParams:Promise<{service?:string;q?:string}>}){
 const filter=await searchParams;const all=await published('projects');
 const entries=all.filter(p=>(!filter.service||(Array.isArray(p.data.services)&&p.data.services.includes(filter.service)))&&(!filter.q||(p.title+' '+p.summary).toLowerCase().includes(filter.q.toLowerCase())));
 return <><PageIntro title="The story behind the finished book."><p>Explore the art of the finished book through original studio concepts, and discover approved client projects as they become available.</p></PageIntro><section className="paper-section"><div className="wrap body-section">
  <Link href="/portfolio/concepts" className="portfolio-concept-link"><div><h2>The design collection</h2><p>Six original concepts. Covers, readable interiors and publishing formats.<br/>Explore the possibilities for your book.</p></div><Arrow/></Link>
  <form method="get" className="portfolio-search"><label htmlFor="project-search">Search published client projects</label><div className="form-row"><input id="project-search" name="q" defaultValue={filter.q||''} placeholder="Book title or project description"/>{filter.service&&<input type="hidden" name="service" value={filter.service}/>}<button className="button">Search projects</button></div></form>
  <nav className="filter-bar" aria-label="Project filters"><Link href="/portfolio" aria-current={!filter.service?'page':undefined}>All work</Link>{services.map(s=><Link key={s.slug} href={'/portfolio?service='+s.slug} aria-current={filter.service===s.slug?'page':undefined}>{s.name}</Link>)}</nav>
  {entries.length?<><p className="fine-print">{entries.length} published project{entries.length!==1?'s':''}</p><div className="project-grid">{entries.map(item=><article key={item.id} className="project-card">{typeof item.data.cover==='string'&&<Image src={item.data.cover} alt={String(item.data.alt||'')} width={360} height={480}/>}<h2><Link href={'/portfolio/'+item.slug}>{item.title}</Link></h2><p>{item.summary}</p></article>)}</div></>:<EmptyState title={all.length?'No projects match this view.':'Good work needs permission, too.'}>{all.length?'Try another service or clear your search to see the published collection.':'The client project gallery is awaiting approved covers, interiors and permissions. The separate design collection contains original studio concepts, not client publications.'}</EmptyState>}
  {!all.length&&<SelectedWork/>}<div className="page-end"><h2>Have a book in mind?</h2><CTA/></div>
 </div></section></>
}
