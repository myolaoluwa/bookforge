'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useState,useSyncExternalStore} from 'react';
import {Arrow} from './ui';

export type StudioIntroduction={id:string;name:string;role:string;summary:string;portrait?:string;alt?:string;href?:string;placeholder?:boolean;word?:string};

const introductionSlots:StudioIntroduction[]=[
  {id:'studio',name:'Your name here',role:'Studio founder',summary:'A personal introduction to the person shaping Bookforge. Your approved biography, approach and role will appear here.',placeholder:true,word:'Vision.'},
  {id:'editorial',name:'Your collaborator here',role:'Editorial craft',summary:'Introduce the person who works with an author’s words. Add their actual role, editorial approach and approved biography.',placeholder:true,word:'Words.'},
  {id:'design',name:'Your collaborator here',role:'Book design',summary:'Introduce the person behind the reading experience. Add their actual role, design approach and approved biography.',placeholder:true,word:'Pages.'},
];
const subscribeReady=()=>()=>{};

export function StudioEnsemble({people}:{people:StudioIntroduction[]}){
  const hydrated=useSyncExternalStore(subscribeReady,()=>true,()=>false);
  const entries=people.length?people:introductionSlots;
  const [selected,setSelected]=useState(0);
  const person=entries[Math.min(selected,entries.length-1)];
  const panelId='studio-introduction';
  return <section className="ensemble" aria-labelledby={panelId+'-heading'} id="people">
    <div className="ensemble-heading">
      <div><p className="ensemble-label">The Bookforge studio</p><h2 id={panelId+'-heading'}>The people<br/>behind <em>the pages.</em></h2></div>
      <p>A book carries your voice.<br/>The people beside you should care about it.</p>
    </div>
    <div className="ensemble-layout">
      <div className="ensemble-stage" id={panelId} role="region" aria-label="Selected studio introduction">
        <div className="ensemble-frame" key={person.id}>
          {person.portrait?<Image className="ensemble-portrait" src={person.portrait} alt={person.alt||'Portrait of '+person.name} width={720} height={900} sizes="(max-width: 760px) 100vw, 50vw"/>:<div className="ensemble-art" aria-hidden="true"><span className="ensemble-art-imprint">Bookforge / Studio introductions</span><span className="ensemble-art-word">{person.word||'Craft.'}</span><svg viewBox="0 0 240 180" fill="none"><path d="M28 31c35-12 66-5 92 14 26-19 57-26 92-14v116c-35-12-66-5-92 14-26-19-57-26-92-14V31Z"/><path d="M120 45v116M45 56c20-4 39 0 58 10M45 72c20-4 39 0 58 10M137 66c19-10 38-14 58-10M137 82c19-10 38-14 58-10"/></svg><span className="ensemble-art-note">{person.placeholder?'Portrait placeholder':'Portrait to be added'}</span></div>}
          <span className="ensemble-corner ensemble-corner-a" aria-hidden="true"/><span className="ensemble-corner ensemble-corner-b" aria-hidden="true"/>
          <div className="ensemble-frame-caption"><span>{person.role}</span><span>Bookforge</span></div>
        </div>
      </div>
      <div className="ensemble-editorial">
        <div className="ensemble-roster" role="group" aria-label="Choose a studio introduction">{entries.map((entry,index)=><button type="button" key={entry.id} disabled={!hydrated} aria-pressed={selected===index} aria-controls={panelId+' '+panelId+'-bio'} onClick={()=>setSelected(index)}><span><span className="ensemble-roster-role">{entry.role}</span><span className="ensemble-roster-name">{entry.name}</span></span><Arrow/></button>)}</div>
        <div className="ensemble-bio" id={panelId+'-bio'} key={person.id}>
          <p className="ensemble-label">{person.placeholder?'Introduction placeholder':'In the studio'}</p>
          <h3>{person.placeholder?'A face. A point of view. A shared care for your book.':person.name}</h3>
          <p>{person.summary}</p>
          {person.href&&<Link className="text-link" href={person.href}>Read the introduction <Arrow/></Link>}
        </div>
        {!people.length&&<p className="ensemble-content-note">Introductions are being prepared. These are content slots, not a claim about team size or credentials.</p>}
      </div>
    </div>
    <div className="ensemble-closing"><p>Your story stays at the centre of the collaboration.</p><Link className="text-link" href="/request-a-proposal">Tell us about your book <Arrow/></Link></div>
  </section>;
}
