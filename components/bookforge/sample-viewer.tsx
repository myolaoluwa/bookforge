'use client';
import {useState,useSyncExternalStore} from 'react';
import {Book} from './book';

const views=['Cover','Print interior','Ebook preview'] as const;
const subscribeReady=()=>()=>{};
export function SampleViewer(){
 const ready=useSyncExternalStore(subscribeReady,()=>true,()=>false);
 const [view,setView]=useState<(typeof views)[number]>('Print interior');
 const [large,setLarge]=useState(false);
 return <div className="sample-viewer">
  <div className="sample-toolbar"><div className="sample-switch" role="group" aria-label="Book sample views">{views.map(name=><button key={name} type="button" disabled={!ready} aria-pressed={view===name} onClick={()=>setView(name)}>{name}</button>)}</div><button className="sample-size" type="button" disabled={!ready} aria-pressed={large} onClick={()=>setLarge(!large)}>{large?'Standard view':'Enlarge reading view'}</button></div>
  <div className={'sample-canvas'+(large?' enlarged':'')} role="region" aria-label={view+' demonstration'} tabIndex={0}>
   {view==='Cover'?<Book/>:view==='Print interior'?<div className="sample-spread"><article><span className="sample-running">The space between words</span><h3>Every story<br/>starts somewhere.</h3><p>There is a moment between the last line written and the first page held. A space for care. For choosing what stays, what breathes, and what welcomes a reader in.</p><p>A story needs room. A margin for the hand that holds it. A pause between one thought and the next.</p><span className="sample-page-number">6</span></article><article><span className="sample-running">A note on beginnings</span><p>The work is in the small decisions. A chapter that begins with confidence. A sentence given just enough room. A line that carries the eye comfortably to its end.</p><p>Nothing asks to be noticed. Everything helps the story.</p><p>Turn the page. There is more ahead.</p><span className="sample-page-number">7</span></article></div>:<article className="ebook-study"><span className="sample-running">Chapter one</span><h3>Room for a beginning.</h3><p>A screen has no fixed page. These words have room to change, to grow a little larger, and to meet a reader where they are.</p><p>This is a browser illustration of a reading layout. The delivered EPUB, its navigation and its behavior on reading devices are separate production checks.</p><h4>A place to pause</h4><p>Clear headings and a comfortable reading measure leave the story at the center.</p></article>}
  </div>
  <div className="sample-annotation"><p><strong>{view==='Cover'?'Typography sets the tone.':view==='Print interior'?'The details make the reading experience.':'A reading layout that can breathe.'}</strong> {view==='Cover'?'A restrained cover study exploring hierarchy and the space around a title.':view==='Print interior'?'Chapter hierarchy, a consistent reading measure and room at the binding edge. Enlarge the view to inspect the type.':'Use the larger reading view to see the text adapt. This browser preview is not an EPUB file or a compatibility certification.'}</p><span>Original Bookforge demonstration<br/>Not a client publication</span></div>
 </div>
}
