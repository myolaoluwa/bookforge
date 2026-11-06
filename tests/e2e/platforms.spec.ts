import {test,expect} from '@playwright/test';

test('platforms form one moving row and pause on keyboard focus',async({page})=>{
 await page.goto('/');
 const strip=page.getByRole('region',{name:/Publishing platforms: Amazon Kindle/});
 await strip.scrollIntoViewIfNeeded();
 await page.mouse.move(0,0);
 const track=page.locator('.platforms-track');
 const position=()=>track.evaluate(el=>new DOMMatrix(getComputedStyle(el).transform).m41);
 const before=await position();await page.waitForTimeout(1200);const after=await position();
 expect(before-after).toBeGreaterThan(15);expect(before-after).toBeLessThan(65);
 const centers=await page.locator('.platforms-group').first().locator('.platform-mark').evaluateAll(items=>items.map(el=>{const r=el.getBoundingClientRect();return r.y+r.height/2}));
 expect(Math.max(...centers)-Math.min(...centers)).toBeLessThan(1);
 for(const image of await page.locator('.platforms-group').first().locator('img').all()){
  expect(await image.evaluate(el=>(el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  expect(await image.evaluate(el=>getComputedStyle(el).filter)).toBe('none');
  expect(await image.evaluate(el=>getComputedStyle(el).opacity)).toBe('1');
 }
 await expect(strip).toHaveAttribute('aria-label',/IngramSpark, Rakuten Kobo, Apple Books/);
 await strip.focus();const stopped=await position();await page.waitForTimeout(400);expect(Math.abs(await position()-stopped)).toBeLessThan(1);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.locator('.publishing-platforms').screenshot({path:`outputs/review/platforms-${test.info().project.name}.png`});
});

test('reduced motion keeps one readable set of platforms without animation',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 const track=page.locator('.platforms-track');
 expect(await track.evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
 await expect(page.locator('.platform-mark:visible')).toHaveCount(6);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
