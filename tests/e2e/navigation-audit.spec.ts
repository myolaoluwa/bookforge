import {test,expect} from '@playwright/test';
import {publicRoutes} from '../../lib/bookforge/content';

test('public body and footer links load their destination documents',async({page},testInfo)=>{
 test.setTimeout(600000);
 const links=new Map<string,{source:string;href:string;label:string}>();
 for(const source of publicRoutes){
  const response=await page.goto(source,{waitUntil:'domcontentloaded'});expect(response?.status(),source).toBeLessThan(400);
  const found=await page.locator('main a[href]:not([download]),footer a[href]').evaluateAll(nodes=>nodes.filter(node=>(node as HTMLElement).checkVisibility()).map(node=>({href:node.getAttribute('href')!,label:node.textContent?.trim()||'Image link'})));
  for(const item of found){
   if(!item.href.startsWith('/')||item.href.startsWith('//')||item.href.startsWith('/admin'))continue;
   if(!links.has(item.href))links.set(item.href,{source,...item});
  }
  const anchors=await page.locator('main a[href^="#"]').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('href')!.slice(1)).filter(Boolean));
  for(const id of anchors)expect(await page.evaluate(id=>Boolean(document.getElementById(decodeURIComponent(id))),id),source+'#'+id).toBe(true);
 }
 // Keep the originally reported gallery link explicit, even if another link
 // to /portfolio was found earlier in the crawl.
 links.set('/portfolio',{source:'/',href:'/portfolio',label:'Visit the project gallery'});
 console.log('Auditing '+links.size+' body/footer destinations on '+testInfo.project.name);
 for(const item of links.values()){
  await test.step(item.source+' → '+item.href,async()=>{
  await page.goto(item.source,{waitUntil:'domcontentloaded'});
  const target=item.label==='Visit the project gallery'?page.getByRole('link',{name:item.label,exact:true}):page.locator('main a[href='+JSON.stringify(item.href)+'],footer a[href='+JSON.stringify(item.href)+']').filter({visible:true}).first();
  const [response]=await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),target.click()]);
  const status=response?.status()??(await page.request.get(item.href)).status();
  expect(status,JSON.stringify(item)).toBeLessThan(400);
  await expect(page).toHaveURL(new URL(item.href,'http://127.0.0.1:5173').href);
  await expect(page.locator('main h1'),JSON.stringify(item)).toBeVisible();
  });
 }
 await testInfo.attach('audited-destinations',{body:JSON.stringify([...links.values()],null,2),contentType:'application/json'});
});
