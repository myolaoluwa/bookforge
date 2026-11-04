'use client';
import {fadeVolume} from '@/lib/bookforge/cinema';
type State='starting'|'off'|'on'|'blocked'|'error';
let state:State='starting',desired=false,frame=0,operation=0,initialized=false;
const listeners=new Set<()=>void>();
function publish(value:State){state=value;listeners.forEach(listener=>listener())}
export const subscribeSound=(listener:()=>void)=>{listeners.add(listener);return ()=>listeners.delete(listener)};
export const soundSnapshot=()=>state;
export const serverSoundSnapshot=():State=>'starting';
function ramp(audio:HTMLAudioElement,target:number){cancelAnimationFrame(frame);const from=audio.volume,start=performance.now();const tick=(time:number)=>{audio.volume=fadeVolume(from,target,time-start);if(time-start<450)frame=requestAnimationFrame(tick);else if(target===0)audio.pause()};frame=requestAnimationFrame(tick)}
export async function setSound(enabled?:boolean,{autoplay=false}:{autoplay?:boolean}={}){
 const current=++operation;
 const audio=document.getElementById('bookforge-soundtrack') as HTMLAudioElement|null;
 if(!audio){publish('error');return}
 desired=enabled??!desired;cancelAnimationFrame(frame);
 if(!desired){audio.pause();publish('off');return}
 publish('starting');
 // Audible autoplay is requested honestly, at the intended volume. Never
 // start silently and then unmute to work around a browser's autoplay policy.
 audio.volume=autoplay ? .35 : 0;
 try{
  await audio.play();if(current!==operation)return;
  if(!desired){audio.pause();return}
  publish('on');if(!autoplay)ramp(audio,.35);
 }catch(error){
  if(current!==operation)return;
  desired=false;
  publish(error instanceof DOMException&&error.name==='NotAllowedError'?'blocked':'error');
 }
}
export function startDefaultSound(){if(initialized)return;initialized=true;return setSound(true,{autoplay:true})}
export function soundMediaEvent(event:'play'|'pause'|'error'){
 if(event==='error'){desired=false;cancelAnimationFrame(frame);publish('error')}
 else if(event==='pause'&&state==='on'){desired=false;cancelAnimationFrame(frame);publish('off')}
 // The play promise owns startup state. Native pause/error events keep a
 // later interruption reflected accurately in the compact control.
}
