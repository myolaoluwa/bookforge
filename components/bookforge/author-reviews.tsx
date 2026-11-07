import {published} from '@/lib/bookforge/database';
import {featuredFiverrReviews,type FeaturedReview} from '@/lib/bookforge/featured-reviews';
import {Arrow} from './ui';

export async function AuthorReviews(){
 const publishedReviews=(await published('testimonials')).filter(review=>
  review.permission_approved&&review.body.trim()&&
  typeof review.data.source==='string'&&/^https?:\/\//i.test(review.data.source)
 ).slice(0,6);
 const reviews:FeaturedReview[]=publishedReviews.length?publishedReviews.map(review=>({id:review.id,title:review.title,body:review.body,summary:review.summary,source:String(review.data.source)})):featuredFiverrReviews;
 const showingFiverr=!publishedReviews.length;
 return <section id="author-reviews" className="author-reviews paper-section" aria-labelledby="author-reviews-title">
  <div className="wrap">
   <div className="reviews-heading"><div><p className="kicker">Author reviews</p><h2 id="author-reviews-title">Behind every book.<br/><em>An author’s experience.</em></h2></div><p>{showingFiverr?'Selected feedback from Adele’s book-formatting clients on Fiverr. Short excerpts, in their own words.':'Choosing who works on your book is personal. Hear from authors who have shared their experience of working with BookForge.'}</p></div>
   {reviews.length?<div className="reviews-grid">{reviews.map(review=><figure className="review-card" key={review.id}>
    <span className="review-quote-mark" aria-hidden="true">“</span>
    {review.rating!==undefined&&<div className="review-rating" aria-label={`${review.rating} out of 5 stars on Fiverr`}><span aria-hidden="true">{'★'.repeat(review.rating)}<span className="review-unfilled">{'☆'.repeat(5-review.rating)}</span></span><span aria-hidden="true">{review.rating.toFixed(1)} / 5</span></div>}
    <blockquote><p>{review.body}</p></blockquote>
    <figcaption><strong>{review.title}</strong>{review.summary&&<span>{review.summary}</span>}{review.excerpt&&<span className="review-source">Fiverr review excerpt</span>}<a className="text-link" href={review.source} target="_blank" rel="noopener noreferrer">{review.excerpt?'Read reviews on Fiverr':'Read original review'} <Arrow/></a></figcaption>
   </figure>)}</div>:<div className="reviews-awaiting"><span className="review-quote-mark" aria-hidden="true">“</span><div><h3>A space for honest feedback.</h3><p>Client reviews will appear here once their authors have approved them for sharing.</p></div><a className="text-link" href="/portfolio">Explore the studio’s work <Arrow/></a></div>}
  </div>
 </section>;
}
