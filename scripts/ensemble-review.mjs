import {chromium} from '@playwright/test';
import {mkdirSync,writeFileSync} from 'node:fs';
const browser=await chromium.launch({channel:'msedge'});
const page=await browser.newPage({reducedMotion:'reduce'});
mkdirSync('outputs/review',{recursive:true});
const results=[];
try{
 for(const [width,height] of [[320,568],[390,844],[568,320],[768,1024],[1024,768],[1440,1000],[2560,1440]]){
  await page.setViewportSize({width,height});await page.goto('http://127.0.0.1:5173');await page.evaluate(()=>document.fonts.ready);
  const section=page.locator('.ensemble');await section.scrollIntoViewIfNeeded();
  const buttons=section.getByRole('button');await buttons.nth(1).click();
  await page.waitForFunction(()=>document.querySelectorAll('.ensemble-roster button')[1]?.getAttribute('aria-pressed')==='true');
  const selected=await buttons.nth(1).getAttribute('aria-pressed');
  const geometry=await page.evaluate(()=>{const els=[...document.querySelectorAll('.ensemble *')];return {overflow:document.documentElement.scrollWidth>innerWidth,outside:els.filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.left<-.5||r.right>innerWidth+.5)}).map(e=>e.className)}});
  results.push({width,height,selected,...geometry});
  if([320,390,1440].includes(width)){await section.evaluate(el=>el.scrollIntoView({block:'start'}));await page.screenshot({path:`outputs/review/ensemble-${width}.png`,animations:'disabled'});}
 }
 await page.setViewportSize({width:390,height:844});await page.goto('http://127.0.0.1:5173/about');
 results.push({route:'/about',overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});
 writeFileSync('outputs/review/ensemble.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results));
}finally{await browser.close()}
