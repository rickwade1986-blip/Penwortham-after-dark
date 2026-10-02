window.PAD_ART = (() => {
  const TAU=Math.PI*2;
  const COLORS={
    ink:'#15131a', skin:'#d8a07d', skin2:'#b9795c', white:'#f7f3fb',
    denim:'#38546f', black:'#18171d', purple:'#7a4f9e', gold:'#d9b15f',
    red:'#8e4b58', green:'#41694d'
  };

  function rr(c,x,y,w,h,r,fill,stroke=COLORS.ink,lw=3){
    c.beginPath();c.roundRect(x,y,w,h,r);c.fillStyle=fill;c.fill();
    if(stroke){c.strokeStyle=stroke;c.lineWidth=lw;c.stroke()}
  }
  function el(c,x,y,rx,ry,fill,stroke=null,lw=3){
    c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.fillStyle=fill;c.fill();
    if(stroke){c.strokeStyle=stroke;c.lineWidth=lw;c.stroke()}
  }
  function ln(c,x1,y1,x2,y2,w,color){
    c.strokeStyle=color;c.lineWidth=w;c.lineCap='round';c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke()
  }
  function grad(c,x1,y1,x2,y2,a,b){
    const g=c.createLinearGradient(x1,y1,x2,y2);g.addColorStop(0,a);g.addColorStop(1,b);return g
  }

  function basePerson(c,p,step=0){
    c.clearRect(0,0,128,160);
    const bob=step?2:0;
    const sway=step?5:-4;
    c.save();c.translate(0,bob);

    el(c,64,147,30,8,'rgba(0,0,0,.22)');

    const legY=106;
    ln(c,53,legY,50+sway*.35,136,14,p.trousers||'#292832');
    ln(c,75,legY,78-sway*.35,136,14,p.trousers||'#292832');
    rr(c,38+sway*.35,132,25,13,6,p.shoes||'#e6e2e7',COLORS.ink,3);
    rr(c,66-sway*.35,132,25,13,6,p.shoes||'#e6e2e7',COLORS.ink,3);

    const bodyW=p.bodyW||48;
    rr(c,64-bodyW/2,68,bodyW,47,13,grad(c,0,68,0,115,p.topHi||p.top,p.top),COLORS.ink,4);

    const armOut=p.armOut||0;
    ln(c,64-bodyW/2+4,80,36+sway*.35-armOut,105,12,p.skin||COLORS.skin);
    ln(c,64+bodyW/2-4,80,92-sway*.35+armOut,105,12,p.skin||COLORS.skin);

    if(p.apron){
      c.fillStyle=p.apron;c.beginPath();c.moveTo(47,80);c.lineTo(81,80);c.lineTo(86,113);c.lineTo(42,113);c.closePath();c.fill();
      c.strokeStyle=COLORS.ink;c.lineWidth=2;c.stroke();
    }
    if(p.jacket){
      c.fillStyle=p.jacket;
      c.beginPath();c.moveTo(43,72);c.lineTo(60,87);c.lineTo(50,111);c.lineTo(40,105);c.closePath();c.fill();
      c.beginPath();c.moveTo(85,72);c.lineTo(68,87);c.lineTo(78,111);c.lineTo(88,105);c.closePath();c.fill();
    }
    if(p.towel){
      rr(c,43,73,42,20,8,'#f2ece0',COLORS.ink,2);
      c.fillStyle='#d9d0c0';c.fillRect(49,86,30,28);
    }

    const headY=43;
    el(c,64,headY,29,31,p.skin||COLORS.skin,COLORS.ink,4);

    if(p.hair==='short-dark'){
      c.fillStyle='#28232a';c.beginPath();c.arc(64,39,29,Math.PI,TAU);c.fill();
      c.fillStyle='#332c34';c.beginPath();c.moveTo(36,39);c.quadraticCurveTo(48,8,69,14);c.quadraticCurveTo(91,10,94,38);c.quadraticCurveTo(78,25,60,27);c.quadraticCurveTo(46,20,36,39);c.fill();
    }else if(p.hair==='shoulder'){
      c.fillStyle=p.hairColor||'#71533f';
      c.beginPath();c.moveTo(36,40);c.quadraticCurveTo(40,10,64,12);c.quadraticCurveTo(91,11,93,43);c.lineTo(86,88);c.quadraticCurveTo(77,68,78,43);c.quadraticCurveTo(64,27,50,40);c.lineTo(45,88);c.quadraticCurveTo(34,68,36,40);c.fill();
    }else if(p.hair==='grey'){
      c.fillStyle='#c4c0ba';c.beginPath();c.arc(64,38,28,Math.PI,TAU);c.fill();
      c.fillStyle='#aaa49e';c.fillRect(36,38,9,25);c.fillRect(83,38,9,25);
    }else if(p.hair==='bald'){
      c.fillStyle='#c9c4be';c.beginPath();c.arc(64,44,29,2.8,6.7);c.fill();
      c.fillStyle='#b0aaa3';c.fillRect(36,42,8,22);c.fillRect(84,42,8,22);
    }else if(p.hair==='beanie'){
      c.fillStyle=p.hairColor||'#30313a';c.beginPath();c.arc(64,35,30,Math.PI,TAU);c.fill();c.fillRect(35,34,59,12);
    }

    if(p.glasses){
      c.strokeStyle=p.glassesColor||'#8f3c45';c.lineWidth=4;
      c.beginPath();c.arc(53,45,11,0,TAU);c.arc(76,45,11,0,TAU);c.moveTo(64,45);c.lineTo(65,45);c.stroke();
    }

    if(p.beard){
      c.fillStyle='#3a3030';c.beginPath();c.arc(64,51,23,.12,Math.PI-.12);c.lineTo(77,68);c.quadraticCurveTo(64,74,51,68);c.closePath();c.fill();
      c.fillStyle=p.skin||COLORS.skin;c.beginPath();c.arc(64,48,16,0,Math.PI);c.fill();
    }

    el(c,54,45,3,3,'#21191a');el(c,75,45,3,3,'#21191a');
    if(p.smile==='big'){
      c.strokeStyle='#fff';c.lineWidth=3;c.beginPath();c.arc(64,54,10,.15,Math.PI-.15);c.stroke();
    }else if(p.smile==='pout'){
      c.strokeStyle='#813344';c.lineWidth=4;c.beginPath();c.arc(64,58,10,3.4,6.0);c.stroke();
    }else{
      c.strokeStyle='#6c3c32';c.lineWidth=2.5;c.beginPath();c.arc(64,54,8,.2,Math.PI-.2);c.stroke();
    }

    if(p.badge){
      rr(c,74,86,22,13,4,'#ece8f0',null,0);c.fillStyle='#2b2530';c.font='bold 8px sans-serif';c.textAlign='center';c.fillText(p.badge,85,95);
    }
    if(p.tattoos){
      ln(c,33,88,27,101,2,'#54a5c4');ln(c,29,94,37,98,2,'#d85e99');ln(c,31,103,39,107,2,'#4b7bb3');
    }

    c.restore();
  }

  function addNpc(scene,key,profile){
    for(let i=0;i<2;i++){
      const canvas=document.createElement('canvas');canvas.width=128;canvas.height=160;
      const c=canvas.getContext('2d');basePerson(c,profile,i);
      scene.textures.addCanvas(`npc-${key}-${i}`,canvas);
    }
  }

  function prop(scene,key,w,h,draw){
    const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
    const c=canvas.getContext('2d');draw(c,w,h);scene.textures.addCanvas(key,canvas);
  }

  function install(scene){
    if(!scene.textures.exists('npc-will-0')){
      addNpc(scene,'will',{
        top:'#16171d',topHi:'#2f313b',trousers:'#24252b',shoes:'#ece8e8',
        hair:'short-dark',beard:true,smile:'big',badge:'WILL'
      });
      addNpc(scene,'denise',{
        top:'#261b29',topHi:'#513952',trousers:'#2f2933',shoes:'#ded8df',
        hair:'shoulder',hairColor:'#745240',bodyW:58,smile:'big',badge:'DENISE'
      });
      addNpc(scene,'andrew',{
        top:'#5c3f83',topHi:'#8462aa',trousers:'#282533',shoes:'#d7c7ef',
        hair:'short-dark',smile:'big',badge:'3000'
      });
      addNpc(scene,'barista',{
        top:'#554239',topHi:'#74594c',trousers:'#2b292d',shoes:'#d8d4d1',
        hair:'beanie',hairColor:'#24232a',apron:'#2e2628',smile:'big'
      });
      addNpc(scene,'oldman',{
        top:'#33343a',topHi:'#505159',trousers:'#34343a',shoes:'#bbb7b5',
        hair:'grey',glasses:true,glassesColor:'#44474f',smile:'big'
      });
      addNpc(scene,'sauna',{
        top:'#b97861',topHi:'#d49a7d',trousers:'#e5ddd0',shoes:'#d7cec1',
        hair:'bald',towel:true,smile:'big'
      });
      addNpc(scene,'agent',{
        top:'#345664',topHi:'#507989',trousers:'#272e34',shoes:'#dfdde2',
        hair:'short-dark',jacket:'#263b46',smile:'big',badge:'TRAVEL'
      });
    }

    if(!scene.textures.exists('roast-shot')){
      prop(scene,'roast-shot',128,128,(c)=>{
        el(c,64,66,42,32,'#eee3cd','#4b3327',5);
        el(c,50,66,16,12,'#8b573c');el(c,83,58,10,8,'#6f994d');el(c,88,75,10,8,'#d79d43');
        c.fillStyle='#fff7';c.fillRect(38,47,50,4);
      });
      prop(scene,'wine-pickup',128,128,(c)=>{
        c.strokeStyle='#f8f2ff';c.lineWidth=7;c.beginPath();c.moveTo(44,30);c.quadraticCurveTo(64,78,84,30);c.stroke();
        ln(c,64,66,64,95,6,'#f8f2ff');ln(c,48,96,80,96,6,'#f8f2ff');
        c.fillStyle='rgba(255,255,255,.2)';c.beginPath();c.ellipse(64,57,15,8,0,0,TAU);c.fill();
      });
      prop(scene,'milk-pickup',128,128,(c)=>{
        rr(c,40,30,48,72,5,'#f1f5e8','#17314a',4);c.fillStyle='#68b5dc';c.fillRect(45,55,38,30);
        c.fillStyle='#17314a';c.font='bold 15px sans-serif';c.textAlign='center';c.fillText('MILK',64,76);
      });
      prop(scene,'glasses',128,128,(c)=>{
        c.strokeStyle='#e8eeff';c.lineWidth=6;c.beginPath();c.arc(45,64,16,0,TAU);c.arc(82,64,16,0,TAU);c.moveTo(61,64);c.lineTo(66,64);c.stroke();
      });
    }
  }

  function npcTexture(id,frame=0){
    const map={will:'will',denise:'denise',andrew:'andrew',barista:'barista',oldman:'oldman','sauna-guy':'sauna',agent:'agent'};
    return `npc-${map[id]||'barista'}-${frame}`;
  }

  return {install,npcTexture};
})();