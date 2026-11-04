import {chromium} from '@playwright/test';
import {mkdirSync} from 'node:fs';
mkdirSync('outputs/review',{recursive:true});
const browser=await chromium.launch({channel:'msedge'});
for(const [name,width,height] of [['trust-desktop',1440,900],['trust-mobile',390,844]]){
 const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
 await page.goto('http://127.0.0.1:5173',{waitUntil:'networkidle'});
 await page.screenshot({path:`outputs/review/${name}.png`,fullPage:true});
 await page.locator('.sample-viewer').screenshot({path:`outputs/review/${name}-sample.png`});
 await page.goto('http://127.0.0.1:5173/pricing',{waitUntil:'networkidle'});
 await page.screenshot({path:`outputs/review/${name}-pricing.png`,fullPage:true});
 console.log(name,await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth})));
 await page.close();
}
await browser.close();
