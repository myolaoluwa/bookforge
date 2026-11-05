import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('curved portrait gallery responds to buttons and keyboard',async({page})=>{
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));await page.goto('/');const section=page.locator('#people'),gallery=section.locator('.portrait-dome');await gallery.scrollIntoViewIfNeeded();
 await expect(section).toHaveAttribute('data-gallery-mode','interactive',{timeout:15000});await expect(gallery).toHaveAttribute('data-position','0.000');
 await section.getByRole('button',{name:'Next studio portrait'}).click();await expect(section.locator('.ensemble-selection h3')).toHaveText('A rhythm for reading');
 await expect(gallery).toHaveAttribute('data-position','1.000');await gallery.focus();await page.keyboard.press('ArrowRight');
 await expect(section.locator('.ensemble-selection h3')).toHaveText('Care in the making');await expect(gallery).toBeFocused();await expect(gallery).toHaveAttribute('data-position','2.000');
 await section.locator('.ensemble-roster').getByRole('button',{name:'The first impression',exact:true}).click();await expect(gallery).toHaveAttribute('data-position','3.000');
 expect(errors).toEqual([]);
});

test('dragging and touch swiping move the gallery with momentum and settle',async({page,isMobile})=>{
 await page.goto('/');const section=page.locator('#people'),gallery=section.locator('.portrait-dome');await gallery.scrollIntoViewIfNeeded();await expect(section).toHaveAttribute('data-gallery-mode','interactive',{timeout:15000});
 const box=(await gallery.boundingBox())!,x=box.x+box.width*.72,y=box.y+box.height*.5;
 if(isMobile){const client=await page.context().newCDPSession(page);await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});for(let i=1;i<=8;i++)await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-i*20,y}]});await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await client.detach()}
 else{await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x-240,y,{steps:12});await page.mouse.up()}
 await expect.poll(async()=>Number(await gallery.getAttribute('data-position'))).toBeGreaterThan(.25);
 await expect(section).toHaveAttribute('data-moving','false',{timeout:10000});
 await expect.poll(async()=>{const value=Number(await gallery.getAttribute('data-position'));return Math.abs(value-Math.round(value))}).toBeLessThan(.002);
 await gallery.focus();const start=await page.evaluate(()=>scrollY);await page.mouse.move(box.x+box.width*.5,box.y+box.height*.5);await page.mouse.wheel(0,300);await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(start);
});

test('reduced motion and unavailable WebGL retain readable selectable portraits',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');const section=page.locator('#people');await section.locator('.portrait-dome').scrollIntoViewIfNeeded();await expect(section).toHaveAttribute('data-gallery-mode','still');
 await section.getByRole('button',{name:'Next studio portrait'}).click();await expect(section.locator('.ensemble-selection h3')).toHaveText('A rhythm for reading');
 const accessibility=await new AxeBuilder({page}).include('#people').analyze();expect(accessibility.violations).toEqual([]);
 await page.emulateMedia({reducedMotion:'no-preference'});await expect(section).toHaveAttribute('data-gallery-mode','interactive',{timeout:15000});
 await page.emulateMedia({reducedMotion:'reduce'});await expect(section).toHaveAttribute('data-gallery-mode','still');
 await page.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(this:HTMLCanvasElement,kind:string,...args:unknown[]){if(kind==='webgl')return null;return original.apply(this,[kind,...args] as Parameters<typeof original>)} as typeof original});
 await page.emulateMedia({reducedMotion:'no-preference'});await page.reload();await section.locator('.portrait-dome').scrollIntoViewIfNeeded();await expect(section).toHaveAttribute('data-gallery-mode','still');await section.getByRole('button',{name:'Next studio portrait'}).click();await expect(section.locator('.ensemble-selection h3')).toHaveText('A rhythm for reading');
});

test('gallery fits phone, landscape, tablet and wide layouts',async({page})=>{
 await page.goto('/');const section=page.locator('#people');await section.locator('.portrait-dome').scrollIntoViewIfNeeded();await expect(section).toHaveAttribute('data-gallery-mode','interactive',{timeout:15000});
 for(const [width,height] of [[320,568],[390,844],[568,320],[768,1024],[1024,768],[1440,900],[2560,1440]]){await page.setViewportSize({width,height});expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),`${width}px overflow`).toBe(false);const canvas=await section.locator('canvas').boundingBox();expect(canvas!.width).toBeGreaterThan(0);expect(canvas!.width).toBeLessThanOrEqual(width)}
 await page.setViewportSize({width:320,height:568});await page.goto('/about');await section.locator('.portrait-dome').scrollIntoViewIfNeeded();await expect(section).toHaveAttribute('data-gallery-mode','interactive',{timeout:15000});expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
});

test('portrait textures load from site assets and graphics loss restores the still gallery',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await page.locator('.portrait-dome').scrollIntoViewIfNeeded();
 const result=await page.evaluate(async()=>{
  const modulePath='/components/bookforge/portrait-dome.ts';const {createPortraitDome}=await import(modulePath);
  const host=document.createElement('div');host.style.cssText='position:relative;width:320px;height:400px';const canvas=document.createElement('canvas');host.appendChild(canvas);document.body.appendChild(host);
  let fallback=false;const controller=createPortraitDome(canvas,host,[{id:'texture-check',name:'QA asset',role:'QA asset',summary:'Local asset texture check',portrait:'/reference/poster.webp'}],{select:()=>{},moving:()=>{},fallback:()=>{fallback=true}});
  const photo=new window.Image();photo.src='/reference/poster.webp';await photo.decode();await new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve())));
  const error=canvas.getContext('webgl')?.getError();controller?.destroy();host.remove();return {created:!!controller,fallback,error};
 });expect(result).toEqual({created:true,fallback:false,error:0});
 await page.emulateMedia({reducedMotion:'no-preference'});const section=page.locator('#people');await section.locator('.portrait-dome').scrollIntoViewIfNeeded();await expect(section).toHaveAttribute('data-gallery-mode','interactive',{timeout:15000});
 await section.locator('canvas').evaluate(el=>el.dispatchEvent(new Event('webglcontextlost',{cancelable:true})));await expect(section).toHaveAttribute('data-gallery-mode','still');
 await section.getByRole('button',{name:'Next studio portrait'}).click();await expect(section.locator('.ensemble-selection h3')).toHaveText('A rhythm for reading');
});
