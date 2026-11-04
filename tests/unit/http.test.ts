import {describe,it,expect} from 'vitest';
import {smallJson,sameOrigin} from '../../lib/bookforge/http';
describe('bounded request handling',()=>{
 it('reads valid JSON',async()=>expect(await smallJson(new Request('http://local',{method:'POST',headers:{'Content-Type':'application/json'},body:'{"hello":"world"}'}))).toEqual({hello:'world'}));
 it('stops oversized bodies without trusting content length',async()=>expect(smallJson(new Request('http://local',{method:'POST',headers:{'Content-Type':'application/json'},body:'x'.repeat(200)}),100)).rejects.toThrow('Request too large'));
 it('rejects form and invalid JSON bodies',async()=>{await expect(smallJson(new Request('http://local',{method:'POST',body:'foo=bar'}))).rejects.toThrow('Expected JSON');await expect(smallJson(new Request('http://local',{method:'POST',headers:{'Content-Type':'application/json'},body:'invalid'}))).rejects.toThrow()});
 it('requires a matching explicit origin',()=>{expect(sameOrigin(new Request('https://studio.example',{headers:{origin:'https://studio.example'}}))).toBe(true);expect(sameOrigin(new Request('https://studio.example'))).toBe(false)});
});
