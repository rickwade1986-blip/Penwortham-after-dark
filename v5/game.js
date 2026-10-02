(() => {
'use strict';

const $=id=>document.getElementById(id);
const canvas=$('game'),ctx=canvas.getContext('2d');
const ui={
 objective:$('objectiveText'),leader:$('leaderName'),prompt:$('prompt'),
 swap:$('swap'),act:$('act'),ability:$('ability'),stick:$('stick'),knob:$('stick').querySelector('i'),moveHint:$('moveHint'),
 card:$('sceneCard'),sceneArt:$('sceneArt'),sceneKicker:$('sceneKicker'),sceneTitle:$('sceneTitle'),sceneText:$('sceneText'),sceneChoices:$('sceneChoices'),
 dialogue:$('dialogue'),speaker:$('speaker'),line:$('line'),toast:$('toast')
};

const W=1600,H=900,SAVE='pad-v5-concept-first';
const Q={CAR:'CAR',MILK:'MILK',WILL:'WILL',WRISTBAND:'WRISTBAND',GLASSES:'GLASSES',DENISE:'DENISE',GLASSES_OUTSIDE:'GLASSES_OUTSIDE',DENISE_RETURN:'DENISE_RETURN',TURKISH:'TURKISH',FATS:'FATS',DONE:'DONE'};
const obj={
 [Q.CAR]:"Find Rick's car",
 [Q.MILK]:'Behbeh, we need milk too',
 [Q.WILL]:"Go to Tap & Vine. Will's got the glasses.",
 [Q.WRISTBAND]:"Find Will's Kendal wristband",
 [Q.GLASSES]:'Take the wristband back to Will',
 [Q.DENISE]:'Find Denise at the Tap',
 [Q.GLASSES_OUTSIDE]:'Clear 3 abandoned glasses outside the Tap',
 [Q.DENISE_RETURN]:'Take the empties back to Denise',
 [Q.TURKISH]:'Get some food at The Turkish',
 [Q.FATS]:'FATS is having a roast-related crisis',
 [Q.DONE]:'Survived. Somehow.'
};

const fresh=()=>({
 quest:Q.CAR,leader:'rick',hp:6,started:true,
 flags:{car:false,milk:false,will:false,wristband:false,glasses:false,denise:false,tapGlasses:[false,false,false],wine:false,turkish:false,boss:false},
 pos:{x:770,y:650}
});
let state;
try{state={...fresh(),...JSON.parse(localStorage.getItem(SAVE)||'null')};state.flags={...fresh().flags,...(state.flags||{})};}catch{state=fresh()}
if(new URLSearchParams(location.search).get('reset')==='1'){state=fresh();localStorage.removeItem(SAVE)}
if(!Array.isArray(state.flags.tapGlasses))state.flags.tapGlasses=[false,false,false];

let dpr=1,scale=1,camY=0,last=performance.now(),dialogue=null,cardOpen=false,toastTimer=0;
let input={x:0,y:0},stickPointer=null,stickOrigin={x:0,y:0};
let player={x:state.pos?.x||770,y:state.pos?.y||650,vx:0,vy:0,dirX:0,dirY:1,walk:0};
let follower={x:player.x-34,y:player.y+20,vx:0,vy:0};
let dog={x:player.x-62,y:player.y+32,vx:0,vy:0,wag:0};
let particles=[],enemyShots=[],heroShots=[];
let boss={active:false,x:785,y:375,hp:34,max:34,vulnerable:'rick',swap:4.0,fire:1.05,flash:0};

function save(){
 state.pos={x:player.x,y:player.y};
 try{localStorage.setItem(SAVE,JSON.stringify(state))}catch{}
 refreshUI();
 document.body.dataset.gameReady='true';
 document.body.dataset.quest=state.quest;
}
function refreshUI(){
 ui.objective.textContent=obj[state.quest]||'Cause avoidable chaos';
 ui.leader.textContent=state.leader.toUpperCase();
 ui.leader.style.color=state.leader==='rick'?'#b7ff3e':'#ff4fa3';
 ui.ability.textContent=boss.active?(state.leader==='rick'?'BULLSHIT':'CALL BS'):(state.leader==='rick'?'BULLSHIT':'CALL BS');
}
function toast(t,ms=950){ui.toast.textContent=t;ui.toast.classList.remove('hidden');clearTimeout(toastTimer);toastTimer=setTimeout(()=>ui.toast.classList.add('hidden'),ms)}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function dist(ax,ay,bx,by){return Math.hypot(ax-bx,ay-by)}
function lerp(a,b,t){return a+(b-a)*t}
function seeded(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x)}

function say(name,lines,done){
 dialogue={name,lines:Array.isArray(lines)?lines:[lines],i:0,done:done||null};
 ui.speaker.textContent=name;
 ui.speaker.style.color=name.includes('LAURA')?'#ff4fa3':name.includes('RICK')?'#b7ff3e':'#efc56b';
 ui.line.textContent=dialogue.lines[0];
 ui.dialogue.classList.remove('hidden');
 resetStick();
}
function advanceDialogue(){
 if(!dialogue)return false;
 dialogue.i++;
 if(dialogue.i>=dialogue.lines.length){
  const d=dialogue.done;dialogue=null;ui.dialogue.classList.add('hidden');d?.();refreshUI();
 }else ui.line.textContent=dialogue.lines[dialogue.i];
 return true;
}

function worldToScreen(x,y){return{x:x*scale,y:(y-camY)*scale}}
function resize(){
 dpr=Math.max(1,Math.min(2,devicePixelRatio||1));
 canvas.width=Math.round(innerWidth*dpr);canvas.height=Math.round(innerHeight*dpr);
 canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';
 const art=ui.sceneArt.getContext('2d');
 ui.sceneArt.width=Math.round(ui.sceneArt.clientWidth*dpr||1400);ui.sceneArt.height=Math.round(ui.sceneArt.clientHeight*dpr||800);
 fitCamera();
}
function fitCamera(){
 // wider than the previous build: the whole town should read as a place, not a close-up.
 scale=Math.min(innerWidth/W,innerHeight/720);
 const visibleH=innerHeight/scale;
 camY=clamp(player.y-visibleH*.66,0,Math.max(0,H-visibleH));
}

function rounded(c,x,y,w,h,r,fill,stroke,lw=1){
 c.beginPath();c.roundRect(x,y,w,h,r);if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=lw;c.stroke()}
}
function text(c,t,x,y,size,fill,align='left',font='Arial Black'){
 c.font=`900 ${size}px ${font},sans-serif`;c.textAlign=align;c.textBaseline='middle';c.fillStyle=fill;c.fillText(t,x,y);
}
function glow(c,x,y,r,color,a=.3){
 const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color.replace(')',`,${a})`).replace('rgb','rgba'));g.addColorStop(1,color.replace(')',',0)').replace('rgb','rgba'));c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();
}
function building(c,x,y,w,h,base,trim,sign,label,windows=3){
 c.save();c.shadowColor='#0009';c.shadowBlur=18;c.shadowOffsetY=10;
 rounded(c,x,y,w,h,14,base,'#11151c',8);c.shadowColor='transparent';
 // brick texture
 c.globalAlpha=.16;c.strokeStyle='#f7e9dc';c.lineWidth=1.5;
 for(let yy=y+24;yy<y+h;yy+=22){c.beginPath();c.moveTo(x+8,yy);c.lineTo(x+w-8,yy);c.stroke()}
 for(let yy=y+24,row=0;yy<y+h;yy+=44,row++){for(let xx=x+18+(row%2?22:0);xx<x+w;xx+=44){c.beginPath();c.moveTo(xx,yy);c.lineTo(xx,yy+22);c.stroke()}}
 c.globalAlpha=1;
 rounded(c,x+24,y+25,w-48,58,8,'#10141b',trim,3);
 text(c,label,x+w/2,y+55,Math.min(28,w/10),sign,'center',label==='TAP & VINE'?'Georgia':'Arial Black');
 const gap=(w-54)/(windows+1);
 for(let i=0;i<windows;i++){
  const wx=x+36+i*gap,wy=y+108,ww=gap-18,wh=h-145;
  const grd=c.createLinearGradient(wx,wy,wx,wy+wh);grd.addColorStop(0,'#ffd078');grd.addColorStop(.55,'#bd6a35');grd.addColorStop(1,'#3b2727');
  rounded(c,wx,wy,ww,wh,7,grd,'#101319',6);
  c.strokeStyle='#ffe0a344';c.lineWidth=3;c.beginPath();c.moveTo(wx+ww/2,wy);c.lineTo(wx+ww/2,wy+wh);c.stroke();
 }
 c.restore();
}
function drawFlowerBasket(c,x,y,s=1){
 c.fillStyle='#5b3828';c.beginPath();c.ellipse(x,y+10*s,18*s,10*s,0,0,Math.PI*2);c.fill();
 const cols=['#ff4f87','#ffc84f','#f06a5e','#bd6cff','#f8e6d0'];
 for(let i=0;i<11;i++){const a=i*2.1,r=8+seeded(i+x)*14;c.fillStyle=cols[i%cols.length];c.beginPath();c.arc(x+Math.cos(a)*r*s,y-2*s+Math.sin(a)*7*s,4*s,0,Math.PI*2);c.fill()}
}
function drawLamp(c,x,y){
 c.save();c.strokeStyle='#12161c';c.lineWidth=10;c.beginPath();c.moveTo(x,y);c.lineTo(x,y-120);c.stroke();c.lineWidth=5;c.beginPath();c.moveTo(x-18,y-116);c.lineTo(x+18,y-116);c.stroke();
 const g=c.createRadialGradient(x,y-125,0,x,y-125,75);g.addColorStop(0,'#ffe8a9cc');g.addColorStop(.25,'#ffd36e55');g.addColorStop(1,'#ffd36e00');c.fillStyle=g;c.beginPath();c.arc(x,y-125,75,0,Math.PI*2);c.fill();
 c.fillStyle='#ffd77b';c.beginPath();c.arc(x,y-122,7,0,Math.PI*2);c.fill();c.restore();
}
function drawTree(c,x,y){
 c.save();c.strokeStyle='#493124';c.lineCap='round';c.lineWidth=38;c.beginPath();c.moveTo(x,y+95);c.lineTo(x+8,y-45);c.stroke();
 for(let i=0;i<5;i++){const a=-2.6+i*.62;c.lineWidth=16;c.beginPath();c.moveTo(x+4,y-5);c.lineTo(x+Math.cos(a)*115,y+Math.sin(a)*75-50);c.stroke()}
 const greens=['#173d29','#23593b','#2f6a47','#3b754e'];
 for(let i=0;i<28;i++){const a=seeded(i+51)*Math.PI*2,r=25+seeded(i+91)*120,rr=28+seeded(i+141)*34;c.fillStyle=greens[i%greens.length];c.beginPath();c.arc(x+Math.cos(a)*r,y-78+Math.sin(a)*r*.58,rr,0,Math.PI*2);c.fill()}
 c.restore();
}
function drawBench(c,x,y,rot=0){
 c.save();c.translate(x,y);c.rotate(rot);c.shadowColor='#0007';c.shadowBlur=8;c.shadowOffsetY=5;c.fillStyle='#70472f';rounded(c,-70,-14,140,24,5,'#70472f','#17151a',4);c.fillStyle='#4e3326';c.fillRect(-58,10,12,34);c.fillRect(46,10,12,34);c.restore();
}
function drawCar(c,x,y){
 c.save();c.translate(x,y);c.shadowColor='#0009';c.shadowBlur=14;c.shadowOffsetY=9;
 c.fillStyle='#214d66';c.strokeStyle='#101419';c.lineWidth=7;c.beginPath();c.roundRect(-104,-38,208,82,30);c.fill();c.stroke();
 c.fillStyle='#173441';c.beginPath();c.moveTo(-58,-38);c.lineTo(-24,-82);c.lineTo(45,-82);c.lineTo(76,-38);c.closePath();c.fill();c.stroke();
 c.strokeStyle='#9dc8d3';c.lineWidth=4;c.beginPath();c.moveTo(-43,-38);c.lineTo(-18,-67);c.lineTo(38,-67);c.lineTo(59,-38);c.stroke();
 for(const xx of [-65,68]){c.fillStyle='#101319';c.beginPath();c.arc(xx,43,26,0,Math.PI*2);c.fill();c.fillStyle='#919aa3';c.beginPath();c.arc(xx,43,11,0,Math.PI*2);c.fill()}
 c.restore();
}
function drawWorld(c){
 // base night
 const sky=c.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#15283b');sky.addColorStop(.53,'#1d3441');sky.addColorStop(1,'#111923');c.fillStyle=sky;c.fillRect(0,0,W,H);
 // distant silhouettes
 c.fillStyle='#0c1420';for(let i=0;i<18;i++){const x=i*100-20,h=70+seeded(i)*95;c.fillRect(x,105-h,95,h+80)}
 c.fillStyle='#e9f3e8';c.beginPath();c.arc(1265,82,38,0,Math.PI*2);c.fill();c.fillStyle='#15283b';c.beginPath();c.arc(1280,72,38,0,Math.PI*2);c.fill();

 // road and pavement
 const rd=c.createLinearGradient(0,480,0,900);rd.addColorStop(0,'#24333d');rd.addColorStop(1,'#101820');c.fillStyle=rd;c.fillRect(0,488,W,412);
 c.fillStyle='#876f5e';c.fillRect(0,450,W,52);c.fillStyle='#b59d82';c.fillRect(0,450,W,9);
 c.strokeStyle='#ffffff17';c.lineWidth=7;c.setLineDash([55,42]);c.beginPath();c.moveTo(0,642);c.bezierCurveTo(420,612,820,634,1600,612);c.stroke();c.setLineDash([]);
 // wet reflections
 for(let i=0;i<12;i++){const x=70+i*130+seeded(i)*40,y=680+seeded(i+20)*140;const g=c.createLinearGradient(x,y,x,y+85);g.addColorStop(0,'#ffd2702f');g.addColorStop(1,'#ffd27000');c.fillStyle=g;c.fillRect(x,y,12+seeded(i+40)*26,90)}

 // buildings
 building(c,28,115,420,332,'#4c2929','#a45cff','#efe9e4','4AM COFFEE',3);
 building(c,1080,78,485,372,'#4a2928','#c49a56','#e5ba66','TAP & VINE',3);
 building(c,1224,628,340,242,'#313942','#e8bfd0','#f4eef2','BEHBEH SHOP',2);
 building(c,676,685,332,184,'#193638','#d3a453','#efc86d','THE TURKISH',2);
 // cafe details
 rounded(c,70,388,137,58,7,'#17191f','#ebe2d8',3);text(c,'GOOD COFFEE',138,407,14,'#f0ece7','center');text(c,'BAD DECISIONS',138,432,14,'#ff4fa3','center');
 drawFlowerBasket(c,1115,112,.8);drawFlowerBasket(c,1502,112,.9);drawFlowerBasket(c,1192,420,.8);drawFlowerBasket(c,1446,419,.8);

 // park
 c.fillStyle='#1d4a31';c.beginPath();c.roundRect(470,145,610,335,80);c.fill();c.strokeStyle='#274b35';c.lineWidth=10;c.stroke();
 c.strokeStyle='#73916a44';c.lineWidth=6;c.beginPath();c.moveTo(520,225);c.quadraticCurveTo(765,165,1030,230);c.stroke();
 drawTree(c,785,315);drawBench(c,608,402,-.1);drawBench(c,960,403,.12);
 for(let i=0;i<60;i++){const x=490+seeded(i+5)*570,y=190+seeded(i+80)*260,r=2+seeded(i+160)*3;c.fillStyle=['#f5cf66','#f06c80','#dca9ff','#f0eee2'][i%4];c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill()}
 rounded(c,515,226,178,78,9,'#11141a','#e3bb5e',4);text(c,'KENDAL CALLING',604,253,20,'#efc766','center');text(c,'MUD · HATS · REGRET',604,282,12,'#efe9e3','center','Arial');
 text(c,'WEIRD FRIENDS GREEN',804,493,15,'#dce7d2','center','Georgia');

 // lamps / bunting / street texture
 drawLamp(c,495,540);drawLamp(c,1075,542);
 c.strokeStyle='#dec79699';c.lineWidth=2;c.beginPath();c.moveTo(458,120);c.quadraticCurveTo(785,176,1080,116);c.stroke();
 const bun=['#ff597b','#e9c45e','#69aaa6'];for(let i=0;i<8;i++){const x=520+i*68,y=138+Math.sin(i*.8)*8;c.fillStyle=bun[i%3];c.beginPath();c.moveTo(x,y);c.lineTo(x+18,y+28);c.lineTo(x+36,y+2);c.fill()}
 // small details
 drawCar(c,245,735);
 rounded(c,70,793,224,46,8,'#171a20','#efe8dc',2);text(c,'LEYLAND ROAD',182,816,22,'#ece6dc','center','Georgia');
 // bin + noticeboard
 rounded(c,850,352,46,70,6,'#161b20','#3b464b',3);c.fillStyle='#274938';c.fillRect(859,368,28,40);
 rounded(c,905,253,90,118,7,'#483b31','#241d1b',5);for(let i=0;i<3;i++){rounded(c,922,270+i*29,56,21,3,['#e7dbb5','#bcd7db','#e0a6a4'][i],null)}
 // tiny stars
 for(let i=0;i<38;i++){c.fillStyle='#ffffff'+(i%3===0?'88':'44');c.fillRect(seeded(i)*W,25+seeded(i+300)*120,1.5,1.5)}
}

