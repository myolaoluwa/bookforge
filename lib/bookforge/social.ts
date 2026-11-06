import {authorMetadata} from './metadata-copy';
export const socialCards={
 home:{file:'bookforge-home-v3.png',alt:'BookForge: Your story. Beautifully finished. Warm-lit books, a forest-green hardcover and a fountain pen beside the studio logo.'},
 formatting:{file:'bookforge-formatting-v3.png',alt:'BookForge: A beautiful book, inside and out. Cinematic books and cream pages for print and ebook formatting.'},
 editing:{file:'bookforge-editing-v3.png',alt:'BookForge: Your voice. Every word, considered. A warmly lit writing desk with books and a fountain pen.'},
 covers:{file:'bookforge-covers-v3.png',alt:'BookForge: Your story. An irresistible first look. A forest-green clothbound book in warm copper light.'},
 discovery:{file:'bookforge-discovery-v3.png',alt:'BookForge: Your words. Their next great read. Warm-lit books with author presence and discovery support.'},
 resources:{file:'bookforge-resources-v3.png',alt:'BookForge: Your next chapter, made clearer. Practical author guidance beside a cinematic book still life.'}
} as const;
export type SocialCard=keyof typeof socialCards;
export function socialCardFor(path:string):SocialCard{
 if(path.startsWith('/resources')||path.startsWith('/insights'))return 'resources';
 if(path==='/services/manuscript-editing')return 'editing';
 if(path==='/services/book-cover-design')return 'covers';
 if(path==='/services/goodreads-author-setup'||path==='/services/book-marketing')return 'discovery';
 if(/^\/services\/(ebook|paperback|hardcover)-formatting$/.test(path)||path==='/services/kdp-publishing-preparation')return 'formatting';
 return 'home';
}
export function socialCopyFor(path:string,title:string,description:string){
 const copy=authorMetadata[path];
 return {title:copy?.shareTitle||copy?.title||title,description:copy?.description||description};
}
