import {afterEach,beforeEach,describe,it,expect,vi} from 'vitest';

describe('default soundtrack playback',()=>{
 const audio={volume:1,play:vi.fn<()=>Promise<void>>(),pause:vi.fn()};
 beforeEach(()=>{vi.resetModules();audio.volume=1;audio.play.mockReset().mockResolvedValue();audio.pause.mockReset();vi.stubGlobal('document',{getElementById:()=>audio});vi.stubGlobal('requestAnimationFrame',vi.fn(()=>1));vi.stubGlobal('cancelAnimationFrame',vi.fn())});
 afterEach(()=>vi.unstubAllGlobals());
 it('requests audible playback once at the intended volume when allowed',async()=>{const sound=await import('../../components/bookforge/sound');await sound.startDefaultSound();await sound.startDefaultSound();expect(audio.play).toHaveBeenCalledTimes(1);expect(audio.volume).toBe(.35);expect(sound.soundSnapshot()).toBe('on')});
 it('shows a blocked state instead of pretending sound is playing',async()=>{audio.play.mockRejectedValueOnce(new DOMException('Autoplay denied','NotAllowedError'));const sound=await import('../../components/bookforge/sound');await sound.startDefaultSound();expect(sound.soundSnapshot()).toBe('blocked');await sound.setSound(true);expect(sound.soundSnapshot()).toBe('on')});
 it('pauses immediately and does not auto-restart after the user stops it',async()=>{const sound=await import('../../components/bookforge/sound');await sound.startDefaultSound();await sound.setSound(false);expect(audio.pause).toHaveBeenCalledTimes(1);expect(sound.soundSnapshot()).toBe('off');await sound.startDefaultSound();expect(audio.play).toHaveBeenCalledTimes(1)});
 it('does not let a late autoplay rejection overwrite a newer user action',async()=>{let reject!:(error:Error)=>void;audio.play.mockImplementationOnce(()=>new Promise((_,r)=>{reject=r}));const sound=await import('../../components/bookforge/sound');const first=sound.startDefaultSound();await sound.setSound(false);reject(new DOMException('Interrupted','NotAllowedError'));await first;expect(sound.soundSnapshot()).toBe('off')});
 it('reflects a later native pause or media failure',async()=>{const sound=await import('../../components/bookforge/sound');await sound.startDefaultSound();sound.soundMediaEvent('pause');expect(sound.soundSnapshot()).toBe('off');sound.soundMediaEvent('error');expect(sound.soundSnapshot()).toBe('error')});
});
