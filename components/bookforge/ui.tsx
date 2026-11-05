import Link from 'next/link';
import type { ReactNode } from 'react';
export function Arrow({down=false}:{down?:boolean}){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d={down?'M12 4v16m-6-6 6 6 6-6':'M5 19 19 5M5 5h14v14'}/></svg>}
export function Mark(){return <svg viewBox="0 0 36 42" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><path d="M4 4h13v32H4zM19 4h13v32H19zM8 9h5M23 9h5M8 13h5M23 13h5M2 39h32"/></svg>}
export function CTA({children='Get a tailored quote',service,tier,secondary=false}:{children?:ReactNode;service?:string;tier?:string;secondary?:boolean}){const query=new URLSearchParams();if(service)query.set('service',service);if(tier)query.set('tier',tier);return <Link className={secondary?'button secondary':'button'} href={'/request-a-proposal'+(query.size?'?'+query:'')}>{children}<Arrow/></Link>}
export function PageIntro({label,title,children}:{label?:string;title:string;children?:ReactNode}){return <section className="page-intro wrap">{label&&<p className="kicker">{label}</p>}<h1>{title}</h1>{children&&<div className="intro-copy">{children}</div>}</section>}
export function EmptyState({title,children}:{title:string;children:ReactNode}){return <div className="empty-state"><Mark/><h2>{title}</h2><p>{children}</p></div>}
