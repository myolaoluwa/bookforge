import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';

test('each service has relevant stages and changing service resets the stage',async({page})=>{
 await page.goto('/request-a-proposal');
 const service=page.getByLabel('What would you like help with?');const stage=page.getByRole('combobox',{name:'Where is your book now?',exact:true});
 for(const [value,label] of [
  ['manuscript-editing','Ready for a final edit or proofread'],['ebook-formatting','Final manuscript ready for EPUB formatting'],
  ['paperback-formatting','Final manuscript ready for print layout'],['hardcover-formatting','Final manuscript and printer specifications are ready'],
  ['book-cover-design','Ready for a new cover design'],['kdp-publishing-preparation','Book files are ready; I need upload preparation'],
  ['book-marketing','My finished book is approaching publication'],['goodreads-author-setup','My profile is ready; I need reader research']
 ]){await service.selectOption(value);await expect(stage).toHaveValue('unsure');await expect(stage.locator('option[value="ready"]')).toHaveText(label);await stage.selectOption('ready')}
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
});

test('custom answers are required, survive review and back, and appear in the download',async({page})=>{
 await page.goto('/request-a-proposal');await page.getByLabel('Your name',{exact:true}).fill('Test author');await page.getByLabel('Email address',{exact:true}).fill('author@example.com');
 await page.getByLabel('What would you like help with?').selectOption('other');await page.getByRole('combobox',{name:'Where is your book now?',exact:true}).selectOption('other');
 await page.getByRole('button',{name:'Continue',exact:true}).click();await expect(page.getByLabel('Describe the help you need')).toBeVisible();
 expect(await page.getByLabel('Describe the help you need').evaluate(el=>(el as HTMLTextAreaElement).validity.valueMissing)).toBe(true);
 await page.getByLabel('Describe the help you need').fill('Illustrated poetry layout');await page.getByLabel('Describe where your book is now').fill('The poems are final; illustrations are nearly ready.');
 await page.getByRole('button',{name:'Continue',exact:true}).click();await page.getByLabel('Tell us about your project').fill('I need a considered layout for poetry and full-page illustrations.');await page.getByRole('button',{name:'Continue',exact:true}).click();
 await expect(page.locator('.review-details')).toContainText('Illustrated poetry layout');await expect(page.locator('.review-details')).toContainText('The poems are final; illustrations are nearly ready.');
 const downloadEvent=page.waitForEvent('download');await page.getByRole('button',{name:'Download my project brief'}).click();const download=await downloadEvent;const text=readFileSync((await download.path())!,'utf8');expect(text).toContain('Illustrated poetry layout');expect(text).toContain('The poems are final; illustrations are nearly ready.');
 await page.getByRole('button',{name:'Back',exact:true}).click();await page.getByRole('button',{name:'Back',exact:true}).click();await expect(page.getByLabel('Describe the help you need')).toHaveValue('Illustrated poetry layout');await expect(page.getByLabel('Describe where your book is now')).toHaveValue('The poems are final; illustrations are nearly ready.');
 await page.getByLabel('What would you like help with?').selectOption('book-cover-design');await expect(page.getByRole('combobox',{name:'Where is your book now?',exact:true})).toHaveValue('unsure');await expect(page.getByLabel('Describe the help you need')).toHaveCount(0);await expect(page.getByLabel('Describe where your book is now')).toHaveCount(0);await expect(page.getByLabel('Your name',{exact:true})).toHaveValue('Test author');
 await page.getByLabel('What would you like help with?').selectOption('other');await expect(page.getByLabel('Describe the help you need')).toHaveValue('');
});
