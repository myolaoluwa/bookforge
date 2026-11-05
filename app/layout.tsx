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
import './inner-cinema.css';
export const metadata:Metadata={...pageMetadata('Bookforge Publishing Studio','Book editing, formatting, cover design and publishing support for independent authors.','/'),title:{default:'Bookforge Publishing Studio',template:'%s | Bookforge'},applicationName:site.name,referrer:'strict-origin-when-cross-origin'};
export const viewport={themeColor:'#111b1d',viewportFit:'cover'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><head><link rel="icon" href="/brand/bookforge-symbol-transparent.png"/><link rel="preload" href="/fonts/manrope-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/><link rel="preload" href="/fonts/cormorant-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/></head><body><a className="skip" href="#main">Skip to content</a><SoundControl/><Header/><main id="main">{children}</main><footer className="site-footer wrap"><div><a href="/" className="wordmark" aria-label="BookForge home"><BrandLogo id="footer-brand"/></a><p>Beautiful books are made<br/>with intention.</p></div><div><span className="footer-label">The studio</span><a href="/services">Publishing services</a><a href="/portfolio">Our work</a><a href="/process">Our process</a><a href="/pricing">Scope & pricing</a><a href="/working-together">Working together</a><a href="/about">About Bookforge</a></div><div><span className="footer-label">Your next chapter</span><a href="/request-a-proposal">Request a proposal <Arrow/></a><a href="/contact">Contact</a><a href="/resources">Author resources</a><a href="/consultation">Discuss your book</a><a href="/testimonials">Author feedback</a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Bookforge Publishing Studio</span><div><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/cookies">Cookies</a><a href="/accessibility">Accessibility</a><a href="/admin">Studio admin</a></div></div></footer></body></html>}
