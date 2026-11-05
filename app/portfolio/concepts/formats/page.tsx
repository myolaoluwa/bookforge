import Link from 'next/link';
import {FormatExplorer} from '@/components/bookforge/design-collection';
import {Arrow} from '@/components/bookforge/ui';
import {metadata} from '@/lib/bookforge/seo';
export const generateMetadata=()=>metadata('One story, many formats','See how a BookForge specimen changes between paperback, hardcover, reflowable EPUB and large print.','/portfolio/concepts/formats');
export default function Formats(){return <div className="design-collection"><header className="wrap collection-heading"><div><p className="kicker">One story, many formats</p><h1>Every edition.<br/>Its own decisions.</h1></div><div className="intro-copy"><p>A book is more than a document resized. Compare a flexible paperback, a lasting hardcover, an adaptable digital reading layout and a large print study.</p><Link className="text-link" href="/portfolio/concepts">Back to the collection <Arrow/></Link></div></header><div className="wrap collection-body"><FormatExplorer/><div className="collection-paths"><Link href="/portfolio/concepts/the-unquiet-coast">The complete book study <Arrow/></Link><Link href="/services">Explore publishing services <Arrow/></Link></div></div></div>}
