import Link from 'next/link';
import {PageIntro} from '@/components/bookforge/ui';
export default function NotFound(){return <PageIntro label="404 / A page out of place" title="This chapter isn’t here."><p>The page may have moved or is not published. Return to the studio to find your next step.</p><Link href="/" className="button">Back to Bookforge</Link></PageIntro>}
