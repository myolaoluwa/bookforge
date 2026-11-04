import {readFileSync,statSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
const names=['city-loop.mp4','city-loop-mobile.mp4','ambience.mp3','poster.webp'];
const items=names.map(name=>{const path='public/reference/'+name;const probe=spawnSync('ffprobe',['-v','error','-show_entries','stream=codec_type,codec_name,width,height,duration','-of','json',path],{encoding:'utf8'});if(probe.status!==0)throw new Error('Media probe failed: '+name);return {path,bytes:statSync(path).size,sha256:createHash('sha256').update(readFileSync(path)).digest('hex'),streams:JSON.parse(probe.stdout).streams}});
const prior=spawnSync('git',['show','HEAD:dist/assets/city-loop.mp4'],{maxBuffer:10000000});
if(prior.status===0&&createHash('sha256').update(prior.stdout).digest('hex')!==items[0].sha256)throw new Error('Preserved film differs from the existing committed derivative');
mkdirSync('outputs/review',{recursive:true});writeFileSync('outputs/review/media-inventory.json',JSON.stringify({preservedFilmMatchesPriorCommit:prior.status===0,items},null,2));console.log(JSON.stringify({preservedFilmMatchesPriorCommit:prior.status===0,items},null,2));
