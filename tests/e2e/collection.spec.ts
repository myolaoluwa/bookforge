import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {specimens} from '../../lib/bookforge/specimens';

test('the collection filters real concepts and opens a full book study',async({page})=>{
 await page.goto('/portfolio/concepts');
 await expect(page.locator('.specimen-entry')).toHaveCount(6);
 await page.getByRole('button',{name:'Poetry',exact:true}).click();
 await expect(page.locator('.specimen-entry')).toHaveCount(1);
 await page.locator('.gallery-cover').click();
 await expect(page.locator('h1')).toHaveText('What the Rain Kept');
 await page.getByRole('button',{name:'Spine',exact:true}).click();
 await expect(page.locator('.atelier-stage .spine-specimen')).toContainText('What the Rain Kept');
 await page.getByRole('button',{name:'Back cover',exact:true}).click();
 await expect(page.locator('.atelier-stage .is-back')).toBeVisible();
 await page.getByLabel('Surface treatment').selectOption('Cloth');
 await expect(page.locator('.atelier-stage')).toHaveClass(/finish-cloth/);
 await page.getByLabel('Edition',{exact:true}).selectOption('Hardcover');
 await expect(page.locator('.atelier-stage')).toHaveClass(/edition-hardcover/);
});

test('interior browsing and detail inspection work with focus restoration',async({page})=>{
 await page.goto('/portfolio/concepts/the-unquiet-coast');
 await page.getByRole('button',{name:'Next spread',exact:false}).click();
 await expect(page.locator('.design-caption')).toContainText('Reading spread');
 const inspect=page.locator('.spread-viewer').getByRole('button',{name:'Inspect design'});
 await inspect.click();
 const dialog=page.getByRole('dialog',{name:'The Unquiet Coast interior detail'});
 await expect(dialog).toBeVisible();await expect(dialog).toContainText('A gull landed on the ticket office roof');
 await page.keyboard.press('Escape');await expect(dialog).not.toBeVisible();await expect(inspect).toBeFocused();
 await page.getByRole('button',{name:'Next spread',exact:false}).click();
 await expect(page.locator('.design-caption')).toContainText('Editorial detail');
});

test('formatting changes preserve the complete source text for every scenario',async({page})=>{
 await page.goto('/portfolio/concepts/transformation');
 for(const book of [specimens[0],specimens[2],specimens[3]]){
  await page.getByLabel('Manuscript',{exact:true}).selectOption(book.slug);
  const after=await page.locator('.comparison-page>p').allTextContents();
  await page.getByRole('button',{name:'Before',exact:true}).click();
  expect(await page.locator('.comparison-page>p').allTextContents()).toEqual(after);
  await page.getByRole('button',{name:'After',exact:true}).click();
 }
});

test('digital text genuinely reflows and format CTAs retain the selected service',async({page})=>{
 await page.goto('/portfolio/concepts/formats');
 await page.getByRole('button',{name:'Reflowable EPUB',exact:true}).click();
 const reader=page.locator('.reader-device article');
 await expect(reader).toHaveCSS('font-size','18px');
 const before=await reader.evaluate(e=>e.scrollHeight);
 await page.getByLabel('Text size',{exact:true}).fill('28');
 await expect(reader).toHaveCSS('font-size','28px');
 expect(await reader.evaluate(e=>e.scrollHeight)).toBeGreaterThan(before);
 await page.getByLabel('Reader width').selectOption('Wide');
 await expect(page.locator('.reader-device')).toHaveClass(/reader-wide/);
 await page.getByRole('link',{name:'Discuss this format'}).click();
 await expect(page.getByLabel('What would you like help with?')).toHaveValue('ebook-formatting');
});

test('all original book studies render, fit the viewport and meet automated accessibility checks',async({page})=>{
 test.setTimeout(180000);
 for(const route of ['/portfolio/concepts','/portfolio/concepts/interiors','/portfolio/concepts/transformation','/portfolio/concepts/formats',...specimens.map(b=>'/portfolio/concepts/'+b.slug)]){
  await page.goto(route);await expect(page.locator('h1')).toHaveCount(1);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),route).toBe(false);
  const results=await new AxeBuilder({page}).analyze();
  expect(results.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),route).toEqual([]);
 }
});
