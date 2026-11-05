import sharp from 'sharp';
import {mkdirSync,copyFileSync,writeFileSync} from 'node:fs';
mkdirSync('public/craft',{recursive:true});
mkdirSync('public/brand',{recursive:true});
const generated='C:/Users/HP/.codex/generated_images/01a1ab42-a641-7bc0-b1f9-f13ef154216f/';
const assets=[['cloth','exec-8aed1436-cd40-4969-aaf3-a3458c5b7177.png'],['reading','exec-b4308506-6bce-4865-a5e6-24cae45c6c89.png'],['binding','exec-3bdbc815-f159-4eb8-96ab-587339201e86.png']];
for(const [name,file] of assets){
 await sharp(generated+file).resize({width:1600,withoutEnlargement:true}).webp({quality:88}).toFile('public/craft/'+name+'.webp');
 await sharp(generated+file).resize({width:720,withoutEnlargement:true}).webp({quality:84}).toFile('public/craft/'+name+'-mobile.webp');
}
// Preserve the supplied artwork byte-for-byte; web derivatives only crop/resize it.
const original='C:/Users/HP/Downloads/ChatGPT Image Nov 5, 2026, 11_29_33 AM.png';
copyFileSync(original,'public/brand/bookforge-supplied-original.png');
const transparent=generated+'exec-2ae8c723-93e2-416c-aaa9-e27fe1a6156f.png';
await sharp(transparent).png().toFile('public/brand/bookforge-logo.png');
await sharp(transparent).extract({left:510,top:105,width:520,height:620}).resize({height:256}).png().toFile('public/brand/bookforge-symbol-transparent.png');
await sharp(transparent).extract({left:170,top:735,width:1105,height:250}).resize({width:660}).png().toFile('public/brand/bookforge-wordmark.png');
writeFileSync('public/craft/provenance.json',JSON.stringify({created:'2026-11-05',kind:'Original AI-generated cinematic studio imagery',clientWork:false,teamPortraits:false,assets:assets.map(([name])=>name+'.webp'),logo:'User supplied artwork, original retained without modification; transparent PNG derivatives are cropped from the selected background-removal edit.'},null,2));

