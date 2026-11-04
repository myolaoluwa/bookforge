import {test,expect} from '@playwright/test';
test('a social crawler receives complete metadata without executing JavaScript',async({request})=>{
 for(const route of ['/','/services/ebook-formatting','/services/book-cover-design','/services/goodreads-author-setup','/resources']){
  const response=await request.get(route,{headers:{'User-Agent':'facebookexternalhit/1.1'}});expect(response.status()).toBe(200);const html=await response.text();const head=html.split('</head>')[0];
  for(const name of ['og:title','og:description','og:type','og:url','og:site_name','og:image','og:image:width','og:image:height','og:image:type','og:image:alt'])expect(head,route).toContain(`property="${name}"`);
  expect(head).toContain('name="twitter:card" content="summary_large_image"');expect(head).toContain('name="twitter:image"');expect(head).toContain('content="1200"');expect(head).toContain('content="630"');expect(head).not.toMatch(/content="http:\/\/localhost/);
  const image=head.match(/property="og:image" content="([^"]+)"/)?.[1];expect(image).toBeTruthy();const asset=await request.get(new URL(image!).pathname);expect(asset.status()).toBe(200);expect(asset.headers()['content-type']).toContain('image/png');
 }
});
