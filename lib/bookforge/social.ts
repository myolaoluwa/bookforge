export const socialCards={
 home:{file:'bookforge-home-v1.png',alt:'Bookforge Publishing Studio. You wrote the book. Editing, formatting and cover design for your next chapter.'},
 formatting:{file:'bookforge-formatting-v1.png',alt:'Bookforge book formatting. Pages worth turning. Print and ebook interiors shaped around your story.'},
 editing:{file:'bookforge-editing-v1.png',alt:'Bookforge manuscript editing. Make every sentence count. A clear editorial scope for your manuscript.'},
 covers:{file:'bookforge-covers-v1.png',alt:'Bookforge cover design. An invitation to your story. Book identity for print and digital editions.'},
 discovery:{file:'bookforge-discovery-v1.png',alt:'Bookforge author discovery. Meet your next reader. Author presence, book listings and reader research.'},
 resources:{file:'bookforge-resources-v1.png',alt:'Bookforge author resources. A clearer next chapter. Practical checklists for manuscripts, proofs and final files.'}
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
 const serviceCopy:Record<string,{title:string;description:string}>={
  '/services/manuscript-editing':{title:'A clearer manuscript. Still your voice.',description:'Careful manuscript editing with the level of intervention agreed before work begins. Explore Bookforge’s editorial approach and request a tailored proposal.'},
  '/services/ebook-formatting':{title:'Your story, ready for its digital edition.',description:'Reflowable EPUB formatting, clear navigation and a considered reading layout. Explore ebook production with Bookforge Publishing Studio.'},
  '/services/paperback-formatting':{title:'Give your book pages worth turning.',description:'Considered margins, chapter openings and a print interior shaped around your manuscript. Explore paperback formatting and plan your next step.'},
  '/services/hardcover-formatting':{title:'A lasting edition. Care in every detail.',description:'Hardcover interior formatting around your chosen binding and printer specifications. Shape a clear production brief with Bookforge.'},
  '/services/book-cover-design':{title:'Give your story a cover worth opening.',description:'Book cover design shaped by your genre, reader and creative brief. Explore a considered identity for your print and digital editions.'},
  '/services/goodreads-author-setup':{title:'A clearer author presence on Goodreads.',description:'Author profile preparation, book listing review and reader research. An independent service; Goodreads controls verification and its Author Program is free.'},
  '/services/book-marketing':{title:'Meet your next reader with a thoughtful plan.',description:'Reader positioning, comparable-author research and a practical discovery brief. Explore Bookforge’s approach to book marketing.'}
 };
 if(serviceCopy[path])return serviceCopy[path];
 if(path==='/')return {title:'You wrote the book. We’ll handle what comes next.',description:'Editing, book formatting, cover design and publishing support for independent authors. Discover Bookforge and request a proposal shaped around your book.'};
 if(path==='/services')return {title:'Your manuscript. A book ready for readers.',description:'Explore book editing, print and ebook formatting, cover design and publishing preparation. Find the right help for your next chapter.'};
 if(path==='/pricing')return {title:'Book production, with a clear scope.',description:'Understand the work, the deliverables and the decisions behind your quote. Plan your book’s next chapter with Bookforge Publishing Studio.'};
 return {title,description};
}
