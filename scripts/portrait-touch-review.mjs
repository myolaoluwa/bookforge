import {chromium,devices} from '@playwright/test';
const browser=await chromium.launch({channel:'msedge'});
const page=await browser.newPage({...devices['iPhone 13']});
try{
 await page.goto('http://127.0.0.1:5173');const section=page.locator('#people'),gallery=page.locator('.portrait-dome');await gallery.scrollIntoViewIfNeeded();await page.waitForFunction(()=>document.querySelector('#people')?.getAttribute('data-gallery-mode')==='interactive');
 const box=await gallery.boundingBox(),x=box.x+box.width*.72,y=box.y+box.height*.5;console.log({box,x,y});
 await page.evaluate(()=>{window.touchLog=[];for(const type of ['pointerdown','pointermove','pointerup','pointercancel'])document.addEventListener(type,e=>window.touchLog.push({type:e.type,button:e.button,pointerType:e.pointerType,x:e.clientX,y:e.clientY,target:e.target.className}),true)});
 console.log(await page.evaluate(({x,y})=>({target:document.elementFromPoint(x,y)?.className,scrollY,viewport:[innerWidth,innerHeight]}),{x,y}));
 const client=await page.context().newCDPSession(page);await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
 for(let i=1;i<=8;i++)await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-i*20,y}]});
 await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 console.log(await page.evaluate(()=>({log:window.touchLog,position:document.querySelector('.portrait-dome').dataset.position,mode:document.querySelector('#people').dataset.galleryMode})));
 await gallery.screenshot({path:'outputs/review/dome-touch.png'});
}finally{await browser.close()}