function avatarRick(c,x,y,dirX,dirY,s=1,alpha=1){
 c.save();c.translate(x,y);c.globalAlpha=alpha;
 c.fillStyle='#0006';c.beginPath();c.ellipse(0,16*s,18*s,7*s,0,0,Math.PI*2);c.fill();
 // legs
 c.strokeStyle='#222b38';c.lineWidth=10*s;c.lineCap='round';c.beginPath();c.moveTo(-7*s,7*s);c.lineTo(-8*s,24*s);c.moveTo(7*s,7*s);c.lineTo(8*s,24*s);c.stroke();
 c.strokeStyle='#e0e6eb';c.lineWidth=5*s;c.beginPath();c.moveTo(-10*s,25*s);c.lineTo(-2*s,25*s);c.moveTo(4*s,25*s);c.lineTo(12*s,25*s);c.stroke();
 // torso
 c.fillStyle='#2e6d4f';c.strokeStyle='#11151a';c.lineWidth=3*s;c.beginPath();c.roundRect(-16*s,-20*s,32*s,32*s,9*s);c.fill();c.stroke();
 // arms
 c.strokeStyle='#dca17e';c.lineWidth=8*s;c.beginPath();c.moveTo(-15*s,-12*s);c.lineTo(-21*s,6*s);c.moveTo(15*s,-12*s);c.lineTo(21*s,6*s);c.stroke();
 // head/hair
 c.fillStyle='#dca17e';c.beginPath();c.arc(0,-34*s,15*s,0,Math.PI*2);c.fill();c.stroke();
 c.fillStyle='#35252b';c.beginPath();c.arc(-2*s,-39*s,14*s,Math.PI,Math.PI*2);c.lineTo(12*s,-37*s);c.quadraticCurveTo(7*s,-53*s,-8*s,-49*s);c.closePath();c.fill();
 // beard hint on side/bottom
 c.fillStyle='#3a2b2c';c.beginPath();c.arc(0,-30*s,11*s,.05*Math.PI,.95*Math.PI);c.fill();
 c.restore();
}
function avatarLaura(c,x,y,dirX,dirY,s=1,alpha=1){
 c.save();c.translate(x,y);c.globalAlpha=alpha;
 c.fillStyle='#0006';c.beginPath();c.ellipse(0,16*s,18*s,7*s,0,0,Math.PI*2);c.fill();
 c.strokeStyle='#17171d';c.lineWidth=10*s;c.lineCap='round';c.beginPath();c.moveTo(-7*s,7*s);c.lineTo(-8*s,24*s);c.moveTo(7*s,7*s);c.lineTo(8*s,24*s);c.stroke();
 c.strokeStyle='#15151a';c.lineWidth=6*s;c.beginPath();c.moveTo(-11*s,25*s);c.lineTo(-2*s,25*s);c.moveTo(4*s,25*s);c.lineTo(13*s,25*s);c.stroke();
 c.fillStyle='#17171d';c.strokeStyle='#11151a';c.lineWidth=3*s;c.beginPath();c.roundRect(-16*s,-20*s,32*s,32*s,9*s);c.fill();c.stroke();
 c.strokeStyle='#dca17e';c.lineWidth=8*s;c.beginPath();c.moveTo(-15*s,-12*s);c.lineTo(-21*s,6*s);c.moveTo(15*s,-12*s);c.lineTo(21*s,6*s);c.stroke();
 // tattoo sleeve
 c.strokeStyle='#5a91ad';c.lineWidth=2*s;for(let i=0;i<4;i++){c.beginPath();c.moveTo(-20*s,(-7+i*4)*s);c.lineTo(-15*s,(-4+i*4)*s);c.stroke()}
 // blonde hair
 c.fillStyle='#e8c36f';c.beginPath();c.arc(0,-33*s,18*s,0,Math.PI*2);c.fill();c.beginPath();c.moveTo(-16*s,-30*s);c.quadraticCurveTo(-22*s,-5*s,-10*s,1*s);c.lineTo(0,-11*s);c.lineTo(10*s,1*s);c.quadraticCurveTo(22*s,-5*s,16*s,-30*s);c.fill();
 // floral hat
 c.fillStyle='#eee7d9';c.strokeStyle='#11151a';c.lineWidth=2*s;c.beginPath();c.ellipse(0,-45*s,23*s,8*s,0,0,Math.PI*2);c.fill();c.stroke();c.beginPath();c.ellipse(0,-47*s,16*s,12*s,0,Math.PI,0);c.fill();c.stroke();
 const cols=['#ec547b','#efc64f','#6aa064'];for(let i=0;i<6;i++){c.fillStyle=cols[i%3];c.beginPath();c.arc((-10+i*4)*s,(-48+(i%2)*3)*s,3*s,0,Math.PI*2);c.fill()}
 c.restore();
}
function drawDog(c,x,y,s=1){
 c.save();c.translate(x,y);c.fillStyle='#0005';c.beginPath();c.ellipse(0,9*s,13*s,5*s,0,0,Math.PI*2);c.fill();
 c.fillStyle='#f4eee7';c.strokeStyle='#15151a';c.lineWidth=2*s;c.beginPath();c.ellipse(0,-3*s,14*s,12*s,0,0,Math.PI*2);c.fill();c.stroke();
 c.fillStyle='#9f542d';c.beginPath();c.ellipse(-7*s,-8*s,8*s,10*s,-.3,0,Math.PI*2);c.fill();c.beginPath();c.ellipse(8*s,-7*s,7*s,10*s,.3,0,Math.PI*2);c.fill();
 c.fillStyle='#201817';c.beginPath();c.arc(1*s,-5*s,2*s,0,Math.PI*2);c.fill();
 c.strokeStyle='#9f542d';c.lineWidth=4*s;c.beginPath();c.moveTo(12*s,0);c.quadraticCurveTo(22*s,-8*s,18*s,-17*s);c.stroke();c.restore();
}

