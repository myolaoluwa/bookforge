import {SampleViewer} from '@/components/bookforge/sample-viewer';
import {ServiceFinder} from '@/components/bookforge/service-finder';
import {AuthorProof,SelectedWork,StudioPeople,ConsultationLink} from '@/components/bookforge/trust';
import {CTA,Arrow} from '@/components/bookforge/ui';
import {CinematicHero} from '@/components/bookforge/cinematic-hero';
import {PublishingPlatforms} from '@/components/bookforge/publishing-platforms';
import {services,steps} from '@/lib/bookforge/content';
import {metadata} from '@/lib/bookforge/seo';

export const generateMetadata=()=>metadata('Book editing, formatting & cover design','Bookforge helps independent authors with manuscript editing, ebook and print formatting, book covers, publishing preparation and author discovery.','/');

export default function Home(){return <div className="studio-home">
  <CinematicHero/>
  <PublishingPlatforms/>
  <section id="craft" className="paper-section">
    <div className="wrap craft-intro">
      <p className="kicker">A publishing studio for independent authors</p>
      <h2>A finished manuscript.<br/>A whole new <em>beginning.</em></h2>
      <div className="craft-copy"><p>You found the words. Now there are margins, covers, file formats and a hundred small decisions between your manuscript and your reader.</p><p>We bring editing, book design and publishing preparation into one thoughtful process. So the next chapter feels less overwhelming, and a lot more like yours.</p></div>
    </div>
    <div className="wrap service-editorial">
      <div><span className="section-label">The craft behind the book</span><h2>Care in<br/>every detail.</h2><a className="text-link" href="/services">Explore our services <Arrow/></a></div>
      <div className="service-links">{[services[0],services[1],services[2],services[5],services[4],services[7]].map(s=><a key={s.slug} href={'/services/'+s.slug}><span><strong>{s.name}</strong><small>{s.category}</small></span><Arrow/></a>)}</div>
    </div>
  </section>
  <section className="studio-study ink-section" aria-labelledby="study-title">
    <div className="wrap study-heading"><div><p className="kicker">An exploration of the craft</p><h2 id="study-title">Give the story<br/><em>room to breathe.</em></h2></div><p>A considered cover. A comfortable line. A page that quietly invites you to keep reading. The small decisions make the book.</p></div>
    <div className="wrap sample-section"><SampleViewer/></div>
    <div className="wrap study-note"><p>Original Bookforge design studies. Illustrative work, not client publications.</p><a className="text-link" href="/portfolio">Visit the project gallery <Arrow/></a></div>
  </section>
  <section className="paper-section"><div className="wrap trust-section"><SelectedWork/></div></section>
  <section className="wrap finder-layout trust-section"><div><p className="kicker">A useful place to begin</p><h2>The right help.<br/><em>A clear investment.</em></h2><p>Explore the services that fit your book and the decisions that shape a quote.</p><a className="text-link" href="/pricing">Scope & pricing <Arrow/></a><a className="text-link" href="/sample-proposal">See a sample proposal <Arrow/></a></div><ServiceFinder/></section>
  <div className="ensemble-band"><StudioPeople/></div>
  <section className="paper-section"><div className="wrap trust-section"><AuthorProof/></div></section>
  <section className="paper-section"><div className="wrap process-preview"><div className="process-intro"><p className="kicker">A clear path from here</p><h2>Your book.<br/>Our craft.<br/><em>One shared process.</em></h2><p>Know what happens next, what you’ll review, and what you’ll receive. Every project starts with a scope shaped around your manuscript.</p><a className="text-link" href="/process">How we work <Arrow/></a></div><ol>{steps.map(([title,copy])=><li key={title}><h3>{title}</h3><p>{copy}</p></li>)}</ol></div></section>
  <section className="author-presence"><div className="wrap author-layout"><div><p className="kicker">Beyond the finished page</p><h2>A place for<br/>your story<br/><em>to be found.</em></h2></div><div className="author-copy"><span className="author-platform">Goodreads author support</span><p>Help readers meet the person behind the pages. Bring your author profile, book listings and discovery plans into focus with thoughtful preparation and research.</p><div className="author-services"><span>Author identity</span><span>Book & series listings</span><span>Reader research</span></div><a className="text-link" href="/services/goodreads-author-setup">Find your path on Goodreads <Arrow/></a><p className="fine-print">The Goodreads Author Program is free. Our service covers professional preparation and research. Goodreads controls verification.</p></div></div></section>
  <section className="final-cta paper-section"><div className="wrap"><p className="kicker">Your next chapter starts with a conversation.</p><h2>You’ve done the writing.<br/><em>Let’s make it a book.</em></h2><CTA>Get a tailored quote</CTA><p>Tell us about your book. Review the scope before you commit.</p><ConsultationLink/></div></section>
</div>}
