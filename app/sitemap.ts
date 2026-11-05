import {site} from '@/lib/bookforge/config';
import {publicRoutes} from '@/lib/bookforge/content';
import {published} from '@/lib/bookforge/database';
export default async function sitemap(){if(!site.indexable)return [];const paths=[...publicRoutes.filter(p=>p!=='/request-a-proposal'),...(await published('projects')).map(e=>'/portfolio/'+e.slug),...(await published('articles')).map(e=>'/insights/'+e.slug),...(await published('team')).map(e=>'/team/'+e.slug)];return paths.map(path=>({url:site.origin+path}))}
