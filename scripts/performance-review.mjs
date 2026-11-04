import {chromium} from '@playwright/test';
import {mkdirSync,writeFileSync} from 'node:fs';
const origin=process.env.QA_ORIGIN||'http://127.0.0.1:5177';
const browser=await chromium.launch({channel:'msedge'});const results=[];mkdirSync('outputs/review',{recursive:true});
for(const mode of ['desktop','mobile-throttled']){
 const mobile=mode==='mobile-throttled';const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:900},deviceScaleFactor:1,isMobile:mobile,hasTouch:mobile});const page=await context.newPage();const client=await context.newCDPSession(page);
 if(mobile){await client.send('Network.enable');await client.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200*1024,uploadThroughput:100*1024});await client.send('Emulation.setCPUThrottlingRate',{rate:4})}
 await page.addInitScript(()=>{window.__qa={lcp:0,cls:0,lcpElement:''};new PerformanceObserver(list=>{const entries=list.getEntries();window.__qa.lcp=entries[entries.length-1].startTime;window.__qa.lcpElement=entries[entries.length-1].element?.tagName||'unknown'}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(list=>{for(const entry of list.getEntries())if(!entry.hadRecentInput)window.__qa.cls+=entry.value}).observe({type:'layout-shift',buffered:true})});
 await page.goto(origin,{waitUntil:'networkidle'});await page.screenshot({path:'outputs/review/production-'+mode+'.png'});
 const metrics=await page.evaluate(()=>({...window.__qa,domContentLoaded:performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd,media:[...document.querySelectorAll('video')].map(v=>({source:v.currentSrc,width:v.videoWidth,height:v.videoHeight,muted:v.muted,paused:v.paused})),transferred:performance.getEntriesByType('resource').reduce((sum,e)=>sum+e.transferSize,0),horizontalOverflow:document.documentElement.scrollWidth>innerWidth}));
 results.push({mode,conditions:mobile?'390×844, 4× CPU slowdown, 150ms latency, 200KiB/s download':'1440×900, unthrottled local production build',...metrics});await context.close();
}
await browser.close();writeFileSync('outputs/review/performance.json',JSON.stringify({note:'Single local Chromium lab samples. No field INP or physical-device results are claimed.',results},null,2));console.log(JSON.stringify(results,null,2));
