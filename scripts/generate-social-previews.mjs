// Reproducible social cards: original photographic study, supplied logo, local fonts.
import {chromium} from '@playwright/test';
import sharp from 'sharp';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const data=(file,mime)=>`data:${mime};base64,${readFileSync(root+'public/'+file).toString('base64')}`;
const background=data('brand/share/bookforge-cinematic-still.webp','image/webp');
const logo=data('brand/bookforge-bf-on-dark.png','image/png');
const font=name=>data('fonts/'+name,'font/woff2');
const cards={
 home:{label:'FOR THE AUTHOR IN YOU',lines:['Your story.','Beautifully','finished.'],description:'Editing, design & publishing support.',tag:'FROM YOUR MANUSCRIPT TO YOUR NEXT CHAPTER'},
 editing:{label:'MANUSCRIPT EDITING',lines:['Your voice.','Every word,','considered.'],description:'Clarity, flow and care for your manuscript.',tag:'KEEP YOUR VOICE. BRING YOUR STORY INTO FOCUS.'},
 formatting:{label:'PRINT & EBOOK FORMATTING',lines:['A beautiful','book, inside','and out.'],description:'Considered interiors. A pleasure to read.',tag:'EBOOK · PAPERBACK · HARDCOVER'},
 covers:{label:'BOOK COVER DESIGN',lines:['Your story.','An irresistible','first look.'],description:'A cover shaped around the world within.',tag:'DESIGN FOR PRINT & DIGITAL EDITIONS'},
 discovery:{label:'AUTHOR PRESENCE & DISCOVERY',lines:['Your words.','Their next','great read.'],description:'Thoughtful support for your author presence.',tag:'READER RESEARCH · AUTHOR PROFILE SUPPORT'},
 resources:{label:'RESOURCES FOR INDEPENDENT AUTHORS',lines:['Your next','chapter,','made clearer.'],description:'Practical guidance for the book you’re making.',tag:'MANUSCRIPTS · PROOFS · FINAL FILES'}
};
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
function html(card){return `<!doctype html><html lang="en"><meta charset="utf-8"><style>
@font-face{font-family:Manrope;src:url(${font('manrope-latin.woff2')}) format('woff2');font-weight:400 600}
@font-face{font-family:Cormorant;src:url(${font('cormorant-latin.woff2')}) format('woff2');font-weight:400}
*{box-sizing:border-box}body{margin:0;background:#07110d;color:#faf4e9;font-family:Manrope,sans-serif}.card{width:1200px;height:630px;position:relative;overflow:hidden}
.scene{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.shade{position:absolute;inset:0;background:linear-gradient(90deg,rgba(5,15,12,.38),rgba(5,15,12,.22) 42%,transparent 69%)}
.brand{position:absolute;top:47px;left:62px;display:flex;align-items:center;gap:13px;height:56px}.brand-lockup{width:268px;height:57px;object-fit:contain}.wordmark{width:182px;height:auto;filter:brightness(0) invert(1)}.studio{font-size:9px;letter-spacing:3.8px;color:#dbc4a5;margin:4px 0 0 3px}
.label{position:absolute;top:140px;left:65px;font-size:11px;letter-spacing:2.5px;color:#d7af79;margin:0}
h1{position:absolute;left:60px;top:177px;margin:0;font:400 87px/.87 Cormorant,serif;letter-spacing:-1.8px}h1 span{display:block}h1 span:last-child{color:#e1bc86;font-style:italic}
.description{position:absolute;top:435px;left:65px;font-size:18px;line-height:1.6;width:480px;margin:0;color:#f0e9da}
.footer{position:absolute;bottom:41px;left:65px;right:65px;padding-top:18px;border-top:1px solid #b896624d;display:flex;align-items:center;justify-content:space-between}.tag{font-size:9px;letter-spacing:1.7px;color:#cfbfa6}.signature{font:italic 27px Cormorant,serif;color:#f2dfbc}.signature span{font:22px Manrope,sans-serif;margin-left:12px}
</style><div class="card"><img class="scene" src="${background}" alt=""><div class="shade"></div><div class="brand"><img class="brand-lockup" src="${logo}" alt="BookForge"></div><p class="label">${escape(card.label)}</p><h1>${card.lines.map(s=>`<span>${escape(s)}</span>`).join('')}</h1><p class="description">${escape(card.description)}</p><div class="footer"><span class="tag">${escape(card.tag)}</span><span class="signature">The art of the finished book.<span>↗</span></span></div></div></html>`;}
mkdirSync(root+'outputs/social',{recursive:true});
const browser=await chromium.launch({channel:'msedge'});
try{
 for(const [key,card] of Object.entries(cards)){
  const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
  await page.setContent(html(card));await page.evaluate(async()=>{await document.fonts.ready;await Promise.all(Array.from(document.images).map(img=>img.decode()))});
  const bytes=await page.screenshot();
  await sharp(bytes).png({palette:true,colours:256,dither:0.6,effort:10}).toFile(root+`public/brand/share/bookforge-${key}-v3.png`);
  if(key==='home')writeFileSync(root+'outputs/social/home-v3.html',html(card));
  await page.close();
 }
 console.log('Rendered six cinematic 1200x630 sharing previews using the supplied BookForge logo.');
}finally{await browser.close()}
