import sharp from 'sharp';
import {readFileSync,copyFileSync} from 'node:fs';
const source=process.argv[2]||'public/brand/bookforge-bf-source.png';
const root='public/brand/';
if(source!==root+'bookforge-bf-source.png')copyFileSync(source,root+'bookforge-bf-source.png');
const original=await sharp(source).trim().toBuffer();
await sharp(original).resize({width:3200,kernel:'lanczos3'}).sharpen({sigma:.5}).png().toFile(root+'bookforge-bf-master.png');
const {width,height}=await sharp(original).metadata();
// The transparent gap separates the supplied emblem from the supplied wordmark.
const {data,info}=await sharp(original).ensureAlpha().raw().toBuffer({resolveWithObject:true});
let end=0;
for(let x=0;x<width;x++){let count=0;for(let y=0;y<height;y++)if(data[(y*info.width+x)*4+3]>128)count++;if(count<3&&x>width*.15){end=x;break;}}
if(!end||end>width*.4)throw Error('Cannot locate emblem boundary');
const emblem=await sharp(original).extract({left:0,top:0,width:end,height}).trim().png().toBuffer();
await sharp(emblem).resize({width:768}).png().toFile(root+'bookforge-bf-symbol.png');
await sharp(original).resize({width:960}).png().toFile(root+'bookforge-bf-on-light.png');
// Same artwork and alpha; the existing brand's SVG light-ink treatment retains copper.
function onDark(bytes,w,h){return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><filter id="contrast" color-interpolation-filters="sRGB"><feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 .957 0 0 0 0 .941 0 0 0 0 .91 -1 -1 -1 0 1.1" result="light"/><feComponentTransfer in="light" result="mask"><feFuncA type="table" tableValues="0 0 0 1 1"/></feComponentTransfer><feComposite in="mask" in2="SourceAlpha" operator="in" result="lightShape"/><feComposite in="lightShape" in2="SourceGraphic" operator="over"/></filter></defs><image href="data:image/png;base64,${bytes.toString('base64')}" width="${w}" height="${h}" filter="url(#contrast)"/></svg>`);}
await sharp(onDark(original,width,height)).resize({width:960}).png().toFile(root+'bookforge-bf-on-dark.png');
const meta=await sharp(emblem).metadata();
const icon=await sharp(onDark(emblem,meta.width,meta.height)).resize(208,208,{fit:'contain',background:'#111b1d'}).extend({top:24,bottom:24,left:24,right:24,background:'#111b1d'}).flatten({background:'#111b1d'}).png().toBuffer();
await sharp(icon).png().toFile(root+'bookforge-bf-favicon.png');
await sharp(icon).resize(180,180).png().toFile(root+'bookforge-bf-apple-touch.png');
console.log('Prepared 3200px master, transparent light/dark lockups, emblem, favicon and touch icon.');
