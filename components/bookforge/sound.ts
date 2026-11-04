'use client';
import {fadeVolume} from '@/lib/bookforge/cinema';
type State='off'|'on'|'error';
let state:State='off',desired=false,frame=0;
const listeners=new Set<()=>void>();
function publish(value:State){state=value;listeners.forEach(listener=>listener())}
export const subscribeSound=(listener:()=>void)=>{listeners.add(listener);return ()=>listeners.delete(listener)};
export const soundSnapshot=()=>state;
export const serverSoundSnapshot=():State=>'off';
function ramp(audio:HTMLAudioElement,target:number){cancelAnimationFrame(frame);const from=audio.volume,start=performance.now();const tick=(time:number)=>{audio.volume=fadeVolume(from,target,time-start);if(time-start<450)frame=requestAnimationFrame(tick);else if(target===0)audio.pause()};frame=requestAnimationFrame(tick)}
export async function setSound(enabled?:boolean){const audio=document.getElementById('bookforge-soundtrack') as HTMLAudioElement|null;if(!audio){publish('error');return}desired=enabled??!desired;if(!desired){publish('off');ramp(audio,0);return}try{cancelAnimationFrame(frame);audio.volume=0;await audio.play();if(!desired){audio.pause();return}publish('on');ramp(audio,.35)}catch{desired=false;publish('error')}}