function hotspotList(){
 const h=[
  {id:'car',x:245,y:735,r:95,label:'RICK’S CAR',act:carAct},
  {id:'coffee',x:245,y:474,r:95,label:'4AM COFFEE',act:()=>openCard('coffee')},
  {id:'shop',x:1390,y:610,r:105,label:'BEHBEH SHOP',act:()=>state.quest===Q.CAR?say('LAURA',['Car first. Then we can begin the rest of your administrative collapse.']):openCard('shop')},
  {id:'tap',x:1320,y:476,r:110,label:'TAP & VINE',act:()=>[Q.CAR,Q.MILK].includes(state.quest)?say('LAURA',['Milk first.','Rick: The Tap is basically hydration.','Laura: It really is not.']):openCard('tap')},
  {id:'turkish',x:842,y:664,r:110,label:'THE TURKISH',act:()=>[Q.TURKISH,Q.FATS,Q.DONE].includes(state.quest)?openCard('turkish'):say('RICK',['Food?','Laura: We are pretending to have a plan.','Rick: Food is a plan.'])},
  {id:'kendal',x:606,y:318,r:90,label:'KENDAL CALLING',act:()=>openCard('kendal')},
  {id:'bench',x:960,y:406,r:68,label:'SUSPICIOUS BENCH',act:()=>say(state.leader.toUpperCase(),state.leader==='rick'?['Sit down for a minute?','Laura: Every time you say “a minute” we lose forty-five minutes.']:['I am not sitting there.','Rick: Why?','Laura: Look at it. It knows what it did.'])}
 ];
 if(state.quest===Q.GLASSES_OUTSIDE||state.quest===Q.DENISE_RETURN){
  const gs=[{x:1180,y:515},{x:1410,y:535},{x:1510,y:475}];
  gs.forEach((g,i)=>{if(!state.flags.tapGlasses[i])h.push({id:'glass'+i,x:g.x,y:g.y,r:58,label:['ABANDONED PINT','WINE GLASS','ANOTHER BLOODY GLASS'][i],act:()=>collectGlass(i,g.x,g.y)})});
 }
 if(state.quest===Q.FATS&&!boss.active)h.push({id:'fats',x:790,y:365,r:95,label:'FATS',act:()=>say('FATS',['First pub: no roast.','Second pub: twenty-minute wait.','At that point society had failed.','Laura: You could have eaten literally anything else.','FATS: Don’t bring logic into this.'],startBoss)});
 return h;
}
function nearest(){let b=null,bd=1e9;for(const h of hotspotList()){const d=dist(player.x,player.y,h.x,h.y);if(d<h.r&&d<bd){b=h;bd=d}}return b}

