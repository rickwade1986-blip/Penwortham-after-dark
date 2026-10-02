PAD2.dialogue={
  el:null,nameEl:null,lineEl:null,portraitEl:null,
  queue:[],index:0,onDone:null,
  init(){
    this.el=document.getElementById('dialogue');
    this.nameEl=document.getElementById('dialogue-name');
    this.lineEl=document.getElementById('dialogue-line');
    this.portraitEl=document.getElementById('dialogue-portrait');
  },
  open(name,lines,onDone){
    this.queue=[...lines];this.index=0;this.onDone=onDone||null;
    this.nameEl.textContent=name||'';
    this.lineEl.textContent=this.queue[0]||'';
    this.el.classList.remove('hidden');
    PAD2.runtime.pausedForDialogue=true;
    PAD2.runtime.input.x=0;PAD2.runtime.input.y=0;
    PAD2.controls?.resetStick();
  },
  advance(){
    if(!PAD2.runtime.pausedForDialogue)return false;
    this.index++;
    if(this.index>=this.queue.length){
      this.close();return true;
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
  }
};
