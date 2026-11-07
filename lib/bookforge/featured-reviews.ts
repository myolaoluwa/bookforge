// Selected public excerpts from the gig supplied by the studio owner.
// Checked 2026-11-07. Keep wording, public usernames and individual ratings intact.
export type FeaturedReview={id:string;title:string;body:string;summary:string;source:string;rating?:number;excerpt?:boolean};
const source='https://www.fiverr.com/verifiled_aff/book-formatting-amazon-kdp-paperback-or-kindle-ebook-formatting';
export const featuredFiverrReviews:FeaturedReview[]=[
 {id:'fiverr-jaden-stewart23',title:'jaden_stewart23',body:'she clearly delivers with no fuss.',summary:'Philippines · Book formatting',rating:5,source,excerpt:true},
 {id:'fiverr-resilientsoil',title:'resilientsoil',body:'she went above and beyond',summary:'United States · Book formatting',rating:5,source,excerpt:true},
 {id:'fiverr-rswatosh',title:'rswatosh',body:'They were very professional to work with.',summary:'United States · Book formatting',rating:4,source,excerpt:true},
 {id:'fiverr-tmthomas007',title:'tmthomas007',body:'Very attentive and responsive.',summary:'United States · Returning formatting client',rating:5,source,excerpt:true}
];
