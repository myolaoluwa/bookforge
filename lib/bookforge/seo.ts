import type {Metadata} from 'next';
import {site} from './config';
export function metadata(title:string,description:string,path:string):Metadata{return {title,description,alternates:{canonical:site.origin+path},robots:{index:site.indexable,follow:site.indexable},openGraph:{title,description,type:'website',url:site.origin+path,siteName:site.name,images:[{url:site.origin+'/brand/social.png',width:1200,height:630}]},twitter:{card:'summary_large_image',title,description}}}
export function paragraphs(body:string){return body.split(/\n\s*\n/).filter(Boolean)}
