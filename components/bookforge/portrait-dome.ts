import type {StudioIntroduction} from './studio-ensemble';
export type DomeController={goTo:(index:number)=>void;visible:(value:boolean)=>void;destroy:()=>void};
type Callbacks={select:(index:number)=>void;moving:(value:boolean)=>void;fallback:()=>void};
const wrap=(value:number,length:number)=>((value%length)+length)%length;

/* Independent cylindrical photo geometry. Subdivision lets the photographs
   themselves curve and flex with momentum, rather than rotating flat cards. */
export function createPortraitDome(canvas:HTMLCanvasElement,host:HTMLElement,people:StudioIntroduction[],callbacks:Callbacks,initial=0):DomeController|null{
 const gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:true,powerPreference:'low-power'});if(!gl)return null;
 const vertex=`attribute vec2 aPosition;varying vec2 vUv;
 uniform vec2 uViewport;uniform vec2 uSize;uniform float uRadius;uniform float uAngle;uniform float uLift;uniform float uVelocity;uniform float uReveal;
 void main(){vUv=aPosition+0.5;float theta=uAngle+aPosition.x*uSize.x/uRadius;
 float x=sin(theta)*uRadius;float z=(cos(theta)-1.0)*uRadius;
 float y=aPosition.y*uSize.y+uLift+sin(uAngle)*aPosition.x*22.0;
 z-=sin(vUv.x*3.14159265)*uVelocity*28.0;y-=(1.0-uReveal)*45.0;
 float perspective=1000.0/(1000.0-z);gl_Position=vec4(x*perspective/(uViewport.x*0.5),y*perspective/(uViewport.y*0.5),0.0,1.0);}`;
 const fragment=`precision mediump float;varying vec2 vUv;uniform sampler2D uImage;uniform vec2 uCrop;uniform float uAlpha;
 void main(){vec2 uv=(vUv-0.5)*uCrop+0.5;vec4 color=texture2D(uImage,uv);gl_FragColor=vec4(color.rgb,color.a*uAlpha);}`;
 const compile=(type:number,source:string)=>{const shader=gl.createShader(type)!;gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){gl.deleteShader(shader);throw Error('Portrait shader unavailable')}return shader};
 let program:WebGLProgram,vs:WebGLShader,fs:WebGLShader;
 try{vs=compile(gl.VERTEX_SHADER,vertex);fs=compile(gl.FRAGMENT_SHADER,fragment);program=gl.createProgram()!;gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Portrait program unavailable')}catch{return null}
 gl.useProgram(program);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
 const vertices:number[]=[],segments=24;
 for(let x=0;x<segments;x++)for(let y=0;y<segments;y++){const l=x/segments-.5,r=(x+1)/segments-.5,b=y/segments-.5,t=(y+1)/segments-.5;vertices.push(l,b,r,b,l,t,r,b,r,t,l,t)}
 const buffer=gl.createBuffer()!;gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);const position=gl.getAttribLocation(program,'aPosition');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
 const uniforms=Object.fromEntries(['uViewport','uSize','uRadius','uAngle','uLift','uVelocity','uReveal','uCrop','uAlpha','uImage'].map(name=>[name,gl.getUniformLocation(program,name)]));
 const colors=['#ddd6c9','#9ba8a0','#c0b5a6','#7e9189','#dedbd3'];
 const textures=people.map((person,index)=>{
  const sheet=document.createElement('canvas');sheet.width=640;sheet.height=800;const ctx=sheet.getContext('2d')!;
  ctx.fillStyle=colors[index%5];ctx.fillRect(0,0,640,800);ctx.fillStyle='#283032';ctx.font='18px Manrope';ctx.fillText('BOOKFORGE / STUDIO',40,60);
  ctx.strokeStyle='rgba(40,48,50,.24)';ctx.lineWidth=1;ctx.strokeRect(40,100,560,570);ctx.beginPath();ctx.moveTo(40,100);ctx.lineTo(600,670);ctx.moveTo(600,100);ctx.lineTo(40,670);ctx.stroke();
  ctx.fillStyle=colors[index%5];ctx.fillRect(66,300,508,165);ctx.fillStyle='#283032';ctx.textAlign='center';ctx.font='58px Cormorant';const words=person.role.split(' ');if(words.length>1){ctx.fillText(words.slice(0,-1).join(' '),320,365);ctx.fillText(words.at(-1)!,320,422)}else ctx.fillText(person.role,320,395);
  ctx.font='18px Manrope';ctx.fillText(person.portrait?'Portrait loading':'PORTRAIT PLACEHOLDER',320,730);
  const texture=gl.createTexture()!;const upload=(image:TexImageSource)=>{gl.bindTexture(gl.TEXTURE_2D,texture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE)};
  upload(sheet);return {texture,upload,aspect:.8,loaded:!person.portrait,loading:false};
 });
 let width=1,height=1,radius=900,spacing=.62,offset=initial,velocity=0,target:number|null=null,frame=0,last=0,alive=true,inView=true,dragging=false,startX=0,startY=0,lastX=0,lastTime=0,moved=false,axis:'x'|'y'|null=null,active=wrap(initial,people.length),wasMoving=false,reveal=0;
 const images:HTMLImageElement[]=[];
 const load=(index:number)=>{const item=textures[index],person=people[index];if(item.loaded||item.loading||!person.portrait)return;item.loading=true;const photo=new window.Image();images.push(photo);photo.crossOrigin='anonymous';photo.onload=()=>{if(!alive)return;try{const sheet=document.createElement('canvas'),factor=Math.min(1,960/Math.max(photo.width,photo.height));sheet.width=Math.max(1,Math.round(photo.width*factor));sheet.height=Math.max(1,Math.round(photo.height*factor));sheet.getContext('2d')!.drawImage(photo,0,0,sheet.width,sheet.height);item.upload(sheet);item.aspect=sheet.width/sheet.height;item.loaded=true;wake()}catch{callbacks.fallback()}};photo.onerror=()=>{if(alive)callbacks.fallback()};photo.src=person.portrait};
 const resize=()=>{width=host.clientWidth;height=host.clientHeight;const dpr=Math.min(devicePixelRatio||1,1.75);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);gl.viewport(0,0,canvas.width,canvas.height);radius=width<600?360:Math.max(780,width*.68);spacing=width<600?.64:.58;wake()};
 const update=(time:number)=>{
  frame=0;if(!alive||!inView||document.hidden)return;const dt=Math.min((time-last||16.67)/16.67,2);last=time;
  if(target!==null){const distance=target-offset;offset+=distance*(1-Math.pow(.82,dt));velocity=distance*.14;if(Math.abs(distance)<.001){offset=target;velocity=0;target=null}}
  else if(!dragging&&velocity!==0){offset+=velocity*dt;velocity*=Math.pow(.91,dt);if(Math.abs(velocity)<.004){velocity=0;target=Math.round(offset)}}
  reveal=Math.min(1,reveal+dt/32);const chosen=wrap(Math.round(offset),people.length);if(chosen!==active){active=chosen;callbacks.select(chosen)}
  const isMoving=dragging||Math.abs(velocity)>.003;if(isMoving!==wasMoving){wasMoving=isMoving;callbacks.moving(isMoving)}
  gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(program);gl.uniform2f(uniforms.uViewport,width,height);gl.uniform1f(uniforms.uRadius,radius);gl.uniform1f(uniforms.uVelocity,Math.max(-1,Math.min(1,velocity*14)));gl.uniform1f(uniforms.uReveal,1-Math.pow(1-reveal,3));
  const visible=people.map((_,i)=>({index:i,angle:(people.length===1?0:wrap(i-offset+people.length/2,people.length)-people.length/2)*spacing})).filter(item=>Math.abs(item.angle)<1.5).sort((a,b)=>Math.abs(b.angle)-Math.abs(a.angle));
  for(const {index,angle} of visible){load(index);const item=textures[index],h=height*(width<600?.72:.76),ratio=[.76,.86,.7,.82,.74][index%5];gl.uniform2f(uniforms.uSize,h*ratio,h);gl.uniform1f(uniforms.uAngle,angle);gl.uniform1f(uniforms.uLift,[8,-30,26,-12,32][index%5]);gl.uniform2f(uniforms.uCrop,Math.min(1,ratio/item.aspect),Math.min(1,item.aspect/ratio));gl.uniform1f(uniforms.uAlpha,reveal*Math.min(1,(1.5-Math.abs(angle))*5));gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,item.texture);gl.uniform1i(uniforms.uImage,0);gl.drawArrays(gl.TRIANGLES,0,vertices.length/2)}
  host.dataset.position=offset.toFixed(3);if(dragging||velocity!==0||target!==null||reveal<1)wake();
 };
 function wake(){if(alive&&inView&&!frame&&!document.hidden)frame=requestAnimationFrame(update)}
 const down=(event:PointerEvent)=>{if(people.length<2||event.button!==0)return;host.focus({preventScroll:true});dragging=true;moved=false;axis=null;target=null;velocity=0;startX=lastX=event.clientX;startY=event.clientY;lastTime=performance.now();wake()};
 const move=(event:PointerEvent)=>{if(!dragging)return;const dx=event.clientX-startX,dy=event.clientY-startY;if(!axis&&Math.max(Math.abs(dx),Math.abs(dy))>6){axis=Math.abs(dx)>Math.abs(dy)?'x':'y';if(axis==='x')host.setPointerCapture(event.pointerId)}if(axis==='y'){dragging=false;wake();return}if(axis!=='x')return;moved=true;const now=performance.now(),units=-(event.clientX-lastX)/(width<600?240:360);offset+=units;velocity=Math.max(-.12,Math.min(.12,units/Math.max((now-lastTime)/16.67,1)));lastX=event.clientX;lastTime=now;wake()};
 const up=(event:PointerEvent)=>{if(!dragging)return;dragging=false;if(!moved){const point=event.clientX-host.getBoundingClientRect().left-width/2;target=Math.round(offset)+(Math.abs(point)>width*.12?(point>0?1:-1):0)}else if(Math.abs(velocity)<.008)target=Math.round(offset);wake()};
 const cancel=()=>{if(!dragging)return;dragging=false;velocity=0;target=Math.round(offset);wake()};
 const lostCapture=(event:PointerEvent)=>{if(event.target===host)cancel()};
 const wheel=(event:WheelEvent)=>{const horizontal=Math.abs(event.deltaX)>Math.abs(event.deltaY);if(!horizontal&&!event.shiftKey)return;if(people.length<2)return;event.preventDefault();target=null;velocity=Math.max(-.14,Math.min(.14,velocity+(horizontal?event.deltaX:event.deltaY)*.0002));wake()};
 const visibility=()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;last=0}else wake()};
 const contextLost=(event:Event)=>{event.preventDefault();callbacks.fallback()};
 const observer=new ResizeObserver(resize);observer.observe(host);host.addEventListener('pointerdown',down);host.addEventListener('pointermove',move);host.addEventListener('pointerup',up);host.addEventListener('pointercancel',cancel);host.addEventListener('lostpointercapture',lostCapture);host.addEventListener('wheel',wheel,{passive:false});canvas.addEventListener('webglcontextlost',contextLost);document.addEventListener('visibilitychange',visibility);resize();
 return {goTo(index){const delta=wrap(index-wrap(offset,people.length)+people.length/2,people.length)-people.length/2;target=offset+delta;velocity=0;wake()},visible(value){inView=value;last=0;if(value)wake();else{cancelAnimationFrame(frame);frame=0}},destroy(){if(!alive)return;alive=false;cancelAnimationFrame(frame);observer.disconnect();host.removeEventListener('pointerdown',down);host.removeEventListener('pointermove',move);host.removeEventListener('pointerup',up);host.removeEventListener('pointercancel',cancel);host.removeEventListener('lostpointercapture',lostCapture);host.removeEventListener('wheel',wheel);canvas.removeEventListener('webglcontextlost',contextLost);document.removeEventListener('visibilitychange',visibility);for(const image of images){image.onload=null;image.onerror=null}textures.forEach(item=>gl.deleteTexture(item.texture));gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs)}};
}
