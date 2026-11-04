import {chromium} from '@playwright/test';
import {mkdirSync,writeFileSync} from 'node:fs';
const origin=process.env.QA_ORIGIN||'http://127.0.0.1:5173';
const sizes=[[320,568],[360,640],[375,667],[390,844],[430,932],[540,720],[600,960],[768,1024],[820,1180],[1024,768],[1280,720],[1440,900],[1920,1080],[2560,1440],[568,280],[844,280],[568,320],[667,375],[740,360],[844,390],[932,430]];
mkdirSync('outputs/review',{recursive:true});
const browser=await chromium.launch({channel:'msedge'});
const page=await browser.newPage({reducedMotion:'reduce'});const results=[];
try{
 for(const [width,height] of sizes){
  await page.setViewportSize({width,height});await page.goto(origin);await page.evaluate(()=>document.fonts.ready);
  const geometry=await page.evaluate(()=>{const rect=s=>{const r=document.querySelector(s).getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom}};const story=rect('.cinema-story');return {horizontalOverflow:document.documentElement.scrollWidth>innerWidth,cta:rect('.cinema-actions .button'),sound:rect('.sound-control'),film:rect('.cinematic-film video'),captionCollisions:['.cinema-content h1','.hero-description','.cinema-actions'].filter(s=>{const r=rect(s);return r.left<story.right&&r.right>story.left&&r.top<story.bottom&&r.bottom>story.top})}});
  results.push({width,height,...geometry});
  if([[320,568],[390,844],[768,1024],[568,320],[844,390],[1440,900]].some(([w,h])=>w===width&&h===height))await page.screenshot({path:`outputs/review/responsive-final-${width}x${height}.png`});
  if(width===320){await page.locator('.site-footer').scrollIntoViewIfNeeded();await page.screenshot({path:'outputs/review/responsive-final-footer-320.png'})}
 }
 writeFileSync('outputs/review/responsive-final.json',JSON.stringify({note:'Local Chromium geometry review; not physical-device or Safari certification.',results},null,2));
 const failures=results.filter(r=>r.horizontalOverflow||r.captionCollisions.length||r.cta.bottom>r.height||r.sound.bottom>r.height);
 console.log(JSON.stringify({viewports:results.length,failures},null,2));if(failures.length)process.exitCode=1;
}finally{await browser.close()}
