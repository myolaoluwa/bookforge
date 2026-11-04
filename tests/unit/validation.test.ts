import {describe,it,expect} from 'vitest';
import {inquirySchema,entrySchema,canPublish,canWrite,canDelete} from '../../lib/bookforge/validation';
const inquiry={requestId:'b73fc4b6-09cc-4b2e-bbf1-fcb65071509a',name:'Test author',email:'author@example.com',service:'goodreads-author-setup',package:'essentials',stage:'draft',description:'A test manuscript needing a profile review.',consent:true,turnstileToken:'test-token'};
describe('proposal validation',()=>{
 it('accepts a scoped Goodreads inquiry',()=>expect(inquirySchema.safeParse(inquiry).success).toBe(true));
 it.each([{consent:false},{email:'author@example.com\r\nBcc: other@example.com'},{package:'invented'},{service:'ebook-formatting'},{description:'short'},{website:'https://spam.example'},{wordCount:-5},{stage:'unknown'},{requestId:'not-a-uuid'}])('rejects invalid or injected fields %j',change=>expect(inquirySchema.safeParse({...inquiry,...change}).success).toBe(false));
 it('accepts an undecided author and preserves format/platform choices',()=>{const result=inquirySchema.parse({...inquiry,service:'unsure',package:'',stage:'unsure',formats:['ebook','paperback'],platform:'amazon-kdp'});expect(result.formats).toEqual(['ebook','paperback']);expect(result.platform).toBe('amazon-kdp')});
 it('rejects unsupported publishing platforms',()=>expect(inquirySchema.safeParse({...inquiry,platform:'invented'}).success).toBe(false));
 it('does not accept password or arbitrary fields',()=>expect(inquirySchema.safeParse({...inquiry,password:'secret'}).success).toBe(false));
});
describe('publication policy',()=>{
 const draft=entrySchema.parse({slug:'real-book',title:'A real book',summary:'A recorded project.',body:'Verified contribution.',status:'published',permission_approved:false});
 it('blocks client work without permission',()=>expect(canPublish('projects',draft)).toBe(false));
 it('blocks unsubstantiated projects with missing cover or deliverables',()=>expect(canPublish('projects',{...draft,permission_approved:true})).toBe(false));
 it('allows approved documented project assets',()=>expect(canPublish('projects',{...draft,permission_approved:true,data:{cover:'/media/approved-id',alt:'Approved cover',deliverables:['Print interior']}})).toBe(true));
 it('blocks testimonials without a source',()=>expect(canPublish('testimonials',{...draft,permission_approved:true})).toBe(false));
 it('accepts a private draft without public proof',()=>expect(canPublish('projects',{...draft,status:'draft'})).toBe(true));
 it('rejects executable cover URLs',()=>expect(entrySchema.safeParse({...draft,data:{cover:'javascript:alert(1)'}}).success).toBe(false));
 it('requires descriptive, site-owned sample images',()=>{expect(entrySchema.safeParse({...draft,data:{images:[{path:'/media/approved',alt:'A chapter opening'}]}}).success).toBe(true);expect(entrySchema.safeParse({...draft,data:{images:[{path:'https://example.com/image.jpg',alt:'A chapter opening'}]}}).success).toBe(false)});
 it('rejects traversal in public gallery paths',()=>expect(entrySchema.safeParse({...draft,data:{images:[{path:'/media/../private',alt:'A chapter opening'}]}}).success).toBe(false));
 it('rejects executable review source links',()=>expect(entrySchema.safeParse({...draft,data:{source:'javascript:alert(1)'}}).success).toBe(false));
 it('rejects cross origin redirects',()=>expect(entrySchema.safeParse({...draft,data:{target:'//attacker.example'}}).success).toBe(false));
});
describe('roles',()=>{
 it('only owner and editor can write',()=>{expect(canWrite('owner')).toBe(true);expect(canWrite('editor')).toBe(true);expect(canWrite('viewer')).toBe(false);expect(canWrite(undefined)).toBe(false)});
 it('only the owner can delete',()=>{expect(canDelete('owner')).toBe(true);expect(canDelete('editor')).toBe(false);expect(canDelete('viewer')).toBe(false)});
});
