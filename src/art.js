window.PAD_ART = (() => {
  const TAU = Math.PI * 2;

  function rr(c,x,y,w,h,r,fill,stroke='#17131c',lw=4){
    c.beginPath(); c.roundRect(x,y,w,h,r); c.fillStyle=fill; c.fill();
    if(stroke){c.strokeStyle=stroke;c.lineWidth=lw;c.stroke();}
  }
  function ellipse(c,x,y,rx,ry,fill,stroke=null,lw=3){
    c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.fillStyle=fill;c.fill();
    if(stroke){c.strokeStyle=stroke;c.lineWidth=lw;c.stroke();}
  }
  function line(c,x1,y1,x2,y2,w,color){
    c.strokeStyle=color;c.lineWidth=w;c.lineCap='round';c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();
  }
  function poly(c,pts,fill,stroke='#17131c',lw=3){
    c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)c.lineTo(pts[i][0],pts[i][1]);c.closePath();c.fillStyle=fill;c.fill();
    if(stroke){c.strokeStyle=stroke;c.lineWidth=lw;c.stroke();}
  }
  function shade(hex,amt){
    const n=parseInt(hex.slice(1),16),r=(n>>16)+amt,g=((n>>8)&255)+amt,b=(n&255)+amt;
    return '#'+(0x1000000+(Math.max(0,Math.min(255,r))<<16)+(Math.max(0,Math.min(255,g))<<8)+Math.max(0,Math.min(255,b))).toString(16).slice(1);
  }
  function hair(c,dir,color){
    if(dir==='up'){
      ellipse(c,64,42,30,29,color,'#17131c',4);
      c.fillStyle=shade(color,18);c.beginPath();c.arc(58,33,20,Math.PI,TAU);c.fill();
      return;
    }
    ellipse(c,64,42,29,29,'#d8a07d','#17131c',4);
    c.fillStyle=color;
    c.beginPath();
    c.moveTo(35,44);c.quadraticCurveTo(36,12,62,13);c.quadraticCurveTo(92,9,94,43);
    c.quadraticCurveTo(84,28,72,31);c.quadraticCurveTo(57,19,43,36);c.closePath();c.fill();
    c.strokeStyle='#17131c';c.lineWidth=3;c.stroke();
  }
  function face(c,kind,dir){
    if(dir==='up')return;
    const side=dir==='left'||dir==='right';
    c.fillStyle='#231a1b';
    if(side){
      ellipse(c,61,45,3,3,'#231a1b');
      line(c,67,53,74,55,3,kind==='fats'?'#7c2f43':'#6a3c31');
    }else{
      ellipse(c,54,44,3,3,'#231a1b');ellipse(c,74,44,3,3,'#231a1b');
      if(kind==='fats'){
        line(c,54,36,61,38,3,'#211719');line(c,68,38,76,36,3,'#211719');
        c.strokeStyle='#8f344b';c.lineWidth=4;c.beginPath();c.arc(65,55,9,3.45,5.95);c.stroke();
      }else{
        c.strokeStyle='#6d4034';c.lineWidth=3;c.beginPath();c.arc(64,52,8,.25,Math.PI-.25);c.stroke();
      }
    }
  }
  function beard(c,dir){
    if(dir==='up')return;
    c.fillStyle='#231f23';
    if(dir==='down'){
      c.beginPath();c.arc(64,47,25,.15,Math.PI-.15);c.lineTo(78,65);c.quadraticCurveTo(64,72,50,65);c.closePath();c.fill();
      c.fillStyle='#d8a07d';c.beginPath();c.arc(64,45,18,0,Math.PI);c.fill();
    }else{
      c.beginPath();c.arc(66,49,21,.2,Math.PI-.4);c.lineTo(74,65);c.lineTo(55,61);c.closePath();c.fill();
      c.fillStyle='#d8a07d';c.beginPath();c.arc(63,46,14,0,Math.PI);c.fill();
    }
  }
  function blondeHair(c,dir){
    if(dir==='up'){
      ellipse(c,64,45,32,33,'#e8cf9f','#17131c',4);
      poly(c,[[38,44],[43,88],[53,77],[58,46]],'#e8cf9f',null);
      poly(c,[[90,44],[85,88],[75,77],[70,46]],'#e8cf9f',null);
      return;
    }
    ellipse(c,64,42,29,29,'#e4ad87','#17131c',4);
    c.fillStyle='#e8cf9f';
    c.beginPath();c.moveTo(36,44);c.quadraticCurveTo(38,11,64,12);c.quadraticCurveTo(93,11,93,46);c.lineTo(87,86);c.quadraticCurveTo(79,69,77,44);c.quadraticCurveTo(63,25,47,39);c.lineTo(43,86);c.quadraticCurveTo(32,70,36,44);c.fill();
    c.strokeStyle='#17131c';c.lineWidth=3;c.stroke();
  }

  function drawCharacter(c,opt,dir,step){
    c.clearRect(0,0,128,160);
    const outline='#17131c';
    const moving=step===1;
    const leftStep=moving?-7:5,rightStep=moving?7:-5;
    const side=dir==='left'||dir==='right';
    const flip=dir==='left'?-1:1;
    c.save();c.translate(64,0);c.scale(flip,1);c.translate(-64,0);

    ellipse(c,64,145,31,9,'rgba(0,0,0,.22)');

    // legs / shoes - deliberately oversized, readable at phone scale
    const lx=49+(side?leftStep:Math.round(leftStep*.55));
    const rx=79+(side?rightStep:Math.round(rightStep*.55));
    line(c,lx,104,lx+leftStep*.28,136,15,opt.trousers);
    line(c,rx,104,rx+rightStep*.28,136,15,opt.trousers);
    rr(c,lx-11+leftStep*.28,132,24,14,6,opt.shoes,outline,3);
    rr(c,rx-11+rightStep*.28,132,24,14,6,opt.shoes,outline,3);

    // torso
    rr(c,40,68,48,48,13,opt.top,outline,4);
    c.fillStyle=shade(opt.top,20);c.fillRect(45,74,38,7);

    // arms
    const skin=opt.skin||'#dda481';
    line(c,42,79,28+(moving?4:0),105,13,skin);
    line(c,86,79,100-(moving?4:0),104,13,skin);

    if(opt.tattoo){
      c.strokeStyle='#5ab3cb';c.lineWidth=3;
      [[31,88,38,91],[29,94,36,98],[29,101,35,105]].forEach(a=>line(c,a[0],a[1],a[2],a[3],2,'#55aac5'));
      line(c,32,90,30,104,2,'#cf5aa6');
    }

    if(opt.kind==='rick'){
      hair(c,dir,opt.hair);beard(c,dir);face(c,'rick',dir);
      // microphone
      const mx=100,my=94;
      line(c,mx,my,mx+4,116,5,'#30323a');ellipse(c,mx,my-5,8,8,'#b9bcc5',outline,3);
      if(dir!=='up'){c.fillStyle='#f6f2f8';c.font='bold 13px sans-serif';c.textAlign='center';c.fillText('R',64,99);}
    }else if(opt.kind==='laura'){
      blondeHair(c,dir);face(c,'laura',dir);
      // guitar, purple body + neck
      c.save();c.translate(67,96);c.rotate(side?-.12:-.28);
      rr(c,-23,-13,44,29,13,'#a53fb0',outline,3);
      ellipse(c,-7,1,7,7,'#e9d5ff',null);
      c.fillStyle='#6d2e77';c.fillRect(15,-5,50,10);
      c.strokeStyle='#f5e9ff';c.lineWidth=1;
      [-2,1,4].forEach(y=>line(c,-14,y,62,y,1,'#f3e8ff'));
      c.restore();
    }else{
      hair(c,dir,opt.hair);face(c,'fats',dir);
      // jacket lapels and deliberately LEAN body
      poly(c,[[43,72],[58,90],[49,113],[39,104]],'#25242b',null);
      poly(c,[[85,72],[70,90],[79,113],[89,104]],'#25242b',null);
    }
    c.restore();
  }

  function texture(scene,key,opt,dir,step){
    const canvas=document.createElement('canvas');canvas.width=128;canvas.height=160;
    const c=canvas.getContext('2d');c.imageSmoothingEnabled=true;
    drawCharacter(c,opt,dir,step);
    scene.textures.addCanvas(key,canvas);
  }

  function npc(scene,key,top='#455f7a',hairColor='#3a2b29'){
    texture(scene,key+'-down-0',{kind:'npc',top,trousers:'#282832',shoes:'#dedbe2',hair:hairColor,skin:'#d7a27e'},'down',0);
    texture(scene,key+'-down-1',{kind:'npc',top,trousers:'#282832',shoes:'#dedbe2',hair:hairColor,skin:'#d7a27e'},'down',1);
  }

  function propTexture(scene,key,draw,w=128,h=128){
    const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
    const c=canvas.getContext('2d');c.imageSmoothingEnabled=true;draw(c,w,h);
    scene.textures.addCanvas(key,canvas);
  }

  function install(scene){
    if(scene.textures.exists('rick-down-0'))return;

    const dirs=['down','up','right','left'];
    for(const d of dirs){
      for(let s=0;s<2;s++){
        texture(scene,`rick-${d}-${s}`,{kind:'rick',top:'#315f45',trousers:'#24262d',shoes:'#e7e4e3',hair:'#211f25',skin:'#d8a07d'},d,s);
        texture(scene,`laura-${d}-${s}`,{kind:'laura',top:'#17151c',trousers:'#24232b',shoes:'#38343f',hair:'#e8cf9f',skin:'#e2aa87',tattoo:true},d,s);
      }
    }
    for(const d of dirs)for(let s=0;s<2;s++)texture(scene,`fats-${d}-${s}`,{kind:'fats',top:'#17171c',trousers:'#1d1d22',shoes:'#3a3940',hair:'#202027',skin:'#d6a07d'},d,s);

    npc(scene,'npc-blue','#416a87','#3a2521');
    npc(scene,'npc-red','#844e58','#403128');
    npc(scene,'npc-gold','#8a7040','#25242a');

    propTexture(scene,'enemy-mood',(c)=>{
      ellipse(c,64,79,34,31,'#584a68','#17131c',5);
      rr(c,28,39,72,22,7,'#777081','#17131c',4);
      ellipse(c,51,75,6,7,'#f8f4ff');ellipse(c,78,75,6,7,'#f8f4ff');
      ellipse(c,52,77,2.5,3,'#17131c');ellipse(c,79,77,2.5,3,'#17131c');
      c.strokeStyle='#ff5e67';c.lineWidth=5;c.beginPath();c.arc(65,94,14,Math.PI,TAU);c.stroke();
    });

    propTexture(scene,'roast-shot',(c)=>{
      ellipse(c,64,64,40,30,'#e9dfcb','#4b3327',5);
      ellipse(c,52,64,15,12,'#8b573c');
      ellipse(c,82,57,10,8,'#6a954b');ellipse(c,88,72,9,7,'#d69b42');
    });

    propTexture(scene,'wine-pickup',(c)=>{
      c.strokeStyle='#f8f2ff';c.lineWidth=7;c.beginPath();c.moveTo(44,30);c.quadraticCurveTo(64,78,84,30);c.stroke();
      line(c,64,66,64,95,6,'#f8f2ff');line(c,48,96,80,96,6,'#f8f2ff');
      c.fillStyle='rgba(255,255,255,.25)';c.beginPath();c.ellipse(64,57,15,8,0,0,TAU);c.fill();
    });

    propTexture(scene,'milk-pickup',(c)=>{
      rr(c,40,30,48,72,5,'#f1f5e8','#17314a',4);c.fillStyle='#68b5dc';c.fillRect(45,55,38,30);
      c.fillStyle='#17314a';c.font='bold 15px sans-serif';c.textAlign='center';c.fillText('MILK',64,76);
    });

    propTexture(scene,'glasses',(c)=>{
      c.strokeStyle='#e8eeff';c.lineWidth=6;c.beginPath();c.arc(45,64,16,0,TAU);c.arc(82,64,16,0,TAU);c.moveTo(61,64);c.lineTo(66,64);c.stroke();
    },128,128);
  }

  return {install};
})();