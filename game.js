(() => {
  const WORLD=window.PAD_WORLD;
  const ART=window.PAD_ART;
  const STORAGE='penwortham-after-dark-save-v3';

  const ui={
    objective:document.querySelector('#objective strong'),
    hero:document.querySelector('#hero-name'),
    hearts:document.querySelector('#hearts'),
    buff:document.querySelector('#buff'),
    dialogue:document.querySelector('#dialogue'),
    speaker:document.querySelector('#speaker'),
    line:document.querySelector('#line'),
    portrait:document.querySelector('#portrait'),
    toast:document.querySelector('#toast'),
    joystick:document.querySelector('#joystick'),
    knob:document.querySelector('.joy-knob'),
    act:document.querySelector('#act'),
    attack:document.querySelector('#attack'),
    swap:document.querySelector('#swap')
  };

  const input={x:0,y:0};
  let activeScene=null;
  let dialogue=null;
  let toastTimer=null;

  const portraits={
    RICK:'./assets/characters/rick/portrait.png',
    LAURA:'./assets/characters/laura/portrait.png',
    FATS:'./assets/characters/fats/portrait.png',
    DAD:'./assets/characters/dad/portrait.png'
  };

  function defaultState(){
    return {
      hero:'rick',quest:0,hp:6,maxHp:6,score:0,
      items:{car:false,glasses:false,milk:false,wine:false,beat:false},
      seen:{},area:WORLD.startArea,sauvTimer:0,beatPower:false,
      firstBoot:true,won:false
    };
  }
  function loadState(){
    try{
      const raw=JSON.parse(localStorage.getItem(STORAGE)||'null');
      if(!raw)return defaultState();
      return {...defaultState(),...raw,items:{...defaultState().items,...(raw.items||{})},seen:{...(raw.seen||{})}};
    }catch{return defaultState()}
  }
  const state=loadState();

  function save(){try{localStorage.setItem(STORAGE,JSON.stringify(state))}catch{}}

  function setObjective(){
    if(state.won){ui.objective.textContent='Go somewhere unnecessarily expensive for a water.';return}
    const q=WORLD.quests[Math.min(state.quest,WORLD.quests.length-1)];
    ui.objective.textContent=q?q.label:'Cause avoidable chaos.';
  }
  function setStatus(){
    ui.hero.textContent=state.hero.toUpperCase();
    ui.hero.style.color=state.hero==='rick'?'#b6ff3b':'#ff4fa3';
    ui.hearts.textContent='♥'.repeat(Math.max(0,state.hp))+'♡'.repeat(Math.max(0,state.maxHp-state.hp));
    const bits=[];
    if(state.sauvTimer>0)bits.push('SAUVIGNON MODE');
    if(state.beatPower)bits.push('DUSTY BEAT');
    if(state.items.milk)bits.push('MILK ✓');
    ui.buff.textContent=bits.join(' · ');
    ui.attack.textContent=state.hero==='rick'?'BARS':'RIFF';
  }
  function showToast(text,ms=1000){
    ui.toast.textContent=text;ui.toast.classList.remove('hidden');
    clearTimeout(toastTimer);toastTimer=setTimeout(()=>ui.toast.classList.add('hidden'),ms);
  }
  function setPortrait(speaker){
    const key=(speaker||'').toUpperCase();
    const src=portraits[key];
    if(!ui.portrait)return;
    ui.portrait.innerHTML='';
    if(src){
      const img=document.createElement('img');img.src=src;img.alt='';ui.portrait.appendChild(img);
    }else{
      const initials=document.createElement('span');
      initials.textContent=(speaker||'?').split(/\s+/).map(x=>x[0]).join('').slice(0,3).toUpperCase();
      ui.portrait.appendChild(initials);
    }
  }
  function openDialogue(speaker,lines,onDone){
    dialogue={speaker,lines:[...lines],index:0,onDone};
    ui.speaker.textContent=speaker||'';
    ui.line.textContent=dialogue.lines[0]||'';
    setPortrait(speaker);
    ui.dialogue.classList.remove('hidden');
    input.x=input.y=0;
    ui.knob.style.transform='translate(-50%,-50%)';
  }
  function nextDialogue(){
    if(!dialogue)return false;
    dialogue.index++;
    if(dialogue.index>=dialogue.lines.length){
      const done=dialogue.onDone;dialogue=null;ui.dialogue.classList.add('hidden');if(done)done();
    }else ui.line.textContent=dialogue.lines[dialogue.index];
    return true;
  }

  function setupJoystick(){
    const zone=ui.joystick;let pointer=null;
    const stop=()=>{
      pointer=null;input.x=input.y=0;ui.knob.style.transform='translate(-50%,-50%)';
    };
    function move(e){
      if(dialogue)return stop();
      const r=zone.getBoundingClientRect();
      const cx=r.left+r.width*.44,cy=r.top+r.height*.55,max=Math.min(r.width,r.height)*.28;
      let dx=e.clientX-cx,dy=e.clientY-cy;const d=Math.hypot(dx,dy);
      if(d>max){dx=dx/d*max;dy=dy/d*max}
      input.x=dx/max;input.y=dy/max;
      ui.knob.style.transform=`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px))`;
    }
    zone.addEventListener('pointerdown',e=>{pointer=e.pointerId;zone.setPointerCapture(e.pointerId);move(e)});
    zone.addEventListener('pointermove',e=>{if(e.pointerId===pointer)move(e)});
    zone.addEventListener('pointerup',stop);zone.addEventListener('pointercancel',stop);
    ui.act.addEventListener('pointerdown',e=>{e.preventDefault();if(nextDialogue())return;activeScene?.act()});
    ui.attack.addEventListener('pointerdown',e=>{e.preventDefault();if(dialogue)return;activeScene?.attack()});
    ui.swap.addEventListener('pointerdown',e=>{e.preventDefault();if(dialogue)return;activeScene?.swap()});
  }
  setupJoystick();

  if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));

  class MainScene extends Phaser.Scene{
    constructor(){super('main')}

    init(data){
      this.areaName=data.area||state.area||WORLD.startArea;
      this.spawn=data.spawn||null;
      this.area=WORLD.areas[this.areaName];
      this.interactables=[];
      this.npcs=[];
      this.decor=[];
      this.attackLock=0;
      this.hurtLock=0;
      this.direction='down';
      this.stepFrame=0;
      this.stepClock=0;
      this.boss=null;
      this.bossActive=false;
      this.bossHp=30;
      this.bossMax=30;
      this.bossPhase=1;
      this.bossCooldown=1;
      this.bossBar=null;
      state.area=this.areaName;save();
    }

    preload(){
      const chars=['rick','laura','fats','dad'];
      const frames=['down0','down1','up0','up1','right0','right1','attack0','attack1'];
      for(const c of chars)for(const f of frames)this.load.image(`${c}-${f}`,`./assets/characters/${c}/${f}.png`);
    }

    create(){
      activeScene=this;
      ART.install(this);
      this.physics.world.setBounds(0,0,this.area.size[0],this.area.size[1]);
      this.cameras.main.setBounds(0,0,this.area.size[0],this.area.size[1]);
      this.cameras.main.setBackgroundColor(this.area.kind==='outdoor'?'#16251d':'#17131d');

      this.createFloor();
      this.createArea();

      const spawn=this.spawn||this.area.spawn;
      this.player=this.physics.add.sprite(spawn.x,spawn.y,'rick-down0').setDepth(50);
      this.configurePersonBody(this.player,state.hero);
      this.refreshPlayerTexture();

      this.cameras.main.startFollow(this.player,true,.12,.12);
      this.cameras.main.setZoom(this.area.kind==='outdoor'?1.13:1.28);
      this.createCollisions();
      if(this.area.kind==='boss'&&state.quest>=5&&!state.won)this.startBoss(false);
      this.createObjectiveMarker();
      setObjective();setStatus();

      if(state.firstBoot){
        state.firstBoot=false;save();
        this.time.delayedCall(280,()=>openDialogue('RICK + LAURA',WORLD.dialogue.firstMeet));
      }else showToast(this.area.name,750);
    }

    configurePersonBody(sprite,who){
      const size=who==='fats'?108:who==='laura'?102:96;
      sprite.setDisplaySize(size,size*1.24).setCollideWorldBounds(true);
      sprite.body.setSize(92,72).setOffset(82,236);
    }

    createFloor(){
      const [w,h]=this.area.size;
      const g=this.add.graphics().setDepth(-20);
      g.fillStyle(Phaser.Display.Color.HexStringToColor(this.area.floor).color,1);g.fillRect(0,0,w,h);

      if(this.area.kind==='outdoor'){
        for(let y=12;y<h;y+=30)for(let x=12;x<w;x+=30){
          const n=((x*13+y*7)%7);
          g.fillStyle(n<2?0x397650:n===3?0x214d36:0x2c6042,.55);
          g.fillRect(x+(n*4)%17,y+(n*6)%19,3,3);
        }
        // roads / paths
        g.fillStyle(0x9a8065,1);g.fillRect(0,690,w,190);g.fillRect(970,0,220,h);g.fillRect(450,1010,1650,145);
        g.fillStyle(0x6d594a,.45);
        for(let x=0;x<w;x+=58)g.fillRect(x,779,34,6);
        for(let y=0;y<h;y+=58)g.fillRect(1078,y,6,34);
        const pond=this.area.props?.find(p=>p.type==='pond');
        if(pond){
          g.fillStyle(0x3d7396,1);g.fillRoundedRect(pond.x,pond.y,pond.w,pond.h,36);
          g.lineStyle(5,0x86b9c8,1);g.strokeRoundedRect(pond.x,pond.y,pond.w,pond.h,36);
          for(let i=0;i<6;i++){g.lineStyle(2,0xffffff,.17);g.strokeCircle(pond.x+48+i*45,pond.y+58+(i%2)*62,22)}
        }
      }else{
        // interior flooring
        g.fillStyle(0x000000,.13);g.fillRect(22,22,w-44,h-44);
        const accent=Phaser.Display.Color.HexStringToColor(this.area.accent).color;
        g.lineStyle(1,accent,.16);
        for(let y=22;y<h;y+=34)g.lineBetween(22,y,w-22,y);
        for(let x=22;x<w;x+=58)g.lineBetween(x,22,x,h-22);
        g.lineStyle(10,0x0d0b11,.95);g.strokeRect(12,12,w-24,h-24);
      }
    }

    createArea(){
      if(this.area.kind==='outdoor')this.createOutdoor();
      else this.createInterior();
      (this.area.props||[]).forEach(p=>this.drawProp(p));
      (this.area.npcs||[]).forEach((n,i)=>this.addNpc(n,i));
    }

    createOutdoor(){
      (this.area.exits||[]).forEach((ex,i)=>{
        const body=this.add.rectangle(ex.x+ex.w/2,ex.y+ex.h/2+14,ex.w,ex.h-16,0x2a2430).setDepth(5).setStrokeStyle(4,0x111018);
        const roof=this.add.triangle(ex.x+ex.w/2,ex.y+14,-ex.w*.55,48,0,-48,ex.w*.55,48,0x493d51).setDepth(6).setStrokeStyle(4,0x121019);
        this.add.rectangle(ex.x+ex.w/2,ex.y+ex.h-32,58,80,0x16131c).setDepth(7);
        const sign=this.add.rectangle(ex.x+ex.w/2,ex.y+46,Math.min(ex.w-28,240),40,0x14111a,.95).setStrokeStyle(2,0xf5f0f8).setDepth(7);
        this.add.text(ex.x+ex.w/2,ex.y+46,ex.label,{fontFamily:'Bangers',fontSize:'20px',color:i===5?'#ffb8d8':'#f8f4ff',align:'center'}).setOrigin(.5).setDepth(8);
        if(ex.lockedQuest!==undefined&&state.quest<ex.lockedQuest){
          this.add.text(ex.x+ex.w/2,ex.y+ex.h-14,'FATS NOT READY',{fontFamily:'IBM Plex Sans',fontSize:'8px',color:'#ff8793'}).setOrigin(.5).setDepth(8);
        }
        this.interactables.push({x:ex.x+ex.w/2,y:ex.y+ex.h+28,r:112,type:'exit',data:ex});
      });
    }

    createInterior(){
      this.add.rectangle(this.area.size[0]/2,54,Math.min(520,this.area.size[0]-80),58,0x090b12,.9)
        .setStrokeStyle(3,Phaser.Display.Color.HexStringToColor(this.area.accent).color).setDepth(10);
      this.add.text(this.area.size[0]/2,54,this.area.name.toUpperCase(),{fontFamily:'Bangers',fontSize:'29px',color:'#f8f4ff'}).setOrigin(.5).setDepth(11);
      (this.area.exits||[]).forEach(ex=>{
        this.add.rectangle(ex.x+ex.w/2,ex.y+ex.h/2,ex.w,ex.h,0x121019,.9).setDepth(4);
        this.add.text(ex.x+ex.w/2,ex.y+ex.h/2,ex.label||'OUT',{fontFamily:'Bangers',fontSize:'19px',color:'#b6ff3b'}).setOrigin(.5).setDepth(5);
        this.interactables.push({x:ex.x+ex.w/2,y:ex.y+ex.h/2,r:100,type:'exit',data:ex});
      });
      // lamps / warmth
      for(let x=180;x<this.area.size[0]-100;x+=300){
        const lamp=this.add.circle(x,110,34,Phaser.Display.Color.HexStringToColor(this.area.accent).color,.08).setDepth(2);
        this.add.circle(x,110,10,0xffe7a8,.48).setDepth(3);
      }
    }

    drawProp(p){
      const g=this.add.graphics().setDepth(12);
      switch(p.type){
        case'tree':
          g.fillStyle(0x5c402d);g.fillRect(p.x-7,p.y,14,42);g.fillStyle(0x173e2a);g.fillCircle(p.x,p.y-5,38);g.fillStyle(0x2b6948);g.fillCircle(p.x-9,p.y-18,28);g.fillStyle(0x5b9565);g.fillRect(p.x-16,p.y-31,12,8);break;
        case'pond':break;
        case'bench':
          g.fillStyle(0x5e4632);g.fillRect(p.x-50,p.y-6,100,12);g.fillRect(p.x-40,p.y+6,9,26);g.fillRect(p.x+31,p.y+6,9,26);break;
        case'sign':
          this.add.rectangle(p.x,p.y,Math.min(330,(p.text.length*10)+46),46,0x17131c).setStrokeStyle(2,0xf8f4ff).setDepth(12);
          this.add.text(p.x,p.y,p.text,{fontFamily:'Bangers',fontSize:'20px',color:'#f8f4ff',align:'center'}).setOrigin(.5).setDepth(13);break;
        case'festival':
          this.add.rectangle(p.x,p.y,270,86,0x2d2440).setStrokeStyle(3,0xff4fa3).setDepth(12);
          this.add.text(p.x,p.y,p.text,{fontFamily:'Bangers',fontSize:'20px',color:'#ffd166',align:'center'}).setOrigin(.5).setDepth(13);
          this.interactables.push({x:p.x,y:p.y+60,r:90,type:'message',data:{speaker:'KENDAL CALLING',lines:['Parking remains spiritually unresolved.','Laura: we are absolutely going anyway.']}});break;
        case'car':
          this.drawCar(p.x,p.y);this.interactables.push({x:p.x,y:p.y+55,r:98,type:'car',data:p});break;
        case'counter':case'bar':case'desk':case'stage':case'shelf':
          this.add.rectangle(p.x,p.y,p.w||260,p.h||70,Phaser.Display.Color.HexStringToColor(this.area.accent).color).setStrokeStyle(4,0x17131c).setDepth(12);
          this.add.rectangle(p.x,p.y-(p.h||70)*.3,(p.w||260)*.85,7,0xffffff,.13).setDepth(13);break;
        case'table':
          this.add.circle(p.x,p.y,45,0x654a38).setStrokeStyle(4,0x21171b).setDepth(12);break;
        case'coffee':
          this.add.circle(p.x,p.y,19,0xf0eadf).setStrokeStyle(4,0x3e2a22).setDepth(14);this.add.circle(p.x,p.y,12,0x5d382b).setDepth(15);break;
        case'milk':
          this.add.image(p.x,p.y,'milk-pickup').setDisplaySize(62,62).setDepth(15);this.interactables.push({x:p.x,y:p.y,r:90,type:'milk',data:p});break;
        case'wine':
          this.add.image(p.x,p.y,'wine-pickup').setDisplaySize(68,68).setDepth(15);this.interactables.push({x:p.x,y:p.y,r:90,type:'wine',data:p});break;
        case'guitar':
          this.add.text(p.x,p.y,'🎸',{fontSize:'46px'}).setOrigin(.5).setDepth(15);break;
        case'steam':
          for(let i=0;i<4;i++)this.add.circle(p.x-45+i*30,p.y,18,0xffffff,.12).setDepth(14);break;
        case'palm':
          g.fillStyle(0x8f6541);g.fillRect(p.x-5,p.y-10,10,80);g.lineStyle(12,0x3c8b58);for(let a=0;a<6;a++){const ang=a*Math.PI/3;g.lineBetween(p.x,p.y-10,p.x+Math.cos(ang)*48,p.y-10+Math.sin(ang)*28)}break;
        case'roast':
          this.add.image(p.x,p.y,'roast-shot').setDisplaySize(80,80).setDepth(15);this.interactables.push({x:p.x,y:p.y,r:100,type:'roast',data:p});break;
        case'kfc':
          this.add.rectangle(p.x,p.y,80,56,0xf1eee6).setStrokeStyle(4,0xc53838).setDepth(15);this.add.text(p.x,p.y,'KFC',{fontFamily:'Bangers',fontSize:'26px',color:'#c53838'}).setOrigin(.5).setDepth(16);break;
      }
    }

    drawCar(x,y){
      const g=this.add.graphics().setDepth(13);
      g.fillStyle(0x000000,.22);g.fillEllipse(x,y+35,120,30);
      g.fillStyle(0x315f70);g.fillRoundedRect(x-70,y-30,140,64,18);g.lineStyle(4,0x10151a);g.strokeRoundedRect(x-70,y-30,140,64,18);
      g.fillStyle(0x9fd4e0);g.fillPoints([{x:x-30,y:y-30},{x:x-8,y:y-62},{x:x+35,y:y-62},{x:x+55,y:y-30}],true);
      g.fillStyle(0x171920);g.fillCircle(x-43,y+35,15);g.fillCircle(x+44,y+35,15);
      this.add.image(x+15,y-72,'glasses').setDisplaySize(42,42).setDepth(14);
    }

    addNpc(n,i){
      let key;
      if(n.art==='dad')key='dad-down0';
      else key=ART.npcTexture(n.id,0);
      const s=this.physics.add.sprite(n.x,n.y,key).setDepth(40);
      if(n.art==='dad'){s.setDisplaySize(82,102);s.body.setSize(92,68).setOffset(82,238)}
      else{s.setDisplaySize(72,92);s.body.setSize(48,34).setOffset(40,114)}
      s.body.setImmovable(true);s.padData=n;this.npcs.push(s);
      this.interactables.push({x:n.x,y:n.y,r:94,type:'npc',data:n,sprite:s});
      this.add.text(n.x,n.y-(n.art==='dad'?66:60),n.name,{fontFamily:'Bangers',fontSize:'15px',color:'#f8f4ff',stroke:'#111018',strokeThickness:3}).setOrigin(.5).setDepth(41);
    }

    createCollisions(){
      this.npcs.forEach(n=>this.physics.add.collider(this.player,n));
      if(this.area.kind!=='outdoor'){
        const[w,h]=this.area.size;
        const walls=[
          this.add.rectangle(w/2,12,w,24,0x000000,0),
          this.add.rectangle(w/2,h-12,w,24,0x000000,0),
          this.add.rectangle(12,h/2,24,h,0x000000,0),
          this.add.rectangle(w-12,h/2,24,h,0x000000,0)
        ];
        walls.forEach(r=>{this.physics.add.existing(r,true);this.physics.add.collider(this.player,r)});
      }
    }

    createObjectiveMarker(){
      this.marker=this.add.text(0,0,'▼',{fontFamily:'Bangers',fontSize:'25px',color:'#b6ff3b',stroke:'#111018',strokeThickness:4}).setOrigin(.5).setDepth(80);
      this.tweens.add({targets:this.marker,y:'-=10',duration:520,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
    }

    questTarget(){
      const q=WORLD.quests[Math.min(state.quest,WORLD.quests.length-1)];
      if(!q||q.area!==this.areaName)return null;
      return q.target;
    }

    nearestInteractable(){
      let best=null,bestD=Infinity;
      for(const it of this.interactables){
        const d=Phaser.Math.Distance.Between(this.player.x,this.player.y,it.x,it.y);
        if(d<(it.r||85)&&d<bestD){best=it;bestD=d}
      }
      return best;
    }

    act(){
      const it=this.nearestInteractable();
      if(!it){showToast('Nothing here except vibes.',650);return}

      if(it.type==='exit'){
        const ex=it.data;
        if(ex.lockedQuest!==undefined&&state.quest<ex.lockedQuest){
          openDialogue('DOOR',['FATS is not emotionally available for this encounter yet.','Finish the objective first, behbeh.']);return
        }
        this.transition(ex.to,ex.spawn);return
      }

      if(it.type==='message'){openDialogue(it.data.speaker,it.data.lines);return}

      if(it.type==='npc'){
        const n=it.data;
        if(n.id==='andrew'&&state.quest===3){
          openDialogue(n.name,n.lines,()=>this.completeQuest(4,'beat'));return
        }
        if((n.id==='will'||n.id==='denise')&&state.quest===2){
          state.seen[n.id]=true;save();
          const after=()=>{
            if(state.seen.will&&state.seen.denise&&state.quest===2)this.completeQuest(3,'wine');
            else showToast(n.id==='will'?'Now find Denise.':'Now find Will.',850)
          };
          openDialogue(n.name,n.lines,after);return
        }
        openDialogue(n.name,n.lines);return
      }

      if(it.type==='car'){
        if(state.quest===0)openDialogue('RICK',WORLD.dialogue.car,()=>this.completeQuest(1,'car'));
        else openDialogue('RICK',['Yep. Still the car.','Miraculously still where we left it.']);
        return
      }

      if(it.type==='milk'){
        if(state.quest===1)openDialogue('LAURA',WORLD.dialogue.milk,()=>this.completeQuest(2,'milk'));
        else openDialogue('MILK',['Already acquired. Behbeh logistics are under control.']);
        return
      }

      if(it.type==='wine'){
        if(state.quest===2){
          state.seen.denise=true;save();
          openDialogue('LAURA',['Tactical Sauvignon acquired.','Now find Will as well.']);
        }else{state.sauvTimer=12;setStatus();showToast('Sauvignon topped up.',800)}
        return
      }

      if(it.type==='roast'){
        if(state.quest===4){
          state.quest=5;save();setObjective();
          openDialogue('FATS',WORLD.dialogue.roast,()=>this.startBoss(true));
        }else if(state.quest>=5&&!state.won)this.startBoss(true);
      }
    }

    completeQuest(next,item){
      if(item==='car'){state.items.car=true;state.items.glasses=true}
      if(item==='milk')state.items.milk=true;
      if(item==='wine'){state.items.wine=true;state.sauvTimer=15;openDialogue('LAURA',WORLD.dialogue.tap)}
      if(item==='beat'){state.items.beat=true;state.beatPower=true;openDialogue('RICK',WORLD.dialogue.beat)}
      state.quest=next;state.score+=500;save();setObjective();setStatus();
      showToast('+500 relationship nonsense',1000);this.cameras.main.shake(150,.004);this.burst(this.player.x,this.player.y-45,state.hero==='laura'?'♪':'✦');
    }

    transition(area,spawn){
      state.area=area;save();this.cameras.main.fadeOut(170,0,0,0);
      this.time.delayedCall(190,()=>this.scene.restart({area,spawn}));
    }

    swap(){
      state.hero=state.hero==='rick'?'laura':'rick';save();setStatus();this.refreshPlayerTexture();
      showToast(state.hero==='rick'?'RICK: bars loaded.':'LAURA: riffs out.',650);this.burst(this.player.x,this.player.y-42,state.hero==='rick'?'YO':'♪');
    }

    refreshPlayerTexture(){
      const side=this.direction==='left'||this.direction==='right';
      const d=side?'right':this.direction;
      this.player.setTexture(`${state.hero}-${d}${this.stepFrame}`);
      this.player.setFlipX(this.direction==='left');
      this.configurePersonBody(this.player,state.hero);
    }

    attack(){
      if(this.attackLock>0||state.won)return;
      const dir=this.direction;
      const v=dir==='up'?{x:0,y:-1}:dir==='down'?{x:0,y:1}:dir==='left'?{x:-1,y:0}:{x:1,y:0};

      if(state.hero==='rick'){
        this.attackLock=.23;
        this.animateAttack();
        const word=state.beatPower?'ANDREW 3000!':Phaser.Utils.Array.GetRandom(['BARS!','OI!','YEAH!','MIC CHECK!']);
        const t=this.add.text(this.player.x+v.x*36,this.player.y-35+v.y*36,word,{
          fontFamily:'Bangers',fontSize:state.beatPower?'22px':'18px',color:'#11150a',backgroundColor:'#b6ff3b',
          padding:{x:7,y:4},stroke:'#11150a',strokeThickness:1
        }).setOrigin(.5).setDepth(65);
        this.physics.add.existing(t);t.body.setVelocity(v.x*500,v.y*500);t.body.setCircle(18);t.damage=state.beatPower?2.2:1.45;
        this.time.delayedCall(850,()=>t.active&&t.destroy());
        if(this.boss)this.physics.add.overlap(t,this.boss,(shot)=>this.hitBoss(shot),null,this);
        this.burst(this.player.x+v.x*28,this.player.y-30+v.y*28,'YO',4);
      }else{
        this.attackLock=.38;
        this.animateAttack();
        const radius=state.sauvTimer>0?165:138;
        const damage=state.sauvTimer>0?3.4:2.45;

        for(let i=0;i<3;i++){
          const ring=this.add.circle(this.player.x,this.player.y-22,18,0xff4fa3,.03).setStrokeStyle(5-i,0xff4fa3,.95-i*.2).setDepth(63);
          this.tweens.add({
            targets:ring,scale:radius/18,alpha:0,duration:220+i*65,delay:i*30,
            ease:'Quad.easeOut',onComplete:()=>ring.destroy()
          });
        }
        this.burst(this.player.x,this.player.y-28,'♪',8);
        this.cameras.main.shake(90,.004);

        if(this.boss&&this.boss.active){
          const d=Phaser.Math.Distance.Between(this.boss.x,this.boss.y,this.player.x,this.player.y);
          if(d<radius+55){
            this.hitBoss(null,damage);
            const ang=Phaser.Math.Angle.Between(this.player.x,this.player.y,this.boss.x,this.boss.y);
            this.boss.setVelocity(Math.cos(ang)*220,Math.sin(ang)*220);
            this.time.delayedCall(90,()=>this.boss?.active&&this.boss.setVelocity(0));
          }
        }
        showToast(state.sauvTimer>0?'SAUV RIFF!':'GUITAR RIFF!',450);
      }
    }

    animateAttack(){
      const who=state.hero;
      const flip=this.direction==='left';
      this.player.setTexture(`${who}-attack0`).setFlipX(flip);
      this.tweens.add({targets:this.player,scaleX:this.player.scaleX*1.05,scaleY:this.player.scaleY*1.05,duration:80,yoyo:true});
      this.time.delayedCall(90,()=>{if(this.player?.active)this.player.setTexture(`${who}-attack1`).setFlipX(flip)});
      this.time.delayedCall(185,()=>{if(this.player?.active)this.refreshPlayerTexture()});
    }

    hurtPlayer(source){
      if(this.hurtLock>0||state.won||dialogue)return;
      this.hurtLock=.95;state.hp=Math.max(0,state.hp-1);save();setStatus();this.cameras.main.shake(170,.012);
      this.player.setTint(0xff5e67);this.time.delayedCall(140,()=>this.player?.clearTint());
      const dx=this.player.x-source.x,dy=this.player.y-source.y,n=Math.hypot(dx,dy)||1;this.player.setVelocity(dx/n*260,dy/n*260);
      showToast(Phaser.Utils.Array.GetRandom(['MUGGED OFF.','RUDE.','ABSOLUTE LIBERTY.','BEHBEH?!']),650);
      if(state.hp<=0)this.time.delayedCall(320,()=>this.gameOver());
    }

    gameOver(){
      state.hp=state.maxHp;save();
      const boss=this.bossActive;
      openDialogue(boss?'FATS':'GAME',['You have been defeated by '+(boss?'a Sunday roast emergency.':'your own questionable decision-making.'),'Try again, behbeh.'],()=>this.transition('green',{x:1050,y:820}));
    }

    startBoss(announce){
      if(state.won)return;
      this.bossActive=true;state.quest=Math.max(state.quest,5);save();setObjective();
      if(!this.boss){
        this.boss=this.physics.add.sprite(760,355,'fats-down0').setDepth(55);
        this.configurePersonBody(this.boss,'fats');this.boss.setCollideWorldBounds(true);
        this.bossHp=this.bossMax;
        this.createBossBar();
      }
      if(announce)showToast('BOSS: SUNDAY ROAST MELTDOWN',1100);
    }

    createBossBar(){
      this.bossBarBg=this.add.rectangle(this.area.size[0]/2,126,420,28,0x211820,.92).setStrokeStyle(3,0xff5e67).setDepth(90).setScrollFactor(0);
      this.bossBarFill=this.add.rectangle(this.area.size[0]/2-200,126,400,16,0xff5e67,1).setOrigin(0,.5).setDepth(91).setScrollFactor(0);
      this.bossBarText=this.add.text(this.area.size[0]/2,96,'FATS — NORMAL POUT',{fontFamily:'Bangers',fontSize:'22px',color:'#ff9aaa',stroke:'#111018',strokeThickness:4}).setOrigin(.5).setDepth(91).setScrollFactor(0);
    }

    updateBossBar(){
      if(!this.bossBarFill)return;
      this.bossBarFill.width=400*Math.max(0,this.bossHp/this.bossMax);
      this.bossBarText.setText(this.bossPhase===1?'FATS — NORMAL POUT':'FATS — PAD THAI MODE');
    }

    hitBoss(shot,damage){
      if(!this.bossActive||!this.boss?.active)return;
      if(shot?.destroy)shot.destroy();
      this.bossHp-=damage||shot?.damage||1.2;this.updateBossBar();
      this.boss.setTintFill(0xffffff);this.time.delayedCall(75,()=>this.boss?.active&&this.boss.clearTint());this.cameras.main.shake(85,.006);this.burst(this.boss.x,this.boss.y-40,'MUG!',5);

      if(this.bossHp<=this.bossMax/2&&this.bossPhase===1){
        this.bossPhase=2;this.updateBossBar();showToast('PAD THAI MODE ACTIVATED',1100);
        openDialogue('FATS',['Fine. PAD THAI MODE.','This remains a completely normal response to the roast situation.']);
      }
      if(this.bossHp<=0)this.winBoss();
    }

    bossShoot(){
      if(!this.boss||dialogue)return;
      const angle=Phaser.Math.Angle.Between(this.boss.x,this.boss.y,this.player.x,this.player.y);
      const count=this.bossPhase===2?3:1;
      for(let i=0;i<count;i++){
        const a=angle+(i-(count-1)/2)*.28;
        const shot=this.physics.add.image(this.boss.x,this.boss.y-40,'roast-shot').setDisplaySize(46,46).setDepth(52);
        shot.setVelocity(Math.cos(a)*(this.bossPhase===2?315:245),Math.sin(a)*(this.bossPhase===2?315:245));
        this.physics.add.overlap(this.player,shot,()=>{this.hurtPlayer(shot);shot.destroy()},null,this);
        this.time.delayedCall(3000,()=>shot.active&&shot.destroy());
      }
      if(this.bossPhase===2){
        const word=this.add.text(this.boss.x,this.boss.y-90,Phaser.Utils.Array.GetRandom(['NO ROAST?!','KFC!','PAD THAI!','MUG OFF!']),{fontFamily:'Bangers',fontSize:'18px',color:'#ff5e67',stroke:'#111018',strokeThickness:4}).setOrigin(.5).setDepth(58);
        this.tweens.add({targets:word,y:word.y-35,alpha:0,duration:650,onComplete:()=>word.destroy()});
      }
    }

    winBoss(){
      if(state.won)return;
      state.won=true;state.quest=6;state.score+=2000;save();setObjective();this.bossActive=false;
      this.cameras.main.shake(420,.02);
      for(let i=0;i<9;i++)this.time.delayedCall(i*75,()=>this.burst(this.boss.x+Phaser.Math.Between(-60,60),this.boss.y+Phaser.Math.Between(-70,30),i%2?'♪':'YO',6));
      this.time.delayedCall(620,()=>{
        this.boss?.destroy();this.bossBarBg?.destroy();this.bossBarFill?.destroy();this.bossBarText?.destroy();
        openDialogue('ACHIEVEMENT',WORLD.dialogue.win,()=>showToast('🏆 SILLY BULLSHIT BITCH X',2100));
      });
    }

    burst(x,y,text,count=8){
      for(let i=0;i<count;i++){
        const t=this.add.text(x,y,text,{fontFamily:'Bangers',fontSize:Phaser.Math.Between(13,21)+'px',color:i%2?'#ff4fa3':'#b6ff3b',stroke:'#111018',strokeThickness:2}).setOrigin(.5).setDepth(70);
        const a=Math.random()*Math.PI*2,d=Phaser.Math.Between(28,72);
        this.tweens.add({targets:t,x:x+Math.cos(a)*d,y:y+Math.sin(a)*d,alpha:0,duration:Phaser.Math.Between(320,600),onComplete:()=>t.destroy()});
      }
    }

    update(_,dtMs){
      const dt=Math.min(.034,dtMs/1000);
      this.attackLock=Math.max(0,this.attackLock-dt);this.hurtLock=Math.max(0,this.hurtLock-dt);
      state.sauvTimer=Math.max(0,(state.sauvTimer||0)-dt);
      if(!this.player)return;

      // Important: dialogue really pauses the world. No boss movement, no attacks, no damage.
      if(dialogue){this.player.setVelocity(0);setStatus();return}

      const k=this.input.keyboard?.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,J,K,E');
      let ix=input.x+(k?.D?.isDown||k?.RIGHT?.isDown?1:0)-(k?.A?.isDown||k?.LEFT?.isDown?1:0);
      let iy=input.y+(k?.S?.isDown||k?.DOWN?.isDown?1:0)-(k?.W?.isDown||k?.UP?.isDown?1:0);
      const mag=Math.hypot(ix,iy);if(mag>1){ix/=mag;iy/=mag}
      const speed=state.sauvTimer>0?290:228;
      this.player.setVelocity(ix*speed,iy*speed);

      if(Math.abs(ix)+Math.abs(iy)>.08){
        this.direction=Math.abs(ix)>Math.abs(iy)?(ix<0?'left':'right'):(iy<0?'up':'down');
        this.stepClock+=dt;
        if(this.stepClock>.145){this.stepClock=0;this.stepFrame=1-this.stepFrame;this.refreshPlayerTexture()}
        this.player.setRotation(Math.sin(this.time.now/78)*.012);
      }else{
        this.stepFrame=0;this.stepClock=0;this.player.setRotation(0);this.refreshPlayerTexture();
      }

      if(k?.J&&Phaser.Input.Keyboard.JustDown(k.J))this.attack();
      if(k?.K&&Phaser.Input.Keyboard.JustDown(k.K))this.swap();
      if(k?.E&&Phaser.Input.Keyboard.JustDown(k.E)){if(nextDialogue()){}else this.act()}

      // Named NPCs have a subtle idle animation only. They never attack or chase.
      this.npcs.forEach((n,i)=>{
        const data=n.padData;
        if(data?.art==='dad'){
          n.setTexture('dad-down'+(Math.floor((this.time.now+i*180)/520)%2));
        }else{
          n.setTexture(ART.npcTexture(data?.id,Math.floor((this.time.now+i*180)/520)%2));
        }
      });

      if(this.bossActive&&this.boss?.active){
        const d=Phaser.Math.Distance.Between(this.boss.x,this.boss.y,this.player.x,this.player.y);
        if(d>145)this.physics.moveToObject(this.boss,this.player,this.bossPhase===2?105:60);else this.boss.setVelocity(0);
        this.bossCooldown-=dt;
        if(this.bossCooldown<=0){this.bossCooldown=this.bossPhase===2?.64:1.02;this.bossShoot()}
        const f=Math.floor(this.time.now/(this.bossPhase===2?130:220))%2;
        this.boss.setTexture('fats-down'+f);
        if(d<68)this.hurtPlayer(this.boss);
      }

      const target=this.questTarget();
      if(target){this.marker.setVisible(true);this.marker.setPosition(target.x,target.y-55)}else this.marker.setVisible(false);

      const near=this.nearestInteractable();
      ui.act.textContent=near?(near.type==='exit'?'ENTER':'ACT'):'ACT';

      this.player.setDepth(30+this.player.y/20);
      this.npcs.forEach(n=>n.setDepth(30+n.y/20));
      if(this.boss)this.boss.setDepth(30+this.boss.y/20);
      setStatus();
    }
  }

  const config={
    type:Phaser.AUTO,
    parent:'game',
    backgroundColor:'#10151b',
    scale:{mode:Phaser.Scale.RESIZE,width:window.innerWidth,height:window.innerHeight},
    physics:{default:'arcade',arcade:{gravity:{x:0,y:0},debug:false}},
    render:{antialias:true,pixelArt:false,roundPixels:true},
    scene:[MainScene]
  };
  new Phaser.Game(config);
  window.addEventListener('beforeunload',save);
})();