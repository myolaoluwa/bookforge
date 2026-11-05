'use client';
import {useEffect,useRef,useState,useSyncExternalStore} from 'react';
import {craftScenes,type CraftSceneId} from '@/lib/bookforge/craft-scenes';
import {Arrow} from './ui';
const subscribeReady=()=>()=>{};
function CraftPicture({id,alt,light=false}:{id:CraftSceneId;alt:string;light?:boolean}){return <picture><source media="(max-width:760px)" srcSet={'/craft/'+id+'-mobile.webp'}/><img aria-hidden={light||undefined} src={'/craft/'+id+'.webp'} alt={light?'':alt} width={1600} height={900} loading="lazy" decoding="async"/></picture>}

export function CraftExperience({scene='cloth',compact=false}:{scene?:CraftSceneId;compact?:boolean}){
 const initial=craftScenes.findIndex(s=>s.id===scene);
 const [selected,setSelected]=useState(initial),[reduced,setReduced]=useState(false),[visible,setVisible]=useState(false);
 const ready=useSyncExternalStore(subscribeReady,()=>true,()=>false);
 const host=useRef<HTMLDivElement>(null),light=useRef<HTMLDivElement>(null),dialog=useRef<HTMLDialogElement>(null);
 const entry=craftScenes[initial],detail=craftScenes[selected];
 useEffect(()=>{
  const target=host.current,highlight=light.current;if(!target||!highlight)return;
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  let inView=false,animation:Animation|undefined;
  function update(){
   const reduce=preference.matches;setReduced(reduce);setVisible(inView);
   if(reduce){animation?.cancel();animation=undefined;return}
   if(!animation){animation=highlight!.animate([
    {clipPath:'polygon(-70% 0,-30% 0,-50% 100%,-90% 100%)',opacity:0,offset:0},
    {clipPath:'polygon(-70% 0,-30% 0,-50% 100%,-90% 100%)',opacity:.65,offset:.12},
    {clipPath:'polygon(150% 0,190% 0,170% 100%,130% 100%)',opacity:.65,offset:.7},
    {clipPath:'polygon(150% 0,190% 0,170% 100%,130% 100%)',opacity:0,offset:1},
   ],{duration:8800,iterations:Infinity,easing:'cubic-bezier(.65,0,.35,1)'});animation.pause()}
   if(inView&&!document.hidden)animation.play();else animation.pause();
  }
  const observer=new IntersectionObserver(([item])=>{inView=item.isIntersecting;update()},{threshold:.15});
  observer.observe(target);preference.addEventListener('change',update);document.addEventListener('visibilitychange',update);update();
  return()=>{observer.disconnect();preference.removeEventListener('change',update);document.removeEventListener('visibilitychange',update);animation?.cancel()};
 },[]);
 return <article className={'craft-experience'+(compact?' is-compact':'')}>
  <div ref={host} className="craft-frame" data-scene={scene} data-motion={reduced?'reduced':visible?'playing':'offscreen'}>
   <CraftPicture id={scene} alt={entry.alt}/><div className="craft-relight" ref={light} aria-hidden="true"><CraftPicture id={scene} alt="" light/></div><div className="craft-vignette" aria-hidden="true"/>
   <span className="craft-frame-label">BookForge / {entry.label}</span>
   <div className="craft-frame-actions"><button type="button" disabled={!ready} onClick={()=>{setSelected(initial);dialog.current?.showModal()}}>Explore {entry.label.toLowerCase()} <span aria-hidden="true">↗</span></button></div>
  </div>
  <div className="craft-scene-copy"><h3>{entry.title}</h3><p>{entry.detail}</p></div>
  <dialog className="craft-dialog" ref={dialog} aria-label="BookForge craft experience" onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close()}}>
   <div className="craft-dialog-toolbar"><span>BookForge / The craft of a book</span><button type="button" autoFocus onClick={()=>dialog.current?.close()}>Close experience ×</button></div>
   <div className="craft-dialog-image"><CraftPicture id={detail.id} alt={detail.alt}/></div>
   <div className="craft-dialog-reading"><div><span className="kicker">{detail.label}</span><h2>{detail.title}</h2><p>{detail.copy}</p><a className="button" href={'/request-a-proposal?service='+detail.service}>Discuss this part of your book <Arrow/></a></div><nav aria-label="Choose a craft scene">{craftScenes.map((s,n)=><button type="button" key={s.id} aria-pressed={selected===n} onClick={()=>setSelected(n)}><span>{String(n+1).padStart(2,'0')}</span>{s.label}</button>)}</nav></div>
   <p className="craft-provenance">Illustrative scenes, not client publications or staff portraits.</p>
  </dialog>
 </article>
}

