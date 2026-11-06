import {describe,it,expect} from 'vitest';
import {readFileSync,statSync} from 'node:fs';
import {resolveSiteOrigin} from '../../lib/bookforge/config';
import {metadata} from '../../lib/bookforge/seo';
import {socialCards,socialCardFor,socialCopyFor} from '../../lib/bookforge/social';

describe('share metadata',()=>{
 it('uses the custom domain when deployment configuration is absent',()=>expect(resolveSiteOrigin(undefined)).toBe('https://bookforge.ink'));
 it('normalizes the configured domain without tracking or trailing paths',()=>expect(resolveSiteOrigin('https://books.example/path?utm_source=test')).toBe('https://books.example'));
 it.each(['invalid','javascript:alert(1)','https://user:secret@books.example'])('rejects invalid or credential-bearing origins: %s',value=>expect(resolveSiteOrigin(value)).toBe(resolveSiteOrigin(undefined)));
 it('gives authors distinct search and social headlines',()=>{const result=metadata('Fallback title','Fallback description','/');expect(result.title).toBe('Book Editing, Formatting & Cover Design');expect(result.openGraph?.title).toBe('You wrote the book. Let\u2019s bring it to life.');expect(result.description).toContain('independent authors');expect(result.twitter).toMatchObject({card:'summary_large_image'});expect(result.openGraph).toMatchObject({images:[expect.objectContaining({width:1200,height:630,type:'image/png',alt:expect.any(String)})]})});
 it('retains custom metadata for published records',()=>{const result=metadata('An author-approved project','The actual project description.','/portfolio/a-real-book');expect(result.title).toBe('An author-approved project');expect(result.description).toBe('The actual project description.');expect(result.openGraph?.title).toBe('An author-approved project')});
 it.each([['/services/manuscript-editing','editing'],['/services/ebook-formatting','formatting'],['/services/paperback-formatting','formatting'],['/services/book-cover-design','covers'],['/services/goodreads-author-setup','discovery'],['/resources/prepare-your-manuscript','resources'],['/portfolio/example','home']])('selects appropriate artwork for %s',(path,key)=>expect(socialCardFor(path)).toBe(key));
 it('does not remove the Goodreads independence and verification distinction',()=>expect(socialCopyFor('/services/goodreads-author-setup','','').description).toContain('Goodreads controls verification'));
 it.each(Object.values(socialCards))('ships a real, compact 1200x630 PNG: $file',card=>{const path=new URL('../../public/brand/share/'+card.file,import.meta.url);const buffer=readFileSync(path);expect(buffer.subarray(1,4).toString()).toBe('PNG');expect(buffer.readUInt32BE(16)).toBe(1200);expect(buffer.readUInt32BE(20)).toBe(630);expect(statSync(path).size).toBeLessThan(300000);expect(card.alt.length).toBeGreaterThan(30)});
 it.each([['feed',1350],['story',1920]])('includes a separate Instagram %s creative',(name,height)=>{const bytes=readFileSync(new URL(`../../public/brand/share/bookforge-instagram-${name}-v1.png`,import.meta.url));expect(bytes.readUInt32BE(16)).toBe(1080);expect(bytes.readUInt32BE(20)).toBe(height)});
});
