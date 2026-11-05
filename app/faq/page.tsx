import {PageIntro,CTA} from '@/components/bookforge/ui';
import {AuthorFAQ} from '@/components/bookforge/trust';
import {metadata} from '@/lib/bookforge/seo';

export const generateMetadata=()=>metadata('Frequently asked questions','Answers to common questions about editing, book design, publishing preparation, pricing and working with BookForge.','/faq');

export default function FAQ(){return <>
 <PageIntro label="Before your next chapter" title="Frequently asked questions."><p>A little clarity before we begin. Find answers about the work, the scope and what happens next.</p></PageIntro>
 <AuthorFAQ/>
 <section className="wrap page-end"><h2>Still have a question?</h2><p>Tell us about your book and the help you need.</p><CTA/></section>
</>}
