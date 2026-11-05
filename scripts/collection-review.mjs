import {chromium} from '@playwright/test';
import {mkdirSync,writeFileSync} from 'node:fs';
mkdirSync('outputs/review/collection',{recursive:true});
const browser=await chromium.launch({channel:'msedge'});
const errors=[],geometry=[],clipping=[];
try{
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
  page.on('pageerror',e=>errors.push(e.message));
  for(const [route,file] of [['/','home'],['/portfolio/concepts','covers'],['/portfolio/concepts/the-unquiet-coast','case-study'],['/portfolio/concepts/interiors','interiors'],['/portfolio/concepts/transformation','comparison'],['/portfolio/concepts/formats','formats']]){
   await page.goto('http://127.0.0.1:5173'+route,{waitUntil:'networkidle'});
   await page.screenshot({path:`outputs/review/collection/${name}-${file}.png`,fullPage:true});
   geometry.push({name,route,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});
   if(file==='case-study'){
    await page.locator('.atelier-stage').screenshot({path:`outputs/review/collection/${name}-physical-book.png`});
    await page.locator('.spread-viewer').screenshot({path:`outputs/review/collection/${name}-spread.png`});
   }
   if(file==='formats'){
    await page.getByRole('button',{name:'Reflowable EPUB',exact:true}).click();
    await page.locator('.format-explorer').screenshot({path:`outputs/review/collection/${name}-ebook.png`});
   }
  }
  for(const slug of ['the-unquiet-coast','ash-and-aster','a-clearer-kind-of-thinking','what-the-rain-kept','salt-fire-and-sundays','a-small-practice-of-attention']){
   await page.goto('http://127.0.0.1:5173/portfolio/concepts/'+slug,{waitUntil:'networkidle'});
   for(const view of ['Reading spread','Editorial detail']){
    await page.getByRole('button',{name:view,exact:true}).click();
    const issues=await page.locator('.designed-spread .interior-page:visible').evaluateAll(pages=>pages.flatMap(p=>{
     const content=p.querySelector('.reading-copy,.recipe-layout,.journal-layout,.poem,.kitchen-note');
     const folio=p.querySelector('.specimen-folio');
     return content&&folio&&content.getBoundingClientRect().bottom>folio.getBoundingClientRect().top-12?[{page:p.className,bottom:content.getBoundingClientRect().bottom,folio:folio.getBoundingClientRect().top}]:[];
    }));
    if(issues.length)clipping.push({name,slug,view,issues});
   }
   if(['salt-fire-and-sundays','a-clearer-kind-of-thinking'].includes(slug))await page.locator('.spread-viewer').screenshot({path:`outputs/review/collection/${name}-${slug}-spread.png`});
  }
  await page.close();
 }
 for(const width of [320,375,430,768,1024,1920]){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
  for(const route of ['/portfolio/concepts','/portfolio/concepts/salt-fire-and-sundays','/portfolio/concepts/transformation','/portfolio/concepts/formats']){
   await page.goto('http://127.0.0.1:5173'+route,{waitUntil:'networkidle'});
   geometry.push({width,route,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});
  }
  await page.close();
 }
 writeFileSync('outputs/review/collection/results.json',JSON.stringify({errors,geometry,clipping},null,2));
 console.log(JSON.stringify({errors,overflow:geometry.filter(x=>x.overflow),clipping,checks:geometry.length}));
}finally{await browser.close()}
