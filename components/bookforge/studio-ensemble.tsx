'use client';
import Image from 'next/image';
import Link from 'next/link';
import {useEffect,useRef,useState,useSyncExternalStore} from 'react';
import {Arrow} from './ui';
import type {DomeController} from './portrait-dome';

export type StudioIntroduction={id:string;name:string;role:string;summary:string;portrait?:string;alt?:string;href?:string;placeholder?:boolean};
const slots:StudioIntroduction[]=[
 {id:'studio',name:'The first impression',role:'Cover craft',summary:'A considered cover brings together the story, its genre and the reader it hopes to reach.',portrait:'/craft/cloth.webp',alt:'Cinematic green cloth cover study.'},
 {id:'editorial',name:'A rhythm for reading',role:'Editorial craft',summary:'A clear chapter opening, a comfortable line and room at the binding edge. Small decisions make the reading experience.',portrait:'/craft/reading.webp',alt:'Cinematic open book and softly curved page.'},
 {id:'production',name:'Care in the making',role:'Book production',summary:'Paper, binding and format each have their own requirements. Preparation follows the edition you want to make.',portrait:'/craft/binding.webp',alt:'Illustrative hands guiding copper thread through paper signatures.'},
];
const subscribeReady=()=>()=>{};
export function StudioEnsemble({people}:{people:StudioIntroduction[]}){
 const entries=people.length?people.map((person,index)=>({...person,portrait:person.portrait||slots[index%slots.length].portrait,alt:person.portrait?person.alt:'Illustrative bookmaking scene; not a staff portrait.'})):slots;
 const hydrated=useSyncExternalStore(subscribeReady,()=>true,()=>false);
 const [selected,setSelected]=useState(0),[mode,setMode]=useState<'still'|'interactive'>('still'),[moving,setMoving]=useState(false);
 const host=useRef<HTMLDivElement>(null),canvas=useRef<HTMLCanvasElement>(null),controller=useRef<DomeController|null>(null);
 const person=entries[Math.min(selected,entries.length-1)];
 const selectedRef=useRef(selected);
 useEffect(()=>{selectedRef.current=selected},[selected]);
 useEffect(()=>{
  const area=host.current,surface=canvas.current;if(!area||!surface)return;
  let disposed=false,starting=false,visible=false;
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  const stop=()=>{controller.current?.destroy();controller.current=null;setMode('still');setMoving(false)};
  const start=async()=>{if(disposed||starting||preference.matches||controller.current||!visible)return;starting=true;try{
   const {createPortraitDome}=await import('./portrait-dome');await document.fonts.ready;
   if(disposed||preference.matches||!visible)return;
   controller.current=createPortraitDome(surface,area,entries,{select:setSelected,moving:setMoving,fallback:stop},selectedRef.current);
   if(controller.current)setMode('interactive');
  }catch{stop()}finally{starting=false}};
  const update=()=>{stop();if(!preference.matches)void start()};
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;controller.current?.visible(visible);if(visible)void start()},{rootMargin:'180px'});
  observer.observe(area);preference.addEventListener('change',update);
  return()=>{disposed=true;observer.disconnect();preference.removeEventListener('change',update);controller.current?.destroy();controller.current=null};
 },[people]);
 useEffect(()=>{if(mode!=='still')return;const rail=host.current?.querySelector<HTMLElement>('.portrait-still'),card=rail?.children[selected] as HTMLElement|undefined;if(rail&&card)rail.scrollTo({left:card.offsetLeft-rail.offsetLeft-(rail.clientWidth-card.clientWidth)/2,behavior:'instant'})},[selected,mode]);
 function choose(index:number){setSelected(index);controller.current?.goTo(index)}
 function step(direction:number){choose((selected+direction+entries.length)%entries.length)}
 return <section className="ensemble" id="people" aria-labelledby="studio-people-heading" data-gallery-mode={mode} data-moving={moving}>
  <div className="ensemble-heading"><p className="ensemble-label">The Bookforge studio</p><h2 id="studio-people-heading">{people.length?<>The minds behind<br/><em>your book.</em></>:<>The craft behind<br/><em>every chapter.</em></>}</h2><p>{people.length?<>Different perspectives.<br/>One shared care for your story.</>:<>Paper. Type. Texture.<br/>A closer look at the making.</>}</p></div>
  <div ref={host} className="portrait-dome" role="region" aria-roledescription="carousel" aria-label={people.length?"Studio portrait gallery":"Bookmaking scene gallery"} aria-describedby="portrait-gallery-help" tabIndex={mode==='interactive'?0:undefined} onKeyDown={event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();step(event.key==='ArrowRight'?1:-1)}}}>
   <span className="dome-word" aria-hidden="true">Bookforge</span><canvas ref={canvas} className="portrait-canvas" aria-hidden="true"/>
   <div className="portrait-still" role="group" aria-label={people.length?"Studio portraits":"Bookmaking scenes"} tabIndex={mode==='still'?0:undefined}>{entries.map((entry,index)=><button key={entry.id} type="button" className="portrait-print" disabled={!hydrated} aria-pressed={selected===index} aria-controls="studio-introduction-bio" onClick={()=>choose(index)}>
    {entry.portrait?<Image src={entry.portrait} alt={entry.alt||'Portrait of '+entry.name} width={640} height={800} sizes="(max-width: 760px) 70vw, 320px"/>:<div className="portrait-placeholder" aria-hidden="true"><span>Bookforge / Studio</span><strong>{entry.role}</strong><span>Portrait placeholder</span></div>}<span className="portrait-print-caption">{entry.placeholder?entry.role+' ? Introduction placeholder':entry.name}</span>
   </button>)}</div>
   <p className="dome-gesture" id="portrait-gallery-help">{mode==='interactive'?'Drag to explore · Swipe on mobile · Arrow keys':'Choose a scene or use the controls below'}</p>
  </div>
  <div className="ensemble-reading"><div className="ensemble-selection"><div className="ensemble-label">{person.placeholder?'Introduction placeholder':person.role}</div><h3>{person.placeholder?person.role:person.name}</h3><div className="ensemble-pagination"><span>{String(selected+1).padStart(2,'0')} / {String(entries.length).padStart(2,'0')}</span><button type="button" disabled={!hydrated||entries.length<2} aria-label="Previous studio portrait" onClick={()=>step(-1)}><Arrow/></button><button type="button" disabled={!hydrated||entries.length<2} aria-label="Next studio portrait" onClick={()=>step(1)}><Arrow/></button></div></div>
   <div className="ensemble-bio" id="studio-introduction-bio" aria-live="polite" aria-atomic="true"><p>{person.summary}</p>{person.href&&<Link className="text-link" href={person.href}>Read the introduction <Arrow/></Link>}</div>
  </div>
  <div className="ensemble-roster" role="group" aria-label="Choose a studio introduction">{entries.map((entry,index)=><button type="button" key={entry.id} disabled={!hydrated} aria-pressed={selected===index} aria-controls="studio-introduction-bio" onClick={()=>choose(index)}>{entry.placeholder?entry.role:entry.name}</button>)}</div>
  {!people.length&&<p className="ensemble-content-note">Original cinematic studio imagery, created with AI. These scenes illustrate the craft; they are not staff portraits or client publications.</p>}
  <div className="ensemble-closing"><p>A personal collaboration, from the first conversation.</p><Link className="text-link" href="/request-a-proposal">Tell us about your book <Arrow/></Link></div>
 </section>;
}
