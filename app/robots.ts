import {site} from '@/lib/bookforge/config';
export default function robots(){return {rules:{userAgent:'*',allow:site.indexable?'/':undefined,disallow:site.indexable?['/admin','/api','/request-a-proposal']:['/']},sitemap:site.origin+'/sitemap.xml'}}
