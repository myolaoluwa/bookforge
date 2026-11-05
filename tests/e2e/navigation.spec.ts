import {test,expect} from '@playwright/test';

test('every header link reaches its page and the logo returns home',async({page,isMobile})=>{
 test.setTimeout(180000);
 await page.goto('/');
 const header=page.locator('.site-header');
 const links=await header.locator('nav a').evaluateAll(nodes=>nodes.map(node=>({href:node.getAttribute('href')!,name:node.textContent!})));
 for(const link of links){
  await page.goto('/');
  if(isMobile)await header.getByRole('button',{name:'Menu navigation',exact:true}).click();
  const target=header.getByRole('link',{name:link.name,exact:true});
  const serviceLink=header.locator('.service-menu').getByRole('link',{name:link.name,exact:true,includeHidden:true});
  if(await serviceLink.count())await header.locator('.service-menu summary').click();
  await target.click();
  await expect(page).toHaveURL(new RegExp(link.href.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'$'));
  await expect(page.locator('main h1')).toBeVisible();
  await header.getByRole('link',{name:'BookForge home',exact:true}).click();
  await expect(page).toHaveURL('http://127.0.0.1:5173/');
  await expect(page.locator('#cinematic-title')).toBeVisible();
 }
});

test('hero calls to action navigate and craft link scrolls',async({page,isMobile})=>{
 await page.goto('/');await page.locator('.cinematic-hero').getByRole('link',{name:'Get a tailored quote',exact:true}).click();
 await expect(page).toHaveURL(/\/request-a-proposal$/);await expect(page.getByLabel('What would you like help with?')).toBeVisible();
 await page.goto('/');await page.getByRole('link',{name:'Explore the studio',exact:true}).click();
 await expect(page).toHaveURL(/\/services$/);await expect(page.locator('main h1')).toBeVisible();
 if(!isMobile){await page.goto('/');await page.getByRole('link',{name:'Discover the craft',exact:true}).click();
 await expect(page).toHaveURL(/\/#craft$/);await expect(page.locator('#craft')).toBeInViewport();}
});
