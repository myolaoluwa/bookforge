import Link from 'next/link';
import type { ReactNode } from 'react';
export function Arrow({down=false}:{down?:boolean}){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d={down?'M12 4v16m-6-6 6 6 6-6':'M5 19 19 5M5 5h14v14'}/></svg>}
export function Mark(){return <svg viewBox="0 0 215 256" aria-hidden="true"><image href="/brand/bookforge-symbol.png" width="215" height="256"/></svg>}
export function BrandLogo(){return <span className="brand-logo" role="img" aria-label="BookForge"><img className="brand-logo-symbol" src="/brand/bookforge-symbol.png" width="34" height="40" alt=""/><img className="brand-logo-name" src="/brand/bookforge-wordmark.webp" width="145" height="33" alt=""/></span>}
export function CTA({children='Get a tailored quote',service,tier,secondary=false}:{children?:ReactNode;service?:string;tier?:string;secondary?:boolean}){const query=new URLSearchParams();if(service)query.set('service',service);if(tier)query.set('tier',tier);return <Link className={secondary?'button secondary':'button'} href={'/request-a-proposal'+(query.size?'?'+query:'')}>{children}<Arrow/></Link>}
export function PageIntro({label,title,children}:{label?:string;title:string;children?:ReactNode}){return <section className="page-intro wrap">{label&&<p className="kicker">{label}</p>}<h1>{title}</h1>{children&&<div className="intro-copy">{children}</div>}</section>}
export function EmptyState({title,children}:{title:string;children:ReactNode}){return <div className="empty-state"><Mark/><h2>{title}</h2><p>{children}</p></div>}
