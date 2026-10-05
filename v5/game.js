(() => {
  'use strict';

  const P = new URLSearchParams(location.search);
  const RESET = P.get('reset') === '1';
  const AUTOTEST = P.get('autotest') || '';
  const SAVE_KEY = 'penwortham-after-dark-v5-slice';

  const Q = Object.freeze({
    TALK_WILL:'TALK_WILL',
    CALL_BS:'CALL_BS',
    GET_ACCESS:'GET_ACCESS',
    PICK_WRISTBAND:'PICK_WRISTBAND',
    RETURN_WILL:'RETURN_WILL',
    PICK_GLASSES:'PICK_GLASSES',
    DENISE:'DENISE',
    FATS_TEASER:'FATS_TEASER',
    COMPLETE:'COMPLETE'
  });

  const objectives = {
    [Q.TALK_WILL]:'Find out who has Rick’s glasses',
    [Q.CALL_BS]:'Laura thinks Will is talking shite',
    [Q.GET_ACCESS]:'Get access to the Kendal display',
    [Q.PICK_WRISTBAND]:'Take Will’s Kendal wristband',
    [Q.RETURN_WILL]:'Take the wristband back to Will',
    [Q.PICK_GLASSES]:'Take your bloody glasses',
    [Q.DENISE]:'Speak to Denise before you leave',
    [Q.FATS_TEASER]:'Something has happened to FATS',
    [Q.COMPLETE]:'Vertical slice complete'
  };

  const fresh = () => ({
    hero:'rick',
    hp:6,
    quest:Q.TALK_WILL,
    wristband:false,
    access:false,
    glasses:false,
    sauvignon:false
  });

  let state = fresh();
  if (RESET) localStorage.removeItem(SAVE_KEY);
  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null');
    if (saved) state = {...fresh(), ...saved};
  } catch {}

  const ui = {
    objective:document.getElementById('objective'),
    heroName:document.getElementById('heroName'),
    hearts:document.getElementById('hearts'),
    prompt:document.getElementById('prompt'),
    swap:document.getElementById('swap'),
    act:document.getElementById('act'),
    ability:document.getElementById('ability'),
    dialogue:document.getElementById('dialogue'),
    portrait:document.getElementById('portrait'),
    speaker:document.getElementById('speaker'),
    line:document.getElementById('line'),
    joystick:document.getElementById('joystick'),
    knob:document.getElementById('knob'),
    moveGhost:document.getElementById('moveGhost'),
    toast:document.getElementById('toast'),
    inventory:document.getElementById('inventory'),
    endcard:document.getElementById('endcard')
  };

  let current = null;
  let dialogue = null;
  let toastTimer = 0;
  const stick = {x:0,y:0};

  const save = () => {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch {}
    refreshUI();
  };

  function refreshUI(){
    ui.objective.textContent = objectives[state.quest] || 'Cause manageable chaos';
    ui.heroName.textContent = state.hero.toUpperCase();
    ui.heroName.style.color = state.hero === 'rick' ? '#b6ff3b' : '#ff4fa3';
    ui.ability.textContent = state.hero === 'rick' ? 'BULLSHIT' : 'CALL BS';
    ui.hearts.textContent = '♥'.repeat(state.hp);
    ui.inventory.innerHTML = [
      state.wristband ? '<span><img src="./assets/props/wristband.png" alt="">WRISTBAND</span>' : '',
      state.glasses ? '<span><img src="./assets/props/glasses.png" alt="">GLASSES</span>' : '',
      state.sauvignon ? '<span class="wine">◯ SAUVIGNON</span>' : ''
    ].join('');
    document.body.dataset.v5Quest = state.quest;
    document.body.dataset.v5Hero = state.hero;
  }

  function showToast(text,ms=1000){
    ui.toast.textContent=text;
    ui.toast.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>ui.toast.classList.add('hidden'),ms);
  }

  function portraitFor(speaker){
    const s=String(speaker||'').toUpperCase();
    if(s.includes('LAURA')) return './assets/characters/laura_master.png';
    if(s.includes('RICK')) return './assets/characters/rick_master.png';
    if(s==='WILL') return './assets/characters/will_master.png';
    if(s==='DENISE') return './assets/characters/denise_master.png';
    if(s==='DAD') return './assets/characters/dad_master.png';
    if(s.includes('FATS')) return './assets/characters/fats_master.png';
    return '';
  }

  function say(speaker,lines,done){
    dialogue={speaker,lines:[...lines],index:0,done:done||null};
    ui.speaker.textContent=speaker;
    const src=portraitFor(speaker);
    ui.portrait.innerHTML=src?'<img alt="" src="'+src+'">':'';
    ui.speaker.style.color=speaker==='LAURA'?'#ff4fa3':speaker==='RICK'?'#b6ff3b':'#f2c766';
    ui.line.textContent=dialogue.lines[0]||'';
    ui.dialogue.classList.remove('hidden');
    ui.prompt.classList.add('hidden');
    stick.x=stick.y=0;
    current?.actor?.setVelocity(0,0);
  }

  function advanceDialogue(){
    if(!dialogue)return false;
    dialogue.index++;
    if(dialogue.index>=dialogue.lines.length){
      const done=dialogue.done;
      dialogue=null;
      ui.dialogue.classList.add('hidden');
      done?.();
      refreshUI();
    }else ui.line.textContent=dialogue.lines[dialogue.index];
    return true;
  }

  const lines = {
    willIntro:[
      "Will: You looking for these?",
      "Rick: Those are literally my glasses.",
      "Will: You left them here.",
      "Laura: Of course he did.",
      "Will: I’ll trade you. Find my Kendal wristband.",
      "Rick: You’re holding my property hostage.",
      "Will: ‘Hostage’ feels very dramatic."
    ],
    lauraBs:[
      "Will: It’s probably in storage somewhere.",
      "Laura: Bullshit.",
      "Will: What?",
      "Laura: You have a whole Kendal display on the wall.",
      "Will: ...that proves nothing.",
      "Laura: It proves where we’re looking."
    ],
    displayLocked:[
      "Rick: There’s the wristband.",
      "Laura: And a tiny ‘staff only’ clip on the cabinet.",
      "Rick: That sounds negotiable."
    ],
    rickBs:[
      "Rick: Good news. I’m temporary Tap heritage staff.",
      "Denise: No.",
      "Rick: You didn’t even hear the proposal.",
      "Dad: He’s not staff.",
      "Rick: I’m getting absolutely no institutional support here.",
      "Denise: Get the wristband and stop making this a meeting."
    ],
    pickup:[
      "Laura: Got it.",
      "Rick: Excellent. Successful heritage operation.",
      "Laura: You opened a little cabinet."
    ],
    willReturn:[
      "Will: That’s the one.",
      "Rick: Great. Glasses.",
      "Will: They’re on the bar.",
      "Laura: This has taken far too many steps."
    ],
    glasses:[
      "Rick: Vision restored.",
      "Laura: Magnificent. You can now see the consequences of your own actions.",
      "Rick: I preferred the blur."
    ],
    denise:[
      "Denise: Finished pissing about?",
      "Laura: Temporarily.",
      "Denise: Good. Tactical Sauvignon?",
      "Laura: Obviously.",
      "Dad: Customer.",
      "Rick: Nobody asked, Dad.",
      "Dad: Still true."
    ],
    fats:[
      "PHONE — FATS",
      "First place: no roast.",
      "Second place: twenty-minute wait.",
      "I’m not saying society has collapsed.",
      "But I am outside.",
      "Laura: Oh for fuck’s sake."
    ]
  };

  class Boot extends Phaser.Scene {
    constructor(){super('Boot')}
    preload(){
      this.load.image('tap-bg','./assets/environments/tap_interior.jpg');
      this.load.image('rick-down','./assets/characters/rick_master.png');
      this.load.image('rick-side','./assets/characters/rick-side-walk.png');
      this.load.image('rick-up','./assets/characters/rick-back-walk.png');
      this.load.image('laura-down','./assets/characters/laura_master.png');
      this.load.image('laura-side','./assets/characters/laura-side-walk.png');
      this.load.image('laura-up','./assets/characters/laura-back-walk.png');
      this.load.image('will','./assets/characters/will_master.png');
      this.load.image('denise','./assets/characters/denise_master.png');
      this.load.image('dad','./assets/characters/dad_master.png');
      this.load.image('fats','./assets/characters/fats_master.png');
      this.load.image('kendal','./assets/props/kendal_display.jpg');
      this.load.image('wristband','./assets/props/wristband.png');
      this.load.image('glasses','./assets/props/glasses.png');
    }
    create(){ this.scene.start('Tap'); }
  }

  function heroTexture(hero,dir){
    if(dir==='up') return hero+'-up';
    if(dir==='left'||dir==='right') return hero+'-side';
    return hero+'-down';
  }

  function heroSize(hero){
    return hero==='laura' ? {w:122,h:184} : {w:118,h:178};
  }

  function perspectiveAt(y){
    return Phaser.Math.Clamp(Phaser.Math.Linear(.72,1.06,(y-155)/(855-155)),.70,1.08);
  }

  const NAV = {
    rects:[
      // fireplace / back-right furniture mass
      {x:900,y:145,w:390,h:300},
      // rear wall / inaccessible upper-right corner
      {x:1285,y:145,w:285,h:315}
    ],
    circles:[
      // bar stools
      {x:620,y:330,r:48},{x:610,y:455,r:54},{x:565,y:575,r:52},{x:505,y:705,r:52},
      // main table + chairs
      {x:1115,y:645,r:156},{x:1290,y:555,r:58},{x:1360,y:700,r:62},
      // foreground stool/chair
      {x:1015,y:835,r:74}
    ],
    bar:[
      {x:0,y:0},{x:700,y:0},{x:700,y:285},{x:430,y:625},{x:0,y:625}
    ]
  };

  function pointInPoly(x,y,poly){
    let inside=false;
    for(let i=0,j=poly.length-1;i<poly.length;j=i++){
      const a=poly[i],b=poly[j];
      if(((a.y>y)!==(b.y>y)) && x<(b.x-a.x)*(y-a.y)/(b.y-a.y)+a.x) inside=!inside;
    }
    return inside;
  }

  function hitRect(x,y,r,o){
    const cx=Phaser.Math.Clamp(x,o.x,o.x+o.w);
    const cy=Phaser.Math.Clamp(y,o.y,o.y+o.h);
    return Phaser.Math.Distance.Squared(x,y,cx,cy)<r*r;
  }

  function canStand(scene,x,y,r=23){
    if(x<365||x>1515||y<165||y>855)return false;
    if(pointInPoly(x,y,NAV.bar))return false;
    if(NAV.rects.some(o=>hitRect(x,y,r,o)))return false;
    if(NAV.circles.some(o=>Phaser.Math.Distance.Squared(x,y,o.x,o.y)<(r+o.r)*(r+o.r)))return false;
    if(scene){
      for(const n of [scene.will,scene.denise,scene.dad]){
        if(!n)continue;
        const fx=n.x,fy=n.y;
        if(Phaser.Math.Distance.Squared(x,y,fx,fy)<(r+34)*(r+34))return false;
      }
    }
    return true;
  }

  function createActor(scene,x,y){
    const actor=scene.physics.add.sprite(x,y,heroTexture(state.hero,'down')).setDepth(80);
    actor.setOrigin(.5,.93);
    actor.heroDir='down';
    actor.walkClock=0;
    actor.stepMark=0;
    const size=heroSize(state.hero),p=perspectiveAt(y);
    actor.setDisplaySize(size.w*p,size.h*p);
    actor.body.setAllowGravity(false);
    actor.body.setSize(actor.width*.30,actor.height*.10,true);
    actor.body.setOffset(actor.width*.35,actor.height*.86);
    actor.shadow=scene.add.ellipse(x,y+3,56*p,18*p,0x000000,.34).setDepth(70);
    return actor;
  }

  function applyHero(actor,hero,dir,moving,dt){
    const key=heroTexture(hero,dir);
    if(actor.texture.key!==key)actor.setTexture(key);
    actor.setFlipX(dir==='left');
    actor.heroDir=dir;

    const size=heroSize(hero);
    const p=perspectiveAt(actor.y);
    actor.walkClock=moving?(actor.walkClock||0)+dt*2.7:0;
    const step=Math.sin(actor.walkClock*Math.PI*2);
    const compression=moving?1-Math.abs(step)*.018:1;
    const widen=moving?1+Math.abs(step)*.012:1;
    actor.setDisplaySize(size.w*p*widen,size.h*p*compression);
    actor.setAngle(moving?step*1.1:0);
    actor.setDepth(80+actor.y*.02);

    if(actor.shadow){
      actor.shadow.setPosition(actor.x,actor.y+3);
      actor.shadow.setDisplaySize(56*p*(moving?1-Math.abs(step)*.08:1),18*p);
      actor.shadow.setDepth(actor.depth-1);
    }
  }

  function npc(scene,key,x,y,height){
    const s=scene.add.image(x,y,key).setOrigin(.5,.93).setDepth(65+y*.02);
    const ratio=s.width/s.height;
    const p=perspectiveAt(y);
    s.setDisplaySize(height*ratio*p,height*p);
    s.shadow=scene.add.ellipse(x,y+2,48*p,15*p,0x000000,.28).setDepth(s.depth-1);
    return s;
  }

  class Tap extends Phaser.Scene {
    constructor(){super('Tap')}

    create(){
      current=this;
      this.physics.world.setBounds(0,0,1600,900);
      this.cameras.main.setBounds(0,0,1600,900);
      this.add.image(800,450,'tap-bg').setDisplaySize(1600,900).setDepth(-50);

      // The artwork is scenery; gameplay collision is mapped to the visible room
      // instead of four giant invisible rectangles.
      const vignette=this.add.graphics().setDepth(-40);
      vignette.fillStyle(0x06070b,.18);
      vignette.fillRect(0,0,1600,80);
      vignette.fillRect(0,820,1600,80);

      this.actor=createActor(this,780,790);
      this.will=npc(this,'will',455,535,165);
      this.denise=npc(this,'denise',1030,555,168);
      this.dad=npc(this,'dad',1185,715,158);

      if(P.get('nav')==='1')this.drawNavDebug();

      this.display=this.add.image(1370,225,'kendal').setDisplaySize(215,215).setDepth(10);
      this.display.setTint(0xe8d8c3);

      this.wristband=this.add.image(1395,265,'wristband').setDisplaySize(54,54).setDepth(35).setVisible(
        [Q.GET_ACCESS,Q.PICK_WRISTBAND].includes(state.quest)
      );
      this.glasses=this.add.image(500,505,'glasses').setDisplaySize(68,68).setDepth(40).setVisible(
        state.quest===Q.PICK_GLASSES
      );

      if(this.wristband.visible)this.pulse(this.wristband,0xff4fa3);
      if(this.glasses.visible)this.pulse(this.glasses,0xb6ff3b);

      this.hotspots=[
        {id:'will',x:490,y:555,r:135,label:'WILL',act:()=>this.onWill()},
        {id:'denise',x:1045,y:590,r:120,label:'DENISE',act:()=>this.onDenise()},
        {id:'dad',x:1190,y:720,r:115,label:'DAD',act:()=>this.onDad()},
        {id:'display',x:1330,y:360,r:125,label:'KENDAL DISPLAY',act:()=>this.onDisplay()},
        {id:'glasses',x:555,y:560,r:105,label:'YOUR GLASSES',enabled:()=>state.quest===Q.PICK_GLASSES,act:()=>this.takeGlasses()}
      ];

      // The Tap is a single illustrated room. Keep the whole composition readable
      // instead of following the player and turning the concept art into a crop.
      this.cameras.main.stopFollow();
      this.cameras.main.setZoom(1);
      this.cameras.main.centerOn(800,450);
      this.cameras.main.setRoundPixels(false);

      this.addRoomLife();

      document.body.dataset.v5Ready='true';
      document.body.dataset.v5Scene='tap';
      document.body.dataset.v5Assets='production';
      document.body.dataset.v5Hotspots=this.hotspots.map(h=>h.id).join(',');
      refreshUI();

      if(AUTOTEST==='quest-chain')this.runAutotest();
    }

    drawNavDebug(){
      const g=this.add.graphics().setDepth(2000);
      g.lineStyle(3,0xff4fa3,.85);
      g.fillStyle(0xff4fa3,.16);
      g.beginPath();
      NAV.bar.forEach((p,i)=>i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));
      g.closePath();g.fillPath();g.strokePath();
      for(const o of NAV.rects){g.fillRect(o.x,o.y,o.w,o.h);g.strokeRect(o.x,o.y,o.w,o.h);}
      for(const o of NAV.circles){g.fillCircle(o.x,o.y,o.r);g.strokeCircle(o.x,o.y,o.r);}
    }

    addRoomLife(){
      // Life stays centred on each NPC's feet. No bobbing bodies up and down.
      this.tweens.add({targets:this.will,angle:{from:-.35,to:.35},duration:1800,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
      this.tweens.add({targets:this.denise,angle:{from:-.45,to:.45},duration:2100,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
      this.tweens.add({targets:this.dad,angle:{from:-.25,to:.25},duration:2400,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
      const glow=this.add.rectangle(845,150,540,8,0xf2c766,.10).setDepth(-38);
      this.tweens.add({targets:glow,alpha:{from:.04,to:.16},duration:1800,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
    }

    pulse(target,color){
      this.tweens.add({targets:target,scaleX:target.scaleX*1.08,scaleY:target.scaleY*1.08,duration:520,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
      const ring=this.add.circle(target.x,target.y,32,color,.06).setStrokeStyle(4,color,.65).setDepth(target.depth-1);
      this.tweens.add({targets:ring,scale:1.55,alpha:.05,duration:760,yoyo:true,repeat:-1});
    }

    nearest(){
      let best=null,bd=Infinity;
      for(const h of this.hotspots){
        if(h.enabled && !h.enabled())continue;
        const d=Phaser.Math.Distance.Between(this.actor.x,this.actor.y,h.x,h.y);
        if(d<h.r&&d<bd){best=h;bd=d;}
      }
      return best;
    }

    near(id,extra=0){
      const h=this.hotspots.find(x=>x.id===id);
      if(!h)return false;
      return Phaser.Math.Distance.Between(this.actor.x,this.actor.y,h.x,h.y)<h.r+extra;
    }

    onWill(){
      if(state.quest===Q.TALK_WILL){
        say('WILL',lines.willIntro,()=>{state.quest=Q.CALL_BS;save();});
        return;
      }
      if(state.quest===Q.CALL_BS){
        say('WILL',["Storage. Probably.",'Laura: That sounds incredibly convincing.']);
        return;
      }
      if([Q.GET_ACCESS,Q.PICK_WRISTBAND].includes(state.quest)){
        say('WILL',['Find the wristband.','Rick: You are enjoying this far too much.']);
        return;
      }
      if(state.quest===Q.RETURN_WILL&&state.wristband){
        say('WILL',lines.willReturn,()=>{
          state.quest=Q.PICK_GLASSES;
          this.glasses.setVisible(true);
          this.pulse(this.glasses,0xb6ff3b);
          save();
        });
        return;
      }
      if(state.quest===Q.PICK_GLASSES){
        say('WILL',['They are literally on the bar.']);
        return;
      }
      say('WILL',['I have nothing else to extort from you right now.']);
    }

    onDenise(){
      if(state.quest===Q.GET_ACCESS){
        say('DENISE',['No staff behind the display.','Rick: Define “staff”.','Denise: Absolutely not.']);
        return;
      }
      if(state.quest===Q.DENISE){
        say('DENISE',lines.denise,()=>{
          state.sauvignon=true;
          state.quest=Q.FATS_TEASER;
          save();
          showToast('TACTICAL SAUVIGNON ACQUIRED',1200);
          this.time.delayedCall(260,()=>this.playFatsTeaser());
        });
        return;
      }
      say('DENISE',['You two causing trouble already?','Laura: Existing near Will seems to be enough.']);
    }

    onDad(){
      if(state.quest===Q.GET_ACCESS){
        say('DAD',["You're not staff.",'Rick: I know.','Dad: Just checking.']);
      }else if(state.quest===Q.DENISE){
        say('DAD',['Customer.','Rick: Nobody asked.','Dad: Still true.']);
      }else say('DAD',['Found your glasses yet?','Rick: Working on it.','Dad: Strong start to the evening.']);
    }

    onDisplay(){
      if(state.quest===Q.CALL_BS){
        say('LAURA',['There is very obviously a wristband in there.','CALL BS on Will first.']);
        return;
      }
      if(state.quest===Q.GET_ACCESS){
        say('RICK',lines.displayLocked);
        return;
      }
      if(state.quest===Q.PICK_WRISTBAND&&state.access){
        say('LAURA',lines.pickup,()=>{
          state.wristband=true;
          state.quest=Q.RETURN_WILL;
          this.wristband.setVisible(false);
          save();
          this.pickupFx(1395,265,0xff4fa3,'WRISTBAND ACQUIRED');
        });
        return;
      }
      if(state.wristband) say('RICK',['Kendal memories. Accuracy not guaranteed.']);
      else say('LAURA',['Kendal display. Suspiciously relevant.']);
    }

    takeGlasses(){
      if(state.quest!==Q.PICK_GLASSES)return;
      say('RICK',lines.glasses,()=>{
        state.glasses=true;
        state.quest=Q.DENISE;
        this.glasses.setVisible(false);
        save();
        this.pickupFx(500,505,0xb6ff3b,'GLASSES RECOVERED');
      });
    }

    playFatsTeaser(){
      if(state.quest!==Q.FATS_TEASER)return;
      say('FATS',lines.fats,()=>{
        state.quest=Q.COMPLETE;
        save();
        ui.endcard.classList.remove('hidden');
      });
    }

    useAbility(){
      if(dialogue)return;

      if(state.hero==='laura' && state.quest===Q.CALL_BS && this.near('will',90)){
        say('LAURA',lines.lauraBs,()=>{
          state.quest=Q.GET_ACCESS;
          this.wristband.setVisible(true);
          this.pulse(this.wristband,0xff4fa3);
          save();
        });
        return;
      }

      if(state.hero==='rick' && state.quest===Q.GET_ACCESS && this.near('denise',130)){
        say('RICK',lines.rickBs,()=>{
          state.access=true;
          state.quest=Q.PICK_WRISTBAND;
          save();
          showToast('ACCESS: TECHNICALLY NOT DENIED',900);
        });
        return;
      }

      const n=this.nearest();
      if(n?.id==='will'){
        say(state.hero.toUpperCase(),state.hero==='rick'
          ?['Rick: I can make a very compelling case for just giving them back.','Will: Go on then.','Rick: ...I had more confidence before you said that.']
          :['Laura: Bullshit.','Will: On what?','Laura: Broadly.']);
      }else if(n?.id==='dad')this.onDad();
      else{
        showToast(state.hero==='rick'?'NOTHING HERE WORTH BULLSHITTING':'BULLSHIT LEVELS ACCEPTABLE',700);
      }
    }

    pickupFx(x,y,color,label){
      const ring=this.add.circle(x,y,22,color,.15).setStrokeStyle(5,color,1).setDepth(100);
      this.tweens.add({targets:ring,scale:5,alpha:0,duration:500,onComplete:()=>ring.destroy()});
      showToast(label,950);
      this.cameras.main.shake(100,.004);
    }

    doAct(){
      if(advanceDialogue())return;
      const h=this.nearest();
      h?.act?.();
    }

    swap(){
      if(dialogue)return;
      state.hero=state.hero==='rick'?'laura':'rick';
      applyHero(this.actor,state.hero,this.actor.heroDir||'down',false,0);
      save();
      showToast(state.hero==='rick'?'RICK IN':'LAURA IN',450);
    }

    runAutotest(){
      const finishDialogue=()=>{let i=0;while(dialogue&&i++<40)advanceDialogue();};
      state={...fresh(),hero:'rick'};
      this.onWill(); finishDialogue();
      state.hero='laura'; this.actor.setPosition(490,555); this.useAbility(); finishDialogue();
      state.hero='rick'; this.actor.setPosition(1045,590); this.useAbility(); finishDialogue();
      this.actor.setPosition(1330,360); this.onDisplay(); finishDialogue();
      this.actor.setPosition(490,555); this.onWill(); finishDialogue();
      this.actor.setPosition(555,560); this.takeGlasses(); finishDialogue();
      this.actor.setPosition(1045,590); this.onDenise(); finishDialogue();
      if(state.quest===Q.FATS_TEASER){ this.playFatsTeaser(); finishDialogue(); }
      document.body.dataset.v5AutoTest=state.quest+':wristband='+state.wristband+':access='+state.access+':glasses='+state.glasses+':wine='+state.sauvignon;
    }

    update(_,dtMs){
      if(dialogue)return;
      const dt=Math.min(.034,dtMs/1000);
      let x=stick.x,y=stick.y;
      const m=Math.hypot(x,y);
      if(m>.01){x/=Math.max(1,m);y/=Math.max(1,m);}
      const moving=Math.abs(x)+Math.abs(y)>.05;
      let dir=this.actor.heroDir||'down';
      if(moving)dir=Math.abs(x)>Math.abs(y)?(x<0?'left':'right'):(y<0?'up':'down');

      // Manual foot-point navigation gives collision that matches the illustration.
      // Resolve X/Y separately so the player naturally slides along furniture.
      if(moving){
        const speed=232;
        const dx=x*speed*dt,dy=y*speed*dt;
        const nx=this.actor.x+dx;
        if(canStand(this,nx,this.actor.y))this.actor.x=nx;
        const ny=this.actor.y+dy;
        if(canStand(this,this.actor.x,ny))this.actor.y=ny;
        this.actor.body.reset(this.actor.x,this.actor.y);
      }else this.actor.setVelocity(0,0);

      applyHero(this.actor,state.hero,dir,moving,dt);

      const n=this.nearest();
      if(n){
        ui.prompt.textContent='ACT · '+n.label;
        ui.prompt.classList.remove('hidden');
      }else ui.prompt.classList.add('hidden');
    }
  }

  const config={
    type:Phaser.AUTO,
    parent:'game',
    backgroundColor:'#090b10',
    scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:1600,height:900},
    physics:{default:'arcade',arcade:{gravity:{x:0,y:0},debug:false}},
    render:{antialias:true,roundPixels:false},
    scene:[Boot,Tap]
  };

  new Phaser.Game(config);

  ui.act.addEventListener('pointerdown',e=>{e.preventDefault();current?.doAct();});
  ui.swap.addEventListener('pointerdown',e=>{e.preventDefault();current?.swap();});
  ui.ability.addEventListener('pointerdown',e=>{e.preventDefault();current?.useAbility();});

  let pointerId=null,origin={x:0,y:0};
  const MAX=46;

  window.addEventListener('pointerdown',e=>{
    if(dialogue||pointerId!==null||e.clientX>innerWidth*.48||e.target.closest?.('button'))return;
    pointerId=e.pointerId;
    origin={x:e.clientX,y:e.clientY};
    ui.joystick.style.left=e.clientX+'px';
    ui.joystick.style.top=e.clientY+'px';
    ui.joystick.classList.remove('hidden');
    ui.moveGhost.style.opacity='.18';
  },{passive:false});

  window.addEventListener('pointermove',e=>{
    if(e.pointerId!==pointerId)return;
    let dx=e.clientX-origin.x,dy=e.clientY-origin.y;
    const d=Math.hypot(dx,dy);
    if(d>MAX){dx=dx/d*MAX;dy=dy/d*MAX;}
    stick.x=dx/MAX;stick.y=dy/MAX;
    ui.knob.style.transform=`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px))`;
  },{passive:false});

  const end=e=>{
    if(e.pointerId!==pointerId)return;
    pointerId=null;stick.x=stick.y=0;
    ui.joystick.classList.add('hidden');
    ui.knob.style.transform='translate(-50%,-50%)';
    ui.moveGhost.style.opacity='.55';
  };
  window.addEventListener('pointerup',end,{passive:false});
  window.addEventListener('pointercancel',end,{passive:false});

  ['gesturestart','gesturechange','gestureend','dblclick'].forEach(t=>document.addEventListener(t,e=>e.preventDefault(),{passive:false}));
  document.addEventListener('touchmove',e=>{if(e.touches?.length>1)e.preventDefault();},{passive:false});

  window.addEventListener('error',e=>{document.body.dataset.v5Error=String(e.message||'error').slice(0,160);});
  window.addEventListener('unhandledrejection',e=>{document.body.dataset.v5Error=('promise:'+String(e.reason||'error')).slice(0,160);});

  refreshUI();
})();