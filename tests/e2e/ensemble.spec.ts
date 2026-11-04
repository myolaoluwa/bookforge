import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('studio introductions select by tap and keyboard without changing focus',async({page})=>{
 await page.goto('/');const section=page.locator('#people');const buttons=section.getByRole('button');
 await expect(buttons).toHaveCount(3);
 await buttons.nth(1).click();await expect(buttons.nth(1)).toHaveAttribute('aria-pressed','true');
 await expect(section.locator('.ensemble-art-word')).toHaveText('Words.');
 await buttons.nth(2).focus();await page.keyboard.press('Enter');
 await expect(buttons.nth(2)).toBeFocused();await expect(buttons.nth(2)).toHaveAttribute('aria-pressed','true');
 await expect(section.locator('.ensemble-art-word')).toHaveText('Pages.');
 await expect(section.getByText('Introduction placeholder',{exact:true})).toBeVisible();
 await expect(section.getByRole('link',{name:'Tell us about your book'})).toHaveAttribute('href','/request-a-proposal');
});

test('studio section fits small phones through wide screens and respects reduced motion',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 for(const [width,height] of [[320,568],[390,844],[568,320],[768,1024],[1024,768],[1440,900],[2560,1440]]){
  await page.setViewportSize({width,height});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),`${width}px overflow`).toBe(false);
 }
 expect(await page.locator('.ensemble-frame').evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
 const results=await new AxeBuilder({page}).include('.ensemble').analyze();expect(results.violations).toEqual([]);
 await page.setViewportSize({width:320,height:568});await page.goto('/about');await expect(page.locator('#people')).toHaveCount(1);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
});
