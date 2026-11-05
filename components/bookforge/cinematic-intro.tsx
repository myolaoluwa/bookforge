import type {ReactNode} from 'react';

export type IntroScene='editing'|'cloth'|'reading'|'binding';
const scenes:Record<IntroScene,{alt:string;caption:string}>={
 editing:{alt:'A pencil and annotated manuscript beside a forest-green clothbound book in warm light.',caption:'The editorial desk'},
 cloth:{alt:'Warm light tracing the linen texture and cream page edges of a green book.',caption:'An invitation to the story'},
 reading:{alt:'A cream book opening with a gently curved page in a pool of amber light.',caption:'The rhythm of a page'},
 binding:{alt:'A close study of linen thread and cream paper signatures being carefully bound.',caption:'Care in the details'},
};
export function CinematicIntro({scene,label,title,children}:{scene:IntroScene;label?:string;title:string;children?:ReactNode}){
 const image=scenes[scene];
 return <section className={'inner-intro inner-intro-'+scene} aria-labelledby="inner-title">
  <figure className="inner-intro-image"><picture><source media="(max-width:760px)" srcSet={'/craft/'+scene+'-mobile.webp'}/><img src={'/craft/'+scene+'.webp'} alt={image.alt} width={1600} height={900} fetchPriority="high"/></picture><figcaption>{image.caption}</figcaption></figure>
  <div className="wrap inner-intro-content"><div className="inner-intro-copy">{label&&<p className="kicker">{label}</p>}<h1 id="inner-title">{title}</h1>{children&&<div className="inner-intro-description">{children}</div>}</div></div>
 </section>;
}
