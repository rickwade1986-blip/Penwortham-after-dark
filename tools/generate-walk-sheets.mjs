import fs from 'node:fs';
import path from 'node:path';
import { inflateSync, deflateSync } from 'node:zlib';

const ROOT = process.cwd();
const OUT = path.join(ROOT,'v5/assets/characters/generated');
fs.mkdirSync(OUT,{recursive:true});

const crcTable=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;t[n]=c>>>0;}return t})();
const crc32=b=>{let c=0xffffffff;for(const x of b)c=crcTable[(c^x)&255]^(c>>>8);return (c^0xffffffff)>>>0};
const chunk=(type,data)=>{const tb=Buffer.from(type);const out=Buffer.alloc(12+data.length);out.writeUInt32BE(data.length,0);tb.copy(out,4);data.copy(out,8);out.writeUInt32BE(crc32(Buffer.concat([tb,data])),8+data.length);return out};

function decodePNG(b){
  const w=b.readUInt32BE(16),h=b.readUInt32BE(20),bit=b[24],color=b[25];
  if(bit!==8||color!==6)throw new Error('RGBA8 PNG required');
  let off=8,ids=[];while(off<b.length){const len=b.readUInt32BE(off),type=b.toString('ascii',off+4,off+8);if(type==='IDAT')ids.push(b.subarray(off+8,off+8+len));off+=12+len}
  const raw=inflateSync(Buffer.concat(ids)),stride=w*4,out=Buffer.alloc(h*stride);let rp=0;
  const paeth=(a,b,c)=>{const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c};
  for(let y=0;y<h;y++){
    const f=raw[rp++],row=out.subarray(y*stride,(y+1)*stride),prev=y?out.subarray((y-1)*stride,y*stride):null;
    for(let x=0;x<stride;x++){const v=raw[rp++],a=x>=4?row[x-4]:0,bb=prev?prev[x]:0,c=prev&&x>=4?prev[x-4]:0;row[x]=(v+(f===0?0:f===1?a:f===2?bb:f===3?Math.floor((a+bb)/2):f===4?paeth(a,bb,c):0))&255}
  }
  return {w,h,data:out};
}

function encodePNG(w,h,data){
  const ih=Buffer.alloc(13);ih.writeUInt32BE(w,0);ih.writeUInt32BE(h,4);ih[8]=8;ih[9]=6;
  const raw=Buffer.alloc(h*(1+w*4));let p=0;
  for(let y=0;y<h;y++){raw[p++]=0;data.copy(raw,p,y*w*4,(y+1)*w*4);p+=w*4}
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ih),chunk('IDAT',deflateSync(raw,{level:9})),chunk('IEND',Buffer.alloc(0))]);
}

function bbox(img){
  let minX=img.w,minY=img.h,maxX=-1,maxY=-1;
  for(let y=0;y<img.h;y++)for(let x=0;x<img.w;x++)if(img.data[(y*img.w+x)*4+3]>8){minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y)}
  return {minX,minY,maxX,maxY,w:maxX-minX+1,h:maxY-minY+1};
}
function px(img,x,y){x=Math.round(x);y=Math.round(y);if(x<0||y<0||x>=img.w||y>=img.h)return null;const i=(y*img.w+x)*4;return [img.data[i],img.data[i+1],img.data[i+2],img.data[i+3]]}
function over(dst,di,c){const a=c[3]/255;if(a<=0)return;const da=dst[di+3]/255,oa=a+da*(1-a);if(oa<=0)return;dst[di]=Math.round((c[0]*a+dst[di]*da*(1-a))/oa);dst[di+1]=Math.round((c[1]*a+dst[di+1]*da*(1-a))/oa);dst[di+2]=Math.round((c[2]*a+dst[di+2]*da*(1-a))/oa);dst[di+3]=Math.round(oa*255)}

const FW=256,FH=384,POSES=[0,.9,.45,0,-.9,-.45];

