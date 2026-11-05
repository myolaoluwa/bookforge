import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('supplied logo, cinematic imagery and scene dialog replace empty slots',async({page})=>{
 await page.goto('/');await expect(page.locator('.site-header .brand-logo')).toBeVisible();
 await expect(page.locator('.site-header .brand-logo-name')).toHaveAttribute('src','/brand/bookforge-wordmark.webp');
 await expect(page.locator('.content-placeholder,.portrait-placeholder,.sample-empty')).toHaveCount(0);
 await expect(page.locator('.craft-work-grid .craft-experience')).toHaveCount(2);
 const open=page.getByRole('button',{name:'Explore cover craft',exact:true});await open.click();
 const dialog=page.getByRole('dialog',{name:'BookForge craft experience'});await expect(dialog).toBeVisible();
 await dialog.getByRole('button',{name:'Inside the book',exact:false}).click();await expect(dialog.locator('h2')).toHaveText('A rhythm for reading.');
 await dialog.getByRole('link',{name:'Discuss this part of your book'}).click();await expect(page.getByLabel('What would you like help with?')).toHaveValue('paperback-formatting');
});
test('motion pauses on request, offscreen and for reduced motion',async({page})=>{
 await page.goto('/');const frame=page.locator('.craft-work-grid .craft-frame').first();await frame.scrollIntoViewIfNeeded();await expect(frame).toHaveAttribute('data-motion','playing');
 const pause=frame.getByRole('button',{name:'Pause motion for cover craft'});await pause.click();await expect(frame).toHaveAttribute('data-motion','paused');
 await frame.getByRole('button',{name:'Resume motion for cover craft'}).click();await expect(frame).toHaveAttribute('data-motion','playing');
 await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await expect(frame).toHaveAttribute('data-motion','offscreen');
 await page.emulateMedia({reducedMotion:'reduce'});await frame.scrollIntoViewIfNeeded();await expect(frame).toHaveAttribute('data-motion','reduced');
 await expect(frame.getByRole('button',{name:'Still scene'})).toBeDisabled();
});
test('scene gallery preserves keyboard controls and honest craft descriptions',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');const section=page.locator('#people');await section.scrollIntoViewIfNeeded();
 await expect(section.locator('h2')).toContainText('The craft behind');await expect(section.locator('.portrait-print img')).toHaveCount(3);
 await section.getByRole('button',{name:'Next studio portrait'}).click();await expect(section.locator('.ensemble-selection h3')).toHaveText('A rhythm for reading');
 await expect(section).toContainText('not staff portraits or client publications');
});
test('replacement scenes and dialogs are accessible across public pages',async({page})=>{
 test.setTimeout(180000);await page.emulateMedia({reducedMotion:'reduce'});
 for(const route of ['/','/portfolio','/about','/testimonials','/services/book-cover-design']){
  await page.goto(route);expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),route).toBe(false);
  const result=await new AxeBuilder({page}).analyze();expect(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),route).toEqual([]);
 }
 await page.goto('/');await page.getByRole('button',{name:'Explore cover craft',exact:true}).click();
 const dialog=page.getByRole('dialog',{name:'BookForge craft experience'});const result=await new AxeBuilder({page}).analyze();expect(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
 await page.keyboard.press('Escape');await expect(dialog).not.toBeVisible();await expect(page.getByRole('button',{name:'Explore cover craft',exact:true})).toBeFocused();
});
