import type {Metadata} from 'next';
import {CinematicHero} from '@/components/bookforge/cinematic-hero';
import {PublishingPlatforms} from '@/components/bookforge/publishing-platforms';
import {AuthorReviews} from '@/components/bookforge/author-reviews';
import './caption-position.css';

export const metadata:Metadata={title:'Hero design preview',robots:{index:false,follow:false}};
export default function HeroPreviewPage(){return <><CinematicHero captionTop/><PublishingPlatforms/><AuthorReviews/></>}
