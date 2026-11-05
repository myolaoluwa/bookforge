import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {readFile} from 'node:fs/promises';

test('the sample viewer exposes labeled original work and adapts its reading view',async({page})=>{
 await page.goto('/');
 await expect(page.getByRole('region',{name:'Print interior demonstration'})).toBeVisible();
 await page.getByRole('button',{name:'Ebook preview',exact:true}).click();
 const sample=page.getByRole('region',{name:'Ebook preview demonstration'});
 await expect(sample.locator('p').first()).toHaveCSS('font-size','16px');
 await page.getByRole('button',{name:'Enlarge reading view',exact:true}).click();
 await expect(sample.locator('p').first()).toHaveCSS('font-size','20px');
 await expect(page.locator('.sample-annotation>span')).toContainText('Not a client publication');
 await page.getByRole('button',{name:'Cover',exact:true}).click();
 await expect(page.getByRole('region',{name:'Cover demonstration'}).getByRole('img')).toBeVisible();
});

test('service finder recommends a relevant service and carries it into the brief',async({page})=>{
 await page.goto('/pricing');await page.getByLabel('Where would a little help make the difference?').selectOption('cover');
 await page.locator('.finder-result').getByRole('link',{name:'Get a tailored quote'}).click();
 await expect(page.getByLabel('What would you like help with?')).toHaveValue('book-cover-design');
});

test('format and platform choices survive navigation and the local brief download',async({page})=>{
 await page.goto('/request-a-proposal');
 await expect(page.getByLabel('What would you like help with?')).toHaveValue('unsure');
 await page.getByLabel('Your name',{exact:true}).fill('Test author');await page.getByLabel('Email address',{exact:true}).fill('author@example.com');
 await page.getByRole('button',{name:'Continue',exact:true}).click();
 await page.getByLabel('Paperback',{exact:true}).check();await page.getByLabel('Ebook',{exact:true}).check();await page.getByLabel('Intended publishing platform').selectOption('amazon-kdp');
 await page.getByLabel('Tell us about your project').fill('An original manuscript for a print and digital edition.');
 await page.getByRole('button',{name:'Continue',exact:true}).click();
 await expect(page.locator('.review-details')).toContainText('ebook, paperback');
 await page.getByRole('button',{name:'Back',exact:true}).click();
 await expect(page.getByLabel('Paperback',{exact:true})).toBeChecked();await expect(page.getByLabel('Intended publishing platform')).toHaveValue('amazon-kdp');
 await page.getByRole('button',{name:'Continue',exact:true}).click();
 const downloadEvent=page.waitForEvent('download');await page.getByRole('button',{name:'Download my project brief'}).click();const download=await downloadEvent;
 const text=await readFile((await download.path())!,'utf8');expect(text).toContain('formats: ebook,paperback');expect(text).toContain('platform: amazon-kdp');expect(text).toContain('has not been submitted');
});

test('unconfigured calendar and cinematic craft scenes never simulate bookings or clients',async({page})=>{
 await page.goto('/consultation');await expect(page.getByText('Calendar availability pending')).toBeVisible();await expect(page.getByRole('link',{name:'Open the booking calendar'})).toHaveCount(0);
 await page.goto('/portfolio');await expect(page.locator('.craft-work-grid .craft-experience')).toHaveCount(2);await expect(page.locator('.craft-provenance').first()).toContainText('not client publications');
 await page.goto('/testimonials');await expect(page.locator('.craft-promise')).toContainText('Handled with care');await expect(page.locator('.content-placeholder')).toHaveCount(0);
});

test('new trust pages are accessible and fit mobile',async({page})=>{
 test.setTimeout(180000);
 for(const route of ['/pricing','/consultation','/sample-proposal','/working-together','/resources','/resources/prepare-your-manuscript','/about','/testimonials']){
  await page.goto(route);await expect(page.locator('h1')).toHaveCount(1);expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),route).toBe(false);
  const result=await new AxeBuilder({page}).analyze();expect(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),route).toEqual([]);
 }
});

test('the sample proposal is downloadable and explicitly nonbinding',async({request})=>{
 const response=await request.get('/resources/bookforge-sample-proposal.txt');expect(response.status()).toBe(200);expect(await response.text()).toContain('not a quote, contract or offer');
});