function makeFrame(img,box,pose,mode){
  const out=Buffer.alloc(FW*FH*4);
  const sc=Math.min(224/box.w,352/box.h),cxS=(box.minX+box.maxX)/2,botS=box.maxY;
  const cxD=FW/2,botD=FH-10,hipS=box.minY+box.h*(mode==='side'?.56:.59),hipDY=botD-(botS-hipS)*sc;
  const side=mode==='side', legAngle=(side?30:17)*Math.abs(pose), spread=(side?7:4)*pose, lift=(side?10:7)*Math.abs(pose);
  function part(kind,angleDeg,dx,dy){
    const ang=-angleDeg*Math.PI/180,ca=Math.cos(ang),sa=Math.sin(ang);
    const pivotSX=kind==='left'?cxS-box.w*.10:kind==='right'?cxS+box.w*.10:cxS;
    const pivotDX=cxD+(pivotSX-cxS)*sc,pivotDY=hipDY;
    for(let y=0;y<FH;y++)for(let x=0;x<FW;x++){
      let qx=x-dx-pivotDX,qy=y-dy-pivotDY;
      const rx=qx*ca-qy*sa+pivotDX,ry=qx*sa+qy*ca+pivotDY;
      const sx=cxS+(rx-cxD)/sc,sy=botS-(botD-ry)/sc;
      if(sx<box.minX||sx>box.maxX||sy<box.minY||sy>box.maxY)continue;
      const upperOverlap=hipS+box.h*.065;
      if(kind==='upper'&&sy>upperOverlap)continue;
      if(kind==='left'&&!(sy>=hipS&&sx<=cxS+box.w*.04))continue;
      if(kind==='right'&&!(sy>=hipS&&sx>=cxS-box.w*.04))continue;
      const c=px(img,sx,sy);if(!c||c[3]<5)continue;over(out,(y*FW+x)*4,c);
    }
  }
  if(pose>=0){
    part('right',-legAngle,spread,-lift);
    part('left',legAngle,-spread,2);
  }else{
    part('left',-legAngle,-spread,-lift);
    part('right',legAngle,spread,2);
  }
  part('upper',-pose*(side?4.5:2.5),-pose*(side?5:2.5),-Math.abs(pose)*(side?4:2.5));
  return out;
}

function makeSheet(srcPath,mode,outName){
  const img=decodePNG(fs.readFileSync(srcPath)),box=bbox(img);
  const sheet=Buffer.alloc(FW*POSES.length*FH*4);
  for(let i=0;i<POSES.length;i++){
    const fr=makeFrame(img,box,POSES[i],mode);
    for(let y=0;y<FH;y++)fr.copy(sheet,(y*FW*POSES.length+i*FW)*4,y*FW*4,(y+1)*FW*4);
  }
  const png=encodePNG(FW*POSES.length,FH,sheet);
  fs.writeFileSync(path.join(OUT,outName),png);
  return {file:outName,frameWidth:FW,frameHeight:FH,frames:POSES.length,source:path.basename(srcPath),mode};
}

const C='v5/assets/characters';
const jobs=[
  ['rick_master.png','front','rick-front-cycle.png'],
  ['rick-side-walk.png','side','rick-side-cycle.png'],
  ['rick-back-walk.png','back','rick-back-cycle.png'],
  ['laura_master.png','front','laura-front-cycle.png'],
  ['laura-side-walk.png','side','laura-side-cycle.png'],
  ['laura-back-walk.png','back','laura-back-cycle.png']
];
const manifest=jobs.map(([src,mode,out])=>makeSheet(path.join(ROOT,C,src),mode,out));
fs.writeFileSync(path.join(OUT,'walk-cycles.json'),JSON.stringify({generatedAt:new Date().toISOString(),frameRate:8,cycles:manifest},null,2));
console.log(JSON.stringify(manifest,null,2));