function carAct(){
 if(state.quest===Q.CAR){state.flags.car=true;state.quest=Q.MILK;save();say(state.leader.toUpperCase(),state.leader==='rick'?['Found it.','Laura: The large blue car? Extraordinary detective work.']:['There. Your car.','Rick: I knew where it was.','Laura: Course you did.'],()=>burst(245,735,'#b7ff3e',22))}
 else say('RICK',['Yep. Still the car. Miraculous.']);
}
function collectGlass(i,x,y){
 state.flags.tapGlasses[i]=true;const n=state.flags.tapGlasses.filter(Boolean).length;
 burst(x,y,i===1?'#f5efe7':'#efc56b',16);toast(n+'/3 GLASSES CLEARED',700);
 if(n>=3)state.quest=Q.DENISE_RETURN;save();
}

function openCard(kind){
 cardOpen=true;resetStick();ui.card.classList.remove('hidden');renderScene(kind);
}
function closeCard(){cardOpen=false;ui.card.classList.add('hidden');ui.sceneChoices.innerHTML=''}
function choice(label,fn,primary=false){
 const b=document.createElement('button');b.textContent=label;if(primary)b.className='primary';b.addEventListener('pointerdown',e=>{e.preventDefault();fn()});ui.sceneChoices.appendChild(b)
}
function renderScene(kind){
 ui.sceneChoices.innerHTML='';
 const a=ui.sceneArt.getContext('2d');const cw=ui.sceneArt.width/dpr,ch=ui.sceneArt.height/dpr;a.setTransform(dpr,0,0,dpr,0,0);a.clearRect(0,0,cw,ch);
 if(kind==='shop')sceneShop(a,cw,ch);
 if(kind==='tap')sceneTap(a,cw,ch);
 if(kind==='coffee')sceneCoffee(a,cw,ch);
 if(kind==='kendal')sceneKendal(a,cw,ch);
 if(kind==='turkish')sceneTurkish(a,cw,ch);
}
function cardMeta(kicker,title,copy){ui.sceneKicker.textContent=kicker;ui.sceneTitle.textContent=title;ui.sceneText.textContent=copy}

function sceneShop(c,w,h){
 const g=c.createLinearGradient(0,0,w,h);g.addColorStop(0,'#17262c');g.addColorStop(1,'#493b2e');c.fillStyle=g;c.fillRect(0,0,w,h);
 // shelves
 for(let s=0;s<3;s++){const x=45+s*145;rounded(c,x,74,118,h-130,13,'#2d4950','#10141a',6);for(let y=120;y<h-75;y+=88){c.fillStyle='#d9e6e3';c.fillRect(x+14,y,90,55);for(let i=0;i<4;i++){c.fillStyle=['#eef5ef','#d4a63e','#c7625d','#5f9363'][(i+s)%4];c.fillRect(x+22+i*20,y+10,13,32)}}}
 // counter/shopkeeper silhouette
 rounded(c,w*.48,h*.54,w*.25,h*.31,14,'#8a5d3e','#151419',7);c.fillStyle='#d49a77';c.beginPath();c.arc(w*.60,h*.43,32,0,Math.PI*2);c.fill();c.fillStyle='#20242a';c.beginPath();c.arc(w*.60,h*.39,31,Math.PI,0);c.fill();c.fillStyle='#1c2024';c.fillRect(w*.565,h*.46,70,100);
 // warm light
 const lg=c.createRadialGradient(w*.52,h*.32,0,w*.52,h*.32,220);lg.addColorStop(0,'#ffd98a66');lg.addColorStop(1,'#ffd98a00');c.fillStyle=lg;c.fillRect(0,0,w,h);
 cardMeta('LEYLAND ROAD','BEHBEH SHOP','Milk, crisps, vapes, regrets. What do you need?');
 if(state.quest===Q.MILK)choice('Buy milk (£1.20)',()=>{state.flags.milk=true;state.quest=Q.WILL;save();closeCard();say(state.leader.toUpperCase(),state.leader==='rick'?['Milk acquired.','Laura: We bought one thing. Do not get emotional.']:['Milk.','Rick: Look at us. Functioning adults.','Laura: Do not push it.'])},true);
 else choice('Look suspiciously at the milk fridge',()=>say('LAURA',['We already have milk.','Rick: Worth checking.','Laura: No.']));
 choice('Read the targeted coffee sign',()=>say('LAURA',['“No, you do not need another coffee.”','Rick: That feels legally targeted.','Laura: It is.']));
 choice('Leave',closeCard);
}
function sceneCoffee(c,w,h){
 const g=c.createLinearGradient(0,0,w,h);g.addColorStop(0,'#32202b');g.addColorStop(.45,'#66412f');g.addColorStop(1,'#1b171d');c.fillStyle=g;c.fillRect(0,0,w,h);
 for(let i=0;i<5;i++){const x=40+i*100;rounded(c,x,60,78,180,7,'#2b2125','#111319',5);const wg=c.createLinearGradient(x,70,x,230);wg.addColorStop(0,'#ffd98a');wg.addColorStop(1,'#7f4d35');c.fillStyle=wg;c.fillRect(x+8,68,62,160)}
 c.fillStyle='#3d2a25';c.fillRect(0,h*.68,w*.62,h*.32);for(let i=0;i<5;i++){c.fillStyle='#d8b56d';c.beginPath();c.arc(70+i*95,h*.77,20,0,Math.PI*2);c.fill()}
 text(c,'4AM COFFEE',w*.32,46,34,'#b68cff','center');
 cardMeta('QUESTIONABLE CAFFEINE','4AM COFFEE','Technically open. Spiritually a terrible idea.');
 choice('Order a coffee anyway',()=>say(state.leader.toUpperCase(),state.leader==='rick'?['Coffee.','Laura: It is nearly 4am.','Rick: Exactly.']:['No.','Rick: I did not ask anything yet.','Laura: You were going to say coffee.']),true);
 choice('Leave before this becomes a medical event',closeCard);
}
function drawBust(c,x,y,type){
 c.save();c.translate(x,y);
 const skin='#dda27f';c.fillStyle='#0005';c.beginPath();c.ellipse(0,90,55,14,0,0,Math.PI*2);c.fill();
 if(type==='dad'){c.fillStyle='#1b1c20';rounded(c,-48,15,96,82,18,'#1b1c20','#111319',4);c.fillStyle=skin;c.beginPath();c.arc(0,-20,40,0,Math.PI*2);c.fill();c.fillStyle='#d0cac4';c.beginPath();c.arc(0,-24,40,Math.PI,0);c.fill();c.strokeStyle='#9b4147';c.lineWidth=6;c.beginPath();c.arc(-14,-20,13,0,Math.PI*2);c.arc(15,-20,13,0,Math.PI*2);c.moveTo(-1,-20);c.lineTo(2,-20);c.stroke();c.fillStyle='#d89b42';c.fillRect(43,30,25,48)}
 if(type==='will'){rounded(c,-38,12,76,90,15,'#24252b','#111319',4);c.fillStyle=skin;c.beginPath();c.arc(0,-24,36,0,Math.PI*2);c.fill();c.fillStyle='#38282b';c.beginPath();c.arc(0,-33,36,Math.PI,0);c.fill();c.fillRect(28,-26,18,75);c.strokeStyle='#333943';c.lineWidth=4;c.beginPath();c.arc(-12,-22,12,0,Math.PI*2);c.arc(14,-22,12,0,Math.PI*2);c.stroke()}
 if(type==='denise'){rounded(c,-44,12,88,90,17,'#4c3443','#111319',4);c.fillStyle=skin;c.beginPath();c.arc(0,-24,39,0,Math.PI*2);c.fill();c.fillStyle='#4a2e30';c.beginPath();c.arc(0,-31,40,Math.PI,0);c.fill();const cs=['#efbf4f','#ed527a','#6aa15e'];for(let i=0;i<9;i++){c.fillStyle=cs[i%3];c.beginPath();c.arc(-28+i*7,-58+(i%2)*5,6,0,Math.PI*2);c.fill()}}
 c.restore();
}
function sceneTap(c,w,h){
 const g=c.createLinearGradient(0,0,w,h);g.addColorStop(0,'#37231e');g.addColorStop(.55,'#6f432f');g.addColorStop(1,'#24191b');c.fillStyle=g;c.fillRect(0,0,w,h);
 // bar and shelves
 rounded(c,34,70,w*.62,h*.38,18,'#573629','#171419',7);c.fillStyle='#b87949';c.fillRect(25,h*.47,w*.69,32);
 for(let i=0;i<7;i++){c.fillStyle=['#c96951','#d7b34c','#5a8a67','#b65e84'][i%4];c.fillRect(70+i*62,105+(i%2)*24,30,72)}
 for(let i=0;i<5;i++){const x=85+i*92;c.strokeStyle='#1a1719';c.lineWidth=7;c.beginPath();c.moveTo(x,70);c.lineTo(x,170);c.stroke();c.fillStyle='#e0ad54';c.beginPath();c.arc(x,178,11,0,Math.PI*2);c.fill()}
 drawBust(c,w*.22,h*.69,'will');drawBust(c,w*.43,h*.70,'denise');drawBust(c,w*.62,h*.70,'dad');
 // Kendal photo wall
 rounded(c,w*.05,h*.55,w*.18,h*.18,9,'#15151c','#ff4fa3',3);text(c,'KENDAL',w*.14,h*.61,18,'#efc56b','center');text(c,'CALLING',w*.14,h*.66,18,'#efc56b','center');
 cardMeta('PENWORTHAM','TAP & VINE','Warm lights. Questionable philosophy. Dad already has a pint.');
 if(state.quest===Q.WILL)choice('Talk to Will about the glasses',()=>{say('WILL',["Yeah, I've got your glasses.","Rick: Why have you got my glasses?","Will: More importantly, why did you leave them in the Tap?","Laura: He's got you there.","Will: Find my Kendal wristband and we're even.","Rick: This feels like extortion.","Will: Hospitality."],()=>{state.flags.will=true;state.quest=Q.WRISTBAND;save();closeCard()})},true);
 else if(state.quest===Q.GLASSES&&state.flags.wristband)choice('Give Will the wristband',()=>{say('WILL',["That's the one.","Here. Your glasses.","Laura: An unnecessarily complicated transaction for an object he already owned.","Rick: I feel like I won.","Laura: You absolutely didn't."],()=>{state.flags.glasses=true;state.quest=Q.DENISE;save();closeCard();toast('GLASSES RECOVERED. SOMEHOW.',1300)})},true);
 else choice('Chat with Will',()=>say('WILL',["When you're in the Tap, you're a pub.","Rick: That's still not a sentence, Will.","Will: It doesn't need to be."]));

 if(state.quest===Q.DENISE)choice('Talk to Denise',()=>{say('DENISE',['Right. Before you two fuck off for food—','Laura: Here we go.','Denise: Three abandoned glasses outside. Clear them for me.','Rick: Is Will not literally working?',"Denise: Will's busy being a pub.",'Dad: I am a customer. Do not involve me.'],()=>{state.flags.denise=true;state.flags.tapGlasses=[false,false,false];state.quest=Q.GLASSES_OUTSIDE;save();closeCard()})},true);
 else if(state.quest===Q.DENISE_RETURN)choice('Return the empties to Denise',()=>{say('DENISE',['Look at that. Actual useful behaviour.','Rick: I am putting this on LinkedIn.','Laura: Please do not.','Denise: Tactical Sauvignon for Laura. Now go eat before FATS starts another incident.'],()=>{state.flags.wine=true;state.quest=Q.TURKISH;save();closeCard();toast('TACTICAL SAUVIGNON ACQUIRED',1300)})},true);
 else choice('Chat with Denise',()=>say('DENISE',['Kendal again next year then?','Laura: Obviously.','Denise: Good. Wasn’t asking.']));

 choice('Chat with Dad',()=>say('DAD',state.leader==='rick'?['You found the car then?','Rick: Eventually.','Dad: Christ. He can be taught.']:['You keeping him then?',"Laura: Trial period keeps getting extended.",'Dad: Brave.']));
 if([Q.WRISTBAND,Q.GLASSES].includes(state.quest))choice('Look at the Kendal wall',()=>{closeCard();openCard('kendal')});
 choice('Leave',closeCard);
}
function sceneKendal(c,w,h){
 const g=c.createLinearGradient(0,0,w,h);g.addColorStop(0,'#1b2c28');g.addColorStop(.55,'#2e4a32');g.addColorStop(1,'#514637');c.fillStyle=g;c.fillRect(0,0,w,h);
 for(let i=0;i<4;i++){const x=80+i*160;c.fillStyle=['#a75b82','#5a84a2','#c6a04d','#6e9b62'][i];c.beginPath();c.moveTo(x,h*.67);c.lineTo(x+85,h*.2);c.lineTo(x+170,h*.67);c.closePath();c.fill();c.strokeStyle='#111319';c.lineWidth=6;c.stroke()}
 // lights
 c.strokeStyle='#e8d1a3';c.lineWidth=2;c.beginPath();c.moveTo(20,100);c.quadraticCurveTo(w*.44,170,w*.75,110);c.stroke();for(let i=0;i<14;i++){const x=45+i*48,y=115+Math.sin(i*.7)*16;c.fillStyle=['#f0c65d','#ff4fa3','#68aaaa'][i%3];c.beginPath();c.arc(x,y,5,0,Math.PI*2);c.fill()}
 // fire jet
 const fg=c.createLinearGradient(w*.72,h*.7,w*.72,h*.18);fg.addColorStop(0,'#ff742e');fg.addColorStop(.45,'#ffcf56');fg.addColorStop(1,'#fff2b0aa');c.fillStyle=fg;c.beginPath();c.moveTo(w*.72,h*.72);c.quadraticCurveTo(w*.66,h*.45,w*.72,h*.16);c.quadraticCurveTo(w*.79,h*.48,w*.75,h*.72);c.fill();
 rounded(c,w*.34,35,w*.34,80,16,'#11141a','#efc56b',4);text(c,'KENDAL CALLING',w*.51,76,34,'#f3eee7','center');
 cardMeta('FLASHBACK, ALLEGEDLY','KENDAL CALLING','Mud, bucket hats, and a frankly unreliable chain of custody.');
 if(state.quest===Q.WRISTBAND&&!state.flags.wristband)choice("Pick up Will's wristband",()=>{state.flags.wristband=true;state.quest=Q.GLASSES;save();say('LAURA',["There. Will's wristband.","Rick: Why is it here?","Laura: Because apparently the entire town operates like a Zelda dungeon now.","Rick: Fair."],()=>{closeCard();toast("WILL'S WRISTBAND ACQUIRED",1300)})},true);
 else choice('Attempt to remember anything',()=>say('LAURA',['I remember this bit.','Rick: You absolutely do not.','Laura: Correct. That is why it was good.']));
 choice('Leave',closeCard);
}
function sceneTurkish(c,w,h){
 const g=c.createLinearGradient(0,0,w,h);g.addColorStop(0,'#17333a');g.addColorStop(.32,'#2f5558');g.addColorStop(.33,'#5d3928');g.addColorStop(1,'#241817');c.fillStyle=g;c.fillRect(0,0,w,h);
 // lanterns
 for(let i=0;i<7;i++){const x=60+i*85;c.strokeStyle='#d2a650';c.lineWidth=3;c.beginPath();c.moveTo(x,0);c.lineTo(x,70+(i%3)*14);c.stroke();c.fillStyle=['#ec6d47','#e9b447','#67a5a5'][i%3];c.beginPath();c.ellipse(x,85+(i%3)*14,18,28,0,0,Math.PI*2);c.fill()}
 // feast table
 c.fillStyle='#744a32';c.beginPath();c.ellipse(w*.36,h*.66,w*.31,h*.18,0,0,Math.PI*2);c.fill();c.strokeStyle='#111319';c.lineWidth=7;c.stroke();
 for(let i=0;i<8;i++){const a=i/8*Math.PI*2,x=w*.36+Math.cos(a)*145,y=h*.66+Math.sin(a)*55;c.fillStyle='#e8dfce';c.beginPath();c.ellipse(x,y,45,20,0,0,Math.PI*2);c.fill();c.fillStyle=['#bd5f43','#6f934f','#dda34e'][i%3];c.beginPath();c.arc(x,y,11,0,Math.PI*2);c.fill()}
 rounded(c,50,40,370,80,14,'#11141a','#d6ab58',4);text(c,'THE TURKISH',235,81,38,'#efd08b','center','Georgia');
 cardMeta('DINNER','THE TURKISH','You ordered for two. The kitchen has interpreted this as a threat.');
 if(state.quest===Q.TURKISH&&!state.flags.turkish)choice('Accept the accidental banquet',()=>{state.flags.turkish=true;state.quest=Q.FATS;save();say(state.leader.toUpperCase(),state.leader==='rick'?['We ordered two mains.',"Laura: There's enough lamb here to destabilise a small economy.",'Rick: Leftovers?','Laura: Behave.']:["I said we'd order sensibly.",'Rick: We have.','Laura: There are six plates of bread alone.'],()=>{closeCard();setTimeout(()=>say('PHONE — FATS',['First pub. No roast.','Second pub. Twenty-minute wait.','Rick: Oh no.','Laura: He is going to make this everyone else’s problem.']),150)})},true);
 else choice('Stare at the remaining food in defeat',()=>say('LAURA',['I physically cannot eat another thing.','Rick: Give it seven minutes.']));
 choice('Leave',closeCard);
}

function burst(x,y,color,count=16){
 for(let i=0;i<count;i++){const a=Math.random()*Math.PI*2,s=35+Math.random()*85;particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:.45+Math.random()*.45,max:.9,color,size:2+Math.random()*4})}
}
function startBoss(){
 boss.active=true;boss.hp=boss.max;boss.x=790;boss.y=365;boss.vulnerable='rick';boss.swap=4;boss.fire=1;state.flags.boss=true;save();toast('SUNDAY ROAST INCIDENT RESPONSE',1400)
}
function hitBoss(dmg,hero){
 if(!boss.active)return;
 if(hero!==boss.vulnerable){toast(hero==='rick'?'HE IS ABSORBING THE BULLSHIT — SWAP':'CALLING BS IS BOUNCING OFF HIM — SWAP',700);return}
 boss.hp=Math.max(0,boss.hp-dmg);boss.flash=.14;burst(boss.x,boss.y,hero==='rick'?'#b7ff3e':'#ff4fa3',13);
 if(boss.hp<=0){boss.active=false;state.quest=Q.DONE;save();say('FATS',['Laura: Was all that genuinely about a roast?',"Rick: Don't.",'FATS: It was about respect.'],()=>toast('ACHIEVEMENT: SILLY BULLSHIT BITCH',2200))}
}
function ability(){
 if(dialogue||cardOpen)return;
 if(boss.active){
  if(state.leader==='rick'){
   const m=Math.hypot(player.dirX,player.dirY)||1,dx=player.dirX/m||1,dy=player.dirY/m;
   heroShots.push({x:player.x,y:player.y-20,vx:dx*440,vy:dy*440,life:1.2,text:Math.random()<.5?'YEAH BUT—':'ACTUALLY'});
  }else{
   const r=state.flags.wine?205:175;burst(player.x,player.y,'#ff4fa3',25);if(dist(player.x,player.y,boss.x,boss.y)<r)hitBoss(state.flags.wine?4.3:3.5,'laura');enemyShots=enemyShots.filter(s=>dist(s.x,s.y,player.x,player.y)>r);
  }
  return;
 }
 const n=nearest();
 if(n?.id==='bench')say(state.leader.toUpperCase(),state.leader==='rick'?['I could sell this bench a consultancy package.']:['Bullshit bench.']);
 else if(n?.id==='coffee')say(state.leader.toUpperCase(),state.leader==='rick'?['I could absolutely drink another one.','Laura: You are one coffee away from seeing through time.']:['Bullshit.','Rick: What?','Laura: The entire concept of another coffee.']);
 else say(state.leader.toUpperCase(),state.leader==='rick'?['I can bullshit my way through something here.','There is currently fuck all to bullshit.']:['Bullshit.','Rick: On what?','Laura: Vibes.']);
}

function drawPickupGlass(c,x,y,type,i){
 const p=worldToScreen(x,y);const t=performance.now()/1000,bob=Math.sin(t*2.5+i)*3*scale;c.save();c.translate(p.x,p.y+bob);c.shadowColor=type==='wine'?'#fff':'#efc56b';c.shadowBlur=14*scale;c.strokeStyle='#f5efe7';c.lineWidth=3*scale;c.fillStyle=type==='wine'?'#ffffff25':'#d78e3b99';
 if(type==='wine'){c.beginPath();c.ellipse(0,-13*scale,10*scale,15*scale,0,0,Math.PI*2);c.fill();c.stroke();c.beginPath();c.moveTo(0,2*scale);c.lineTo(0,20*scale);c.moveTo(-8*scale,20*scale);c.lineTo(8*scale,20*scale);c.stroke()}else{c.beginPath();c.roundRect(-10*scale,-22*scale,20*scale,36*scale,4*scale);c.fill();c.stroke()}c.restore();
}
function drawBoss(c){
 if(!boss.active)return;
 const p=worldToScreen(boss.x,boss.y),s=scale; c.save();c.translate(p.x,p.y);
 c.fillStyle='#0007';c.beginPath();c.ellipse(0,15*s,26*s,9*s,0,0,Math.PI*2);c.fill();
 c.fillStyle='#15171c';c.strokeStyle='#0c0e12';c.lineWidth=3*s;c.beginPath();c.roundRect(-19*s,-25*s,38*s,42*s,9*s);c.fill();c.stroke();
 c.strokeStyle='#d29a79';c.lineWidth=8*s;c.beginPath();c.moveTo(-17*s,-14*s);c.lineTo(-26*s,8*s);c.moveTo(17*s,-14*s);c.lineTo(26*s,8*s);c.stroke();
 c.fillStyle='#d29a79';c.beginPath();c.arc(0,-39*s,17*s,0,Math.PI*2);c.fill();c.stroke();
 c.fillStyle='#202026';c.beginPath();c.arc(0,-45*s,17*s,Math.PI,0);c.fill();
 c.strokeStyle='#7e374b';c.lineWidth=3*s;c.beginPath();c.arc(0,-34*s,8*s,.2*Math.PI,.8*Math.PI);c.stroke();
 c.strokeStyle=boss.vulnerable==='rick'?'#b7ff3e':'#ff4fa3';c.lineWidth=5*s;c.beginPath();c.ellipse(0,16*s,34*s,14*s,0,0,Math.PI*2);c.stroke();c.restore();
 // boss bar
 const bw=Math.min(380,innerWidth*.42),x=innerWidth/2-bw/2,y=61;ctx.fillStyle='#090c14ec';ctx.fillRect(x-5,y-5,bw+10,28);ctx.strokeStyle='#ff6874';ctx.lineWidth=2;ctx.strokeRect(x-5,y-5,bw+10,28);ctx.fillStyle=boss.vulnerable==='rick'?'#b7ff3e':'#ff4fa3';ctx.fillRect(x,y,bw*(boss.hp/boss.max),18);ctx.fillStyle='#f4efe7';ctx.font='900 14px Impact';ctx.textAlign='center';ctx.fillText(boss.vulnerable==='rick'?'FATS — VULNERABLE TO BULLSHIT':'FATS — VULNERABLE TO CALLING BS',innerWidth/2,y-9);
}
function drawProjectiles(c){
 for(const s of heroShots){const p=worldToScreen(s.x,s.y);c.font=`900 ${18*scale}px Impact`;c.textAlign='center';c.lineWidth=3;c.strokeStyle='#10140b';c.fillStyle='#b7ff3e';c.strokeText(s.text,p.x,p.y);c.fillText(s.text,p.x,p.y)}
 for(const s of enemyShots){const p=worldToScreen(s.x,s.y);c.fillStyle='#d8ab70';c.strokeStyle='#78452f';c.lineWidth=3*scale;c.beginPath();c.arc(p.x,p.y,11*scale,0,Math.PI*2);c.fill();c.stroke()}
}
function drawParticles(c){
 for(const p0 of particles){const p=worldToScreen(p0.x,p0.y);c.globalAlpha=clamp(p0.life/p0.max,0,1);c.fillStyle=p0.color;c.beginPath();c.arc(p.x,p.y,p0.size*scale,0,Math.PI*2);c.fill();c.globalAlpha=1}
}
function drawWorldScene(){
 ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,innerWidth,innerHeight);
 ctx.save();ctx.scale(scale,scale);ctx.translate(0,-camY);drawWorld(ctx);ctx.restore();
 // pickups
 if([Q.GLASSES_OUTSIDE,Q.DENISE_RETURN].includes(state.quest)){
  const gs=[{x:1180,y:515,t:'pint'},{x:1410,y:535,t:'wine'},{x:1510,y:475,t:'pint'}];gs.forEach((g,i)=>{if(!state.flags.tapGlasses[i])drawPickupGlass(ctx,g.x,g.y,g.t,i)})
 }
 drawBoss(ctx);drawProjectiles(ctx);drawParticles(ctx);
 // party, both always visible
 const lp=worldToScreen(player.x,player.y),fp=worldToScreen(follower.x,follower.y),dp=worldToScreen(dog.x,dog.y);const bob=Math.sin(player.walk*Math.PI)*2.5;
 if(state.leader==='rick'){avatarLaura(ctx,fp.x,fp.y,0,1,scale*.86,.9);avatarRick(ctx,lp.x,lp.y+bob*scale,player.dirX,player.dirY,scale,1)}
 else{avatarRick(ctx,fp.x,fp.y,0,1,scale*.86,.9);avatarLaura(ctx,lp.x,lp.y+bob*scale,player.dirX,player.dirY,scale,1)}
 drawDog(ctx,dp.x,dp.y,scale*.75);
}

function update(dt){
 if(dialogue||cardOpen){player.vx*=.75;player.vy*=.75;return}
 let mx=input.x,my=input.y;if(Math.hypot(mx,my)<.1){mx=0;my=0}
 const m=Math.hypot(mx,my);if(m>1){mx/=m;my/=m}
 const speed=230,blend=1-Math.exp(-(mx||my?10.5:13)*dt);player.vx=lerp(player.vx,mx*speed,blend);player.vy=lerp(player.vy,my*speed,blend);
 if(Math.abs(player.vx)+Math.abs(player.vy)<1.5)player.vx=player.vy=0;
 const nx=clamp(player.x+player.vx*dt,40,W-40),ny=clamp(player.y+player.vy*dt,185,H-38);
 const blocks=[
  {x:18,y:100,w:440,h:350},
  {x:1070,y:70,w:505,h:380},
  {x:1215,y:620,w:360,h:260},
  {x:665,y:678,w:355,h:205}
 ];
 const blocked=(x,y)=>blocks.some(b=>x>b.x-22&&x<b.x+b.w+22&&y>b.y-22&&y<b.y+b.h+22);
 if(!blocked(nx,player.y))player.x=nx;
 if(!blocked(player.x,ny))player.y=ny;
 if(mx||my){player.dirX=mx;player.dirY=my;player.walk+=dt*7}else player.walk=0;
 // follower and dog spring
 const trailX=player.x-player.dirX*38-24,trailY=player.y-player.dirY*38+8;follower.x=lerp(follower.x,trailX,1-Math.exp(-5*dt));follower.y=lerp(follower.y,trailY,1-Math.exp(-5*dt));
 const dogX=follower.x-34,dogY=follower.y+28;dog.x=lerp(dog.x,dogX,1-Math.exp(-4*dt));dog.y=lerp(dog.y,dogY,1-Math.exp(-4*dt));dog.wag+=dt*8;
 // particles
 particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=Math.pow(.08,dt);p.vy*=Math.pow(.08,dt);p.life-=dt});particles=particles.filter(p=>p.life>0);
 heroShots.forEach(s=>{s.x+=s.vx*dt;s.y+=s.vy*dt;s.life-=dt;if(boss.active&&dist(s.x,s.y,boss.x,boss.y)<42&&!s.hit){s.hit=true;hitBoss(2.4,'rick')}});heroShots=heroShots.filter(s=>s.life>0&&!s.hit);
 enemyShots.forEach(s=>{s.x+=s.vx*dt;s.y+=s.vy*dt;s.life-=dt;if(dist(s.x,s.y,player.x,player.y)<28&&!s.hit){s.hit=true;state.hp=Math.max(0,state.hp-1);toast('OW',350);if(state.hp<=0){state.hp=6;boss.active=false;state.quest=Q.FATS;save();say('FATS',['Beaten by a roast dispute. Grim.'])}}});enemyShots=enemyShots.filter(s=>s.life>0&&!s.hit);
 if(boss.active){
  const dx=player.x-boss.x,dy=player.y-boss.y,d=Math.hypot(dx,dy)||1;if(d>120){boss.x+=dx/d*55*dt;boss.y+=dy/d*55*dt}
  boss.swap-=dt;if(boss.swap<=0){boss.swap=4;boss.vulnerable=boss.vulnerable==='rick'?'laura':'rick';toast(boss.vulnerable==='rick'?'FATS CAN NOW BE BULLSHITTED':'CALL HIM ON HIS SHIT',800)}
  boss.fire-=dt;if(boss.fire<=0){boss.fire=boss.hp<17?.7:1.05;const a=Math.atan2(player.y-boss.y,player.x-boss.x),n=boss.hp<17?3:1;for(let i=0;i<n;i++){const aa=a+(i-(n-1)/2)*.26;enemyShots.push({x:boss.x,y:boss.y,vx:Math.cos(aa)*225,vy:Math.sin(aa)*225,life:3})}}
 }
 fitCamera();
 const n=nearest();if(n&&!boss.active){ui.prompt.textContent='ACT · '+n.label;ui.prompt.classList.remove('hidden')}else ui.prompt.classList.add('hidden');
 saveFrameOnly();
}
let saveClock=0;function saveFrameOnly(){saveClock++;if(saveClock%180===0)save()}
function loop(t){const dt=Math.min(.034,Math.max(.001,(t-last)/1000));last=t;update(dt);drawWorldScene();requestAnimationFrame(loop)}

function doAct(){if(advanceDialogue())return;if(cardOpen||boss.active)return;nearest()?.act?.()}
function doSwap(){if(dialogue||cardOpen)return;state.leader=state.leader==='rick'?'laura':'rick';refreshUI();toast(state.leader==='rick'?'RICK IN':'LAURA IN',450);save()}
ui.act.addEventListener('pointerdown',e=>{e.preventDefault();doAct()});ui.swap.addEventListener('pointerdown',e=>{e.preventDefault();doSwap()});ui.ability.addEventListener('pointerdown',e=>{e.preventDefault();ability()});

const MAX=44;
function resetStick(){stickPointer=null;input.x=input.y=0;ui.stick.classList.add('hidden');ui.knob.style.transform='translate(-50%,-50%)';ui.moveHint.style.opacity='.56'}
window.addEventListener('pointerdown',e=>{if(dialogue||cardOpen||stickPointer!==null||e.target.closest?.('button')||e.clientX>innerWidth*.48)return;stickPointer=e.pointerId;stickOrigin={x:e.clientX,y:e.clientY};ui.stick.style.left=e.clientX+'px';ui.stick.style.top=e.clientY+'px';ui.stick.classList.remove('hidden');ui.moveHint.style.opacity='.18'},{passive:false});
window.addEventListener('pointermove',e=>{if(e.pointerId!==stickPointer)return;let dx=e.clientX-stickOrigin.x,dy=e.clientY-stickOrigin.y,d=Math.hypot(dx,dy);if(d>MAX){dx=dx/d*MAX;dy=dy/d*MAX}input.x=dx/MAX;input.y=dy/MAX;ui.knob.style.transform=`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px))`},{passive:false});
const end=e=>{if(e.pointerId===stickPointer)resetStick()};window.addEventListener('pointerup',end,{passive:false});window.addEventListener('pointercancel',end,{passive:false});
['gesturestart','gesturechange','gestureend','dblclick'].forEach(n=>document.addEventListener(n,e=>e.preventDefault(),{passive:false}));document.addEventListener('touchmove',e=>{if(e.touches?.length>1)e.preventDefault()},{passive:false});
window.addEventListener('resize',resize);

resize();refreshUI();save();requestAnimationFrame(loop);
})();