'use client';
/* eslint-disable @next/next/no-html-link-for-pages -- Native navigation avoids stalled Vinext client transitions. */
import {useEffect,useRef,useState,useSyncExternalStore} from 'react';
import {ReferenceFilm} from './shell';
import {Arrow,CTA} from './ui';
import {beatAt,storyBeats,taskAt} from '@/lib/bookforge/cinema';

const subscribeReady=()=>()=>{};
export function CinematicHero(){const hydrated=useSyncExternalStore(subscribeReady,()=>true,()=>false);const video=useRef<HTMLVideoElement>(null);const [beat,setBeat]=useState(0),[task,setTask]=useState(''),[playing,setPlaying]=useState(false),[reduced,setReduced]=useState(false),[unavailable,setUnavailable]=useState(false);const userPaused=useRef(false);
 useEffect(()=>{const media=video.current;if(!media)return;const preference=matchMedia('(prefers-reduced-motion: reduce)');const connection=(navigator as Navigator&{connection?:{saveData?:boolean}}).connection;function apply(){const limited=preference.matches||Boolean(connection?.saveData);setReduced(limited);if(limited){media!.autoplay=false;media!.pause();setBeat(3);setTask('')}}apply();preference.addEventListener('change',apply);const observer=new IntersectionObserver(([entry])=>{if(!entry.isIntersecting)media.pause();else if(!preference.matches&&!connection?.saveData&&!userPaused.current)void media.play().catch(()=>setPlaying(false))},{threshold:.15});observer.observe(media);function visibility(){if(document.hidden)media!.pause();else if(!preference.matches&&!connection?.saveData&&!userPaused.current)void media!.play().catch(()=>setPlaying(false))}document.addEventListener('visibilitychange',visibility);return ()=>{observer.disconnect();preference.removeEventListener('change',apply);document.removeEventListener('visibilitychange',visibility)}},[]);
 async function toggle(){const media=video.current;if(!media)return;if(!media.paused){userPaused.current=true;media.pause()}else{userPaused.current=false;try{await media.play()}catch{setUnavailable(true)}}}
 return <section className="cinematic-hero" aria-labelledby="cinematic-title">
  <link rel="preload" as="image" href="/reference/poster.webp" fetchPriority="high"/>
  <div className="cinema-environment" aria-hidden="true"/>
  <ReferenceFilm cinematic videoRef={video} onTimeUpdate={event=>{if(!reduced){setBeat(beatAt(event.currentTarget.currentTime));setTask(taskAt(event.currentTarget.currentTime))}}} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onError={()=>setUnavailable(true)}/>
  <div className="cinema-shade" aria-hidden="true"/>
  <div className="wrap cinema-content">
    <p className="kicker">For the story only you could write.</p>
    <h1 id="cinematic-title"><span>You wrote<br/>{' '}the book.</span><em>We’ll handle<br/>{' '}what comes next.</em></h1>
    <p className="hero-description">Book editing, formatting, cover design & publishing support. From your last full stop to your first reader.</p>
    <div className="cinema-actions"><CTA>Get a tailored quote</CTA><a className="quiet-link" href="/services">Explore the studio <Arrow/></a></div>
  </div>
  <div className="cinema-story" aria-hidden="true"><span className="story-folio">The next chapter</span><p key={beat}>{storyBeats[beat].text}</p><span className="story-task" key={task}>{task||storyBeats[beat].label}</span><div className="story-progress">{storyBeats.map((_,i)=><span key={i} data-active={i===beat}/>)}</div></div>
  <div className="cinema-bottom wrap"><a href="#craft" className="cinema-scroll"><Arrow down/><span>Discover the craft</span></a><div className="cinema-controls"><button type="button" aria-label={playing?'Pause cinematic film':'Play cinematic film'} onClick={()=>void toggle()} disabled={unavailable||!hydrated}><svg viewBox="0 0 24 24" aria-hidden="true"><path d={playing?'M9 5v14M15 5v14':'m8 5 11 7-11 7Z'}/></svg></button></div></div>
  {unavailable&&<p className="cinema-fallback" role="status">The film is unavailable. Your next chapter can still begin below.</p>}
 </section>
}
