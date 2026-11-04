import {describe,it,expect} from 'vitest';
import {beatAt,taskAt,fadeVolume} from '../../lib/bookforge/cinema';
describe('film storytelling',()=>{
 it('follows playback time rather than a free running timer',()=>{expect(beatAt(0)).toBe(0);expect(beatAt(4)).toBe(1);expect(beatAt(10)).toBe(2);expect(beatAt(14)).toBe(3);expect(beatAt(19)).toBe(4)});
 it('returns to the opening when the existing film loops',()=>{expect(beatAt(19.9)).toBe(4);expect(beatAt(.1)).toBe(0)});
 it('shows only one responsibility at a time during tension',()=>{expect(taskAt(3.5)).toBe('Editing');expect(taskAt(5)).toBe('Formatting');expect(taskAt(7.9)).toBe('Marketing');expect(taskAt(9)).toBe('')});
 it('clamps animation frame timestamps and volume into browser bounds',()=>{expect(fadeVolume(0,.35,-20)).toBe(0);expect(fadeVolume(0,.35,900)).toBe(.35);expect(fadeVolume(.35,0,900)).toBe(0);expect(fadeVolume(1,0,-20)).toBe(1)});
});
