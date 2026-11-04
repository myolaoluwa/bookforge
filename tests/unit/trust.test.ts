import {describe,it,expect} from 'vitest';
import {consultationUrl,priceLabel,startingPrice} from '../../lib/bookforge/trust';
describe('booking configuration',()=>{
 it('accepts an HTTPS booking page',()=>expect(consultationUrl('https://calendar.example/book')).toBe('https://calendar.example/book'));
 it.each(['','not-a-url','javascript:alert(1)','http://calendar.example/book','https://user:secret@calendar.example/book'])('does not expose an invalid or credential-bearing calendar: %s',url=>expect(consultationUrl(url)).toBe(''));
 it('does not turn empty rates into invented prices',()=>{expect(startingPrice({from:null,scope:'',currency:'USD'})).toBeNull();expect(priceLabel('unknown')).toBeNull()});
 it('requires a defined scope before publishing an amount',()=>expect(startingPrice({from:250,scope:'',currency:'USD'})).toBeNull());
 it('formats an approved price in its stated currency',()=>expect(startingPrice({from:250,scope:'One reflowable novel EPUB',currency:'USD'})).toBe('$250.00'));
});
