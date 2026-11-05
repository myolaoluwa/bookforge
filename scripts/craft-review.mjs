import {chromium} from '@playwright/test';
import {mkdirSync,writeFileSync} from 'node:fs';
mkdirSync('outputs/review/craft',{recursive:true});
const browser=await chromium.launch({channel:'msedge'});const errors=[],checks=[];
try{
 for(const [width,height] of [[1440,1000],[390,844],[320,568],[768,1024],[1024,768]]){
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(e.message));
  for(const route of ['/','/portfolio','/about','/testimonials','/services/book-cover-design']){
   await page.goto('http://127.0.0.1:5173'+route,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
   checks.push({width,route,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),placeholders:await page.locator('.content-placeholder,.portrait-placeholder,.sample-empty').count()});
   if([1440,390].includes(width)&&route==='/'){
    for(const frame of await page.locator('.craft-frame').all()){await frame.scrollIntoViewIfNeeded();await frame.locator('picture>img').first().evaluate(img=>img.decode());}
    await page.locator('#people').scrollIntoViewIfNeeded();await page.locator('#people img').evaluateAll(async images=>{await Promise.all(images.map(img=>img.decode().catch(()=>{})))});
    await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.locator('.skip').evaluate(el=>el.blur());
    await page.screenshot({path:`outputs/review/craft/home-${width}.png`,fullPage:true});
    await page.locator('.selected-work').scrollIntoViewIfNeeded();await page.locator('.selected-work .craft-frame>picture>img').evaluateAll(async images=>{await Promise.all(images.map(img=>img.decode().catch(()=>{})))});await page.locator('.selected-work').screenshot({path:`outputs/review/craft/work-${width}.png`});
    await page.locator('#people').scrollIntoViewIfNeeded();await page.locator('#people img').evaluateAll(async images=>{await Promise.all(images.map(img=>img.decode().catch(()=>{})))});await page.locator('#people').screenshot({path:`outputs/review/craft/gallery-${width}.png`});
    const button=page.getByRole('button',{name:'Explore cover craft',exact:true});await button.click();
    await page.getByRole('dialog',{name:'BookForge craft experience'}).screenshot({path:`outputs/review/craft/experience-${width}.png`});await page.keyboard.press('Escape');
   }
  }
  if(width===1440){await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('http://127.0.0.1:5173');await page.locator('#people').scrollIntoViewIfNeeded();await page.waitForFunction(()=>document.querySelector('#people')?.getAttribute('data-gallery-mode')==='interactive');await page.locator('#people img').evaluateAll(async images=>{await Promise.all(images.map(img=>img.decode().catch(()=>{})))});await page.waitForTimeout(1200);await page.locator('.portrait-dome').screenshot({path:'outputs/review/craft/curved-gallery.png'});}
  await page.close();
 }
 writeFileSync('outputs/review/craft/results.json',JSON.stringify({errors,checks},null,2));console.log(JSON.stringify({errors,failures:checks.filter(x=>x.overflow||x.placeholders),checks:checks.length}));
}finally{await browser.close()}
