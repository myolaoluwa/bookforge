import Link from 'next/link';
import type {Metadata} from 'next';
import {metadata as pageMetadata} from '@/lib/bookforge/seo';
import {site} from '@/lib/bookforge/config';
import {Header,SoundControl} from '@/components/bookforge/shell';
import {BrandLogo,Arrow} from '@/components/bookforge/ui';
import './globals.css';
import './editorial.css';
import './cinematic.css';
import './trust.css';
import './responsive.css';
import './ensemble.css';
import './craft.css';
export const metadata:Metadata={...pageMetadata('Bookforge Publishing Studio','Book editing, formatting, cover design and publishing support for independent authors.','/'),title:{default:'Bookforge Publishing Studio',template:'%s | Bookforge'},applicationName:site.name,referrer:'strict-origin-when-cross-origin'};
export const viewport={themeColor:'#111b1d',viewportFit:'cover'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><head><link rel="icon" href="/brand/bookforge-symbol-transparent.png"/><link rel="preload" href="/fonts/manrope-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/><link rel="preload" href="/fonts/cormorant-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/></head><body><Link className="skip" href="#main">Skip to content</Link><SoundControl/><Header/><main id="main">{children}</main><footer className="site-footer wrap"><div><a href="/" className="wordmark" aria-label="BookForge home"><BrandLogo id="footer-brand"/></a><p>Beautiful books are made<br/>with intention.</p></div><div><span className="footer-label">The studio</span><Link href="/services">Publishing services</Link><Link href="/portfolio">Our work</Link><Link href="/process">Our process</Link><Link href="/pricing">Scope & pricing</Link><Link href="/working-together">Working together</Link><Link href="/about">About Bookforge</Link></div><div><span className="footer-label">Your next chapter</span><Link href="/request-a-proposal">Request a proposal <Arrow/></Link><Link href="/contact">Contact</Link><Link href="/resources">Author resources</Link><Link href="/consultation">Discuss your book</Link><Link href="/testimonials">Author feedback</Link></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Bookforge Publishing Studio</span><div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/cookies">Cookies</Link><Link href="/accessibility">Accessibility</Link><Link href="/admin">Studio admin</Link></div></div></footer></body></html>}
