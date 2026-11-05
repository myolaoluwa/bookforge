import {chromium} from '@playwright/test';
import {mkdirSync,writeFileSync} from 'node:fs';
const browser=await chromium.launch({channel:'msedge'});
const page=await browser.newPage();const results=[];mkdirSync('outputs/review',{recursive:true});
try{
 for(const [width,height] of [[320,568],[390,844],[568,320],[768,1024],[1024,768],[1440,1000],[2560,1440]]){
  await page.setViewportSize({width,height});await page.goto('http://127.0.0.1:5173');await page.evaluate(()=>document.fonts.ready);
  const section=page.locator('#people'),gallery=section.locator('.portrait-dome');await gallery.scrollIntoViewIfNeeded();await page.waitForFunction(()=>document.querySelector('#people')?.getAttribute('data-gallery-mode')==='interactive');await section.locator('.ensemble-roster button').nth(1).click();
  await page.waitForFunction(()=>document.querySelector('.portrait-dome')?.getAttribute('data-position')==='1.000');
  results.push({width,height,mode:await section.getAttribute('data-gallery-mode'),overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});
  if([320,390,1440].includes(width)){await section.evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));await page.screenshot({path:`outputs/review/dome-${width}.png`});await gallery.screenshot({path:`outputs/review/dome-stage-${width}.png`})}
 }
 await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:390,height:844});await page.goto('http://127.0.0.1:5173/about');await page.locator('#people').scrollIntoViewIfNeeded();
 results.push({route:'/about',mode:await page.locator('#people').getAttribute('data-gallery-mode'),overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});
 writeFileSync('outputs/review/dome.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results));
}finally{await browser.close()}
