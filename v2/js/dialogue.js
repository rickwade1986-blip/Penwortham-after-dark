PAD2.dialogue={
  el:null,nameEl:null,lineEl:null,portraitEl:null,
  queue:[],index:0,onDone:null,

  init(){
    this.el=document.getElementById('dialogue');
    this.nameEl=document.getElementById('dialogue-name');
    this.lineEl=document.getElementById('dialogue-line');
    this.portraitEl=document.getElementById('dialogue-portrait');
  },

  portraitFor(name){
    const n=(name||'').toUpperCase();
    if(n.includes('RICK'))return './assets/characters/rick-down-0.png';
    if(n.includes('LAURA'))return './assets/characters/laura-down-0.png';
    if(n==='DAD')return './assets/characters/dad.png';
    if(n==='WILL')return './assets/characters/will.png';
    if(n==='DENISE')return './assets/characters/denise.png';
    if(n.includes('FATS'))return './assets/characters/fats.png';
    if(n.includes('3000'))return './assets/characters/andrew.png';
    return '';
  },

  setPortrait(name){
    const src=this.portraitFor(name);
    this.portraitEl.innerHTML='';
    if(src){
      const img=document.createElement('img');
      img.src=src;img.alt='';
      this.portraitEl.appendChild(img);
    }else{
      const span=document.createElement('span');
      span.textContent=(name||'?').split(/\s+/).map(x=>x[0]).join('').slice(0,3);
      this.portraitEl.appendChild(span);
    }
  },

  open(name,lines,onDone){
    this.queue=[...lines];
    this.index=0;
    this.onDone=onDone||null;
    this.nameEl.textContent=name||'';
    this.lineEl.textContent=this.queue[0]||'';
    this.setPortrait(name);
    this.el.classList.remove('hidden');
    PAD2.runtime.pausedForDialogue=true;
    PAD2.runtime.input.x=0;
    PAD2.runtime.input.y=0;
    PAD2.controls?.resetStick();
  },

  advance(){
    if(!PAD2.runtime.pausedForDialogue)return false;
    this.index++;
    if(this.index>=this.queue.length){
      this.close();
      return true;
    }
    this.lineEl.textContent=this.queue[this.index];
    return true;
  },

  close(){
    const done=this.onDone;
    this.queue=[];this.index=0;this.onDone=null;
    this.el.classList.add('hidden');
    PAD2.runtime.pausedForDialogue=false;
    if(done)done();
    PAD2.ui.refresh();
  }
};