PAD2.dialogue.init();

(function lockIOSGestures(){
  const stop=e=>e.preventDefault();
  document.addEventListener('gesturestart',stop,{passive:false});
  document.addEventListener('gesturechange',stop,{passive:false});
  document.addEventListener('gestureend',stop,{passive:false});
  document.addEventListener('dblclick',stop,{passive:false});
  document.addEventListener('touchmove',e=>{if(e.touches&&e.touches.length>1)e.preventDefault()},{passive:false});
})();

PAD2.controls={
  pointer:null,
  origin:{x:0,y:0},
  max:48,
  resetStick(){
    PAD2.runtime.input.x=0;PAD2.runtime.input.y=0;
    const base=document.getElementById('joy-base');
    const knob=document.getElementById('joy-knob');
    base.classList.add('hidden');
    knob.style.transform='translate(-50%,-50%)';
  }
};

const zone=document.getElementById('joy-zone');
const base=document.getElementById('joy-base');
const knob=document.getElementById('joy-knob');

function clampOrigin(x,y){
  const r=zone.getBoundingClientRect();
  const pad=74;
  return{
    x:Math.max(r.left+pad,Math.min(r.right-pad,x)),
    y:Math.max(r.top+pad,Math.min(r.bottom-pad,y))
  };
}
function joyMove(e){
  if(PAD2.runtime.pausedForDialogue)return PAD2.controls.resetStick();
  const o=PAD2.controls.origin;
  let dx=e.clientX-o.x,dy=e.clientY-o.y;
  const d=Math.hypot(dx,dy),max=PAD2.controls.max;
  if(d>max){dx=dx/d*max;dy=dy/d*max}
  PAD2.runtime.input.x=dx/max;PAD2.runtime.input.y=dy/max;
  knob.style.transform=`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px))`;
}
zone.addEventListener('pointerdown',e=>{
  if(PAD2.runtime.pausedForDialogue)return;
  PAD2.controls.pointer=e.pointerId;
  zone.setPointerCapture(e.pointerId);
  PAD2.controls.origin=clampOrigin(e.clientX,e.clientY);
  base.style.left=(PAD2.controls.origin.x-zone.getBoundingClientRect().left)+'px';
  base.style.top=(PAD2.controls.origin.y-zone.getBoundingClientRect().top)+'px';
  base.classList.remove('hidden');
  joyMove(e);
});
zone.addEventListener('pointermove',e=>{if(e.pointerId===PAD2.controls.pointer)joyMove(e)});
zone.addEventListener('pointerup',()=>PAD2.controls.resetStick());
zone.addEventListener('pointercancel',()=>PAD2.controls.resetStick());

document.getElementById('act').addEventListener('pointerdown',e=>{
  e.preventDefault();
  if(PAD2.dialogue.advance())return;
  PAD2.runtime.activeScene?.act?.();
});
document.getElementById('swap').addEventListener('pointerdown',e=>{
  e.preventDefault();
  if(PAD2.runtime.pausedForDialogue)return;
  PAD2.runtime.activeScene?.swap?.();
});
document.getElementById('ability').addEventListener('pointerdown',e=>{
  e.preventDefault();
  if(PAD2.runtime.pausedForDialogue)return;
  PAD2.runtime.activeScene?.ability?.();
});

const phaser=new Phaser.Game({
  type:Phaser.AUTO,
  parent:'game',
  backgroundColor:'#17251e',
  scale:{mode:Phaser.Scale.RESIZE,width:innerWidth,height:innerHeight},
  physics:{default:'arcade',arcade:{gravity:{x:0,y:0},debug:false}},
  render:{antialias:true,roundPixels:true},
  scene:[PAD2.BootScene,PAD2.TestRoomScene,PAD2.UIScene]
});

document.body.dataset.v2Ready='true';
