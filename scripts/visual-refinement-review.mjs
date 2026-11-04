import {chromium} from '@playwright/test';
import {mkdirSync} from 'node:fs';
mkdirSync('outputs/review',{recursive:true});
const browser=await chromium.launch({channel:'msedge'});
for(const [name,width,height] of [['refined-desktop',1440,900],['refined-mobile',390,844]]){
 const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
 await page.goto('http://127.0.0.1:5173',{waitUntil:'networkidle'});
 await page.screenshot({path:`outputs/review/${name}.png`,fullPage:true});
 console.log(name,await page.locator('.cinema-actions .button').boundingBox(),await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth})));
 await page.close();
}
await browser.close();
