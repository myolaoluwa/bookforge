'use client';
import Link from 'next/link';
export default function ErrorPage({reset}:{reset:()=>void}){return <section className="wrap page-end"><h1>A pause in the story.</h1><p>This page could not load. Please try again. Your inquiry has not been submitted by this page.</p><button className="button" onClick={reset}>Try this page again</button><Link className="text-link" href="/">Return to the studio</Link></section>}
