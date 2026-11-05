import {test,expect} from '@playwright/test';
import {publicRoutes} from '../../lib/bookforge/content';

test('hero copy, film and controls fit narrow, landscape, tablet and wide layouts',async({page})=>{
 test.setTimeout(120000);await page.emulateMedia({reducedMotion:'reduce'});
 for(const [width,height] of [[320,568],[360,640],[375,667],[390,844],[430,932],[540,720],[600,960],[768,1024],[820,1180],[1024,768],[1280,720],[1440,900],[1920,1080],[2560,1440],[568,280],[844,280],[568,320],[667,375],[740,360],[844,390],[932,430]]){
  await page.setViewportSize({width,height});await page.goto('/');await page.evaluate(()=>document.fonts.ready);
  const result=await page.evaluate(()=>{const rect=(s:string)=>{const r=document.querySelector(s)!.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom}};const story=rect('.cinema-story');const hits=['.cinema-content h1','.hero-description','.cinema-actions'].filter(s=>{const b=rect(s);return b.left<story.right&&b.right>story.left&&b.top<story.bottom&&b.bottom>story.top});return {overflow:document.documentElement.scrollWidth>innerWidth,cta:rect('.cinema-actions .button'),sound:rect('.sound-control'),hits}});
  expect(result.overflow,`${width} overflow`).toBe(false);expect(result.hits,`${width} caption collision`).toEqual([]);expect(result.cta.bottom,`${width} CTA`).toBeLessThanOrEqual(height);expect(result.cta.right).toBeLessThanOrEqual(width);expect(result.sound.right).toBeLessThanOrEqual(width);expect(result.sound.bottom).toBeLessThanOrEqual(height);expect(result.sound.right-result.sound.left).toBeGreaterThanOrEqual(44);
 }
});

test('every public page fits narrow phones and tablet widths',async({page})=>{
 test.setTimeout(180000);
 for(const width of [320,540,768,1024]){await page.setViewportSize({width,height:900});for(const route of publicRoutes){await page.goto(route);expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),`${width} ${route}`).toBe(false)}}
});

test('browser-denied autoplay has an honest one-tap fallback and pause persists across navigation',async({page})=>{
 await page.addInitScript(()=>{const play=HTMLMediaElement.prototype.play;let first=true;HTMLMediaElement.prototype.play=function(){if(this instanceof HTMLAudioElement&&first){first=false;return Promise.reject(new DOMException('Autoplay denied','NotAllowedError'))}return play.call(this)}});
 await page.goto('/');const control=page.locator('.sound-control');await expect(control).toHaveAttribute('data-state','blocked');await expect(control).toHaveAttribute('aria-label','Play soundtrack');await expect(page.locator('audio')).toHaveJSProperty('paused',true);
 await control.click();await expect(control).toHaveAttribute('aria-label','Pause soundtrack');await expect(page.locator('audio')).toHaveJSProperty('paused',false);await control.click();await expect(page.locator('audio')).toHaveJSProperty('paused',true);
 await page.getByRole('link',{name:'Explore the studio',exact:true}).click();await expect(page).toHaveURL(/\/services$/);await expect(control).toHaveAttribute('data-state','off');await expect(page.locator('audio')).toHaveJSProperty('paused',true);
});

test('default sound starts on the first page interaction after autoplay is blocked',async({page})=>{
 await page.addInitScript(()=>{const play=HTMLMediaElement.prototype.play;let first=true;HTMLMediaElement.prototype.play=function(){if(this instanceof HTMLAudioElement&&first){first=false;return Promise.reject(new DOMException('Autoplay denied','NotAllowedError'))}return play.call(this)}});
 await page.goto('/');await expect(page.locator('.sound-control')).toHaveAttribute('data-state','blocked');
 await page.locator('#cinematic-title').click();await expect(page.locator('.sound-control')).toHaveAttribute('data-state','on');await expect(page.locator('audio')).toHaveJSProperty('paused',false);
});

test('expanded mobile menu remains reachable in a short landscape viewport',async({page})=>{
 await page.setViewportSize({width:844,height:390});await page.goto('/');await page.getByRole('button',{name:'Menu navigation'}).click();await page.locator('.service-menu summary').click();const menu=page.locator('.navigation.open');const bounds=await menu.boundingBox();expect(bounds!.y+bounds!.height).toBeLessThanOrEqual(390);await page.getByRole('link',{name:'Resources',exact:true}).click();await expect(page).toHaveURL(/\/resources$/);
});

test('portrait and landscape phones receive the compact original-film derivative',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const [width,height,mobile] of [[390,844,true],[844,390,true],[768,1024,false],[1440,900,false]] as const){
  await page.setViewportSize({width,height});await page.goto('/');
  await expect.poll(()=>page.locator('video').evaluate(video=>(video as HTMLVideoElement).currentSrc)).toMatch(mobile?/city-loop-mobile\.mp4$/:/city-loop\.mp4$/);
  await expect.poll(()=>page.locator('video').evaluate(video=>(video as HTMLVideoElement).videoWidth)).toBeGreaterThan(0);
  const ratio=await page.locator('video').evaluate(video=>(video as HTMLVideoElement).videoWidth/(video as HTMLVideoElement).videoHeight);expect(ratio).toBeCloseTo(2/3,4);
 }
});
