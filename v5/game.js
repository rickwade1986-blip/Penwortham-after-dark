(() => {
  'use strict';

  const P = new URLSearchParams(location.search);
  const RESET = P.get('reset') === '1';
  const AUTOTEST = P.get('autotest') || '';
  const DEBUG = P.get('debug') === '1';
  const CI = P.get('ci') === '1';
  const SAVE_KEY = 'penwortham-after-dark-v7-adventure';

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
    [Q.COMPLETE]:'Get outside. Fats has a roast-related emergency'
  };

  const fresh = () => ({
    hero:'rick',
    hp:6,
    quest:Q.TALK_WILL,
    wristband:false,
    access:false,
    glasses:false,
    sauvignon:false,
    pintServed:false
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
  const held=new Set();
  const movementKeys={ArrowLeft:[-1,0],KeyA:[-1,0],ArrowRight:[1,0],KeyD:[1,0],
    ArrowUp:[0,-1],KeyW:[0,-1],ArrowDown:[0,1],KeyS:[0,1]};
  window.addEventListener('keydown',e=>{
    if(movementKeys[e.code]){e.preventDefault();held.add(e.code);return;}
    if(e.repeat)return;
    if(['Space','KeyE','Enter'].includes(e.code)){e.preventDefault();current?.doAct();}
    if(e.code==='KeyQ'){e.preventDefault();current?.swap();}
    if(e.code==='KeyR'){e.preventDefault();current?.useAbility();}
  });
  window.addEventListener('keyup',e=>held.delete(e.code));
  window.addEventListener('blur',()=>held.clear());

  const save = () => {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch {}
    refreshUI();
  };

  function refreshUI(){
    ui.objective.textContent = document.body.dataset.v5Scene==='street'
      ? (state.quest===Q.COMPLETE ? 'Find Fats. Resolve the roast emergency.' : 'Get into Tap & Vine')
      : (objectives[state.quest] || 'Cause manageable chaos');
    ui.heroName.textContent = state.hero.toUpperCase();
    ui.heroName.style.color = state.hero === 'rick' ? '#b6ff3b' : '#ff4fa3';
    ui.ability.textContent = state.hero === 'rick' ? 'BULLSHIT' : 'CALL BS';
    ui.hearts.textContent = '♥'.repeat(state.hp);
    ui.inventory.innerHTML = [
      state.wristband ? '<span><img src="./assets/props/wristband.png" alt="">WRISTBAND</span>' : '',
      state.glasses ? '<span><img src="./assets/props/glasses.png" alt="">GLASSES</span>' : '',
      state.sauvignon ? '<span class="wine">◯ SAUVIGNON</span>' : '',
      state.pintServed ? '<span>🍺 SWAN BLONDE</span>' : ''
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


  const pintUI={
    panel:document.getElementById('pintGame'),canvas:document.getElementById('pintCanvas'),
    pour:document.getElementById('pintPour'),serve:document.getElementById('pintServe'),
    close:document.getElementById('pintClose'),level:document.getElementById('pintLevel'),
    hint:document.getElementById('pintHint')
  };
  const pint={active:false,held:false,fill:0,foam:0,last:0};
  const pc=pintUI.canvas.getContext('2d');

  function drawPint(now){
    pc.clearRect(0,0,620,380);
    const bg=pc.createRadialGradient(310,165,30,310,165,390);
    bg.addColorStop(0,'#382517');bg.addColorStop(1,'#0f0c12');
    pc.fillStyle=bg;pc.fillRect(0,0,620,380);
    pc.fillStyle='#b88749';pc.fillRect(265,0,95,22);
    pc.fillStyle='#efd08f';pc.fillRect(298,18,26,39);
    pc.fillStyle='#322124';pc.fillRect(297,48,28,15);
    const glass=()=>{pc.beginPath();pc.moveTo(210,70);pc.lineTo(414,70);
      pc.lineTo(391,343);pc.quadraticCurveTo(312,357,235,343);pc.closePath();};
    pc.save();glass();pc.clip();
    if(pint.fill>.001){
      const top=342-Math.min(1.08,pint.fill)*260;
      const amber=pc.createLinearGradient(205,80,412,355);
      amber.addColorStop(0,'#ffd273');amber.addColorStop(.35,'#efa738');
      amber.addColorStop(.7,'#ad5519');amber.addColorStop(1,'#7e3b12');
      pc.beginPath();pc.moveTo(190,355);pc.lineTo(430,355);pc.lineTo(430,top);
      for(let x=430;x>=190;x-=4){
        pc.lineTo(x,top+Math.sin(x*.05+now*.007)*2.8+Math.cos(x*.1-now*.004)*1.2);
      }
      pc.closePath();pc.fillStyle=amber;pc.fill();
      const foamH=6+Math.min(40,pint.foam);
      pc.fillStyle='#fff1c7';
      pc.beginPath();pc.moveTo(195,top);pc.lineTo(425,top);
      pc.lineTo(425,top-foamH);
      for(let x=425;x>=195;x-=5)pc.lineTo(x,top-foamH+Math.sin(x*.09+now*.005)*2.2);
      pc.closePath();pc.fill();
      for(let i=0;i<33;i++){
        const px=218+i*71%187,py=top-foamH+2+(i*23%Math.max(3,foamH));
        pc.beginPath();pc.arc(px,py,1.3+i%3,0,Math.PI*2);
        pc.fillStyle='rgba(255,255,244,.5)';pc.fill();
      }
    }
    pc.restore();
    glass();pc.strokeStyle='rgba(255,246,225,.85)';pc.lineWidth=6;pc.stroke();
    pc.beginPath();pc.moveTo(225,82);pc.lineTo(248,327);
    pc.strokeStyle='#ffebbd99';pc.lineWidth=5;pc.stroke();
    const lineY=342-.87*260;
    pc.beginPath();pc.moveTo(207,lineY);pc.lineTo(417,lineY);
    pc.setLineDash([9,7]);pc.strokeStyle='#b6ff3b';pc.lineWidth=3;pc.stroke();
    pc.setLineDash([]);pc.fillStyle='#b6ff3b';pc.font='bold 18px Arial';
    pc.fillText('SWEET SPOT',428,lineY+6);
    if(pint.held&&pint.fill<1.075){
      const end=Math.max(73,342-pint.fill*260);
      pc.beginPath();pc.moveTo(310,60);
      pc.bezierCurveTo(317,105,306+Math.sin(now*.01)*4,145,313,end);
      pc.strokeStyle='#ffcb6a';pc.lineWidth=8;pc.lineCap='round';pc.stroke();
      pc.strokeStyle='#ffefb6';pc.lineWidth=2.3;pc.stroke();
    }
  }

  function closePintGame(){
    pint.active=false;pint.held=false;pintUI.panel.classList.add('hidden');
  }
  function openPintGame(){
    if(pint.active)return;
    pint.active=true;pint.held=false;pint.fill=0;pint.foam=0;
    pint.last=performance.now();stick.x=stick.y=0;
    current?.actor?.setVelocity(0,0);
    pintUI.panel.classList.remove('hidden');
    const loop=now=>{
      if(!pint.active)return;
      const dt=Math.min(.06,Math.max(0,(now-pint.last)/1000));pint.last=now;
      if(pint.held){
        pint.fill=Math.min(1.085,pint.fill+dt*.245);
        pint.foam=Math.min(42,pint.foam+dt*1.55+(pint.fill>.96?dt*18:0));
        if(pint.fill>=1.08)pint.held=false;
      }else pint.foam=Math.max(0,pint.foam-dt*1.4);
      drawPint(now);
      pintUI.level.textContent=Math.round(pint.fill*100)+'% FILLED';
      pintUI.hint.textContent=pint.fill<.77?'KEEP POURING':
        pint.fill<.84?'NEARLY THERE':pint.fill<=.92?'SERVE NOW!':'TOO MUCH!';
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
  function finishPint(){
    if(!pint.active)return;
    const good=pint.fill>=.82&&pint.fill<=.92&&pint.foam<28;
    document.body.dataset.v7PintResult=good?'perfect':'missed';
    closePintGame();
    if(good){
      state.pintServed=true;
      if(state.quest===Q.GET_ACCESS){
        state.access=true;state.quest=Q.PICK_WRISTBAND;
      }
      save();showToast('PERFECT SWAN BLONDE • DAD APPROVES',1450);
      say('DAD',[
        "Dad: That's actually a decent pint.",
        "Rick: I'm stunned you've said something positive.",
        "Dad: Don't get used to it."
      ]);
    }else{
      showToast('DAD IS NOT IMPRESSED',1200);
      say('DAD',[
        pint.fill<.82?"Dad: That's half a pint, you muppet.":
          "Dad: You pouring a pint or filling a bath?",
        "Rick: Encouragement is a lost art in this family."
      ]);
    }
  }
  pintUI.pour.addEventListener('pointerdown',e=>{
    e.preventDefault();pint.held=true;
    pintUI.pour.setPointerCapture?.(e.pointerId);
  });
  for(const type of ['pointerup','pointercancel','lostpointercapture'])
    pintUI.pour.addEventListener(type,()=>{pint.held=false;});
  window.addEventListener('pointerup',()=>{pint.held=false;});
  pintUI.serve.addEventListener('click',finishPint);
  pintUI.close.addEventListener('click',closePintGame);

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
    if(current?.actor)applyHero(current.actor,state.hero,current.actor.heroDir||'down',false,0);
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
      this.load.image('street-bg','./assets/environments/tap_exterior.jpg');
      const sheet={frameWidth:256,frameHeight:384};
      this.load.spritesheet('rick-front-cycle','./assets/characters/generated/rick-front-cycle.png',sheet);
      this.load.spritesheet('rick-side-cycle','./assets/characters/generated/rick-side-cycle.png',sheet);
      this.load.spritesheet('rick-back-cycle','./assets/characters/generated/rick-back-cycle.png',sheet);
      this.load.spritesheet('laura-front-cycle','./assets/characters/generated/laura-front-cycle.png',sheet);
      this.load.spritesheet('laura-side-cycle','./assets/characters/generated/laura-side-cycle.png',sheet);
      this.load.spritesheet('laura-back-cycle','./assets/characters/generated/laura-back-cycle.png',sheet);
      this.load.image('will','./assets/characters/will_master.png');
      this.load.image('denise','./assets/characters/denise_master.png');
      this.load.image('dad','./assets/characters/dad_master.png');
      this.load.image('fats','./assets/characters/fats_master.png');
      this.load.image('kendal','./assets/props/kendal_display.jpg');
      this.load.image('wristband','./assets/props/wristband.png');
      this.load.image('glasses','./assets/props/glasses.png');
    }
    create(){
      for(const hero of ['rick','laura']){
        for(const dir of ['front','side','back']){
          const tex=hero+'-'+dir+'-cycle';
          this.anims.create({
            key:'walk-'+hero+'-'+dir,
            frames:this.anims.generateFrameNumbers(tex,{start:0,end:5}),
            frameRate:8,
            repeat:-1
          });
        }
      }
      this.scene.start((!AUTOTEST || AUTOTEST==='street-entry') && P.get('inside')!=='1' ? 'Street' : 'Tap');
    }
  }

  function heroCycle(hero,dir){
    if(dir==='up')return hero+'-back-cycle';
    if(dir==='left'||dir==='right')return hero+'-side-cycle';
    return hero+'-front-cycle';
  }

  function heroAnim(hero,dir){
    if(dir==='up')return 'walk-'+hero+'-back';
    if(dir==='left'||dir==='right')return 'walk-'+hero+'-side';
    return 'walk-'+hero+'-front';
  }

  function heroSize(hero){
    return hero==='laura' ? {w:172,h:258} : {w:176,h:264};
  }

  function perspectiveAt(y){
    return Phaser.Math.Clamp(.88+((y-280)/620)*.20,.86,1.12);
  }

  // Real frame-based player animation. The artwork itself changes every step.
  function createActor(scene,x,y){
    const actor=scene.add.rectangle(x,y,44,26,0x00ff66,DEBUG ? .22 : 0);
    scene.physics.add.existing(actor);
    actor.body.setSize(44,26,true);
    actor.body.setCollideWorldBounds(true);
    actor.body.setDrag(900,900);
    actor.setVelocity=(vx,vy)=>{actor.body.setVelocity(vx,vy);return actor;};
    actor.heroDir='down';
    actor.visualKey='';
    actor.walkFramesSeen=new Set();

    actor.shadow=scene.add.ellipse(x,y+7,74,16,0x000000,.48).setDepth(70);
    actor.visual=scene.add.sprite(x,y+4,heroCycle(state.hero,'down'),0).setOrigin(.5,1).setDepth(80);
    applyHero(actor,state.hero,'down',false,0);
    return actor;
  }

  function applyHero(actor,hero,dir,moving,dt){
    const visual=actor.visual;
    const texture=heroCycle(hero,dir);
    const anim=heroAnim(hero,dir);
    actor.heroDir=dir;

    if(actor.visualKey!==texture){
      visual.stop();
      visual.setTexture(texture,0);
      actor.visualKey=texture;
      actor.walkFramesSeen.clear();
    }

    if(moving){
      visual.play(anim,true);
      actor.walkFramesSeen.add(String(visual.frame.name));
    }else{
      visual.stop();
      visual.setFrame(0);
    }

    actor.bump=Math.max(0,(actor.bump||0)-dt*5.5);
    const bump=actor.bump||0;
    const bx=dir==='left'?9*bump:dir==='right'?-9*bump:0;
    const by=dir==='up'?7*bump:dir==='down'?-7*bump:0;

    const frame=Number(visual.frame.name)||0;
    const bob=moving&&[1,2,4,5].includes(frame)?3.5:0;
    const persp=perspectiveAt(actor.y);
    const size=heroSize(hero);

    visual.setFlipX(dir==='left');
    visual.setDisplaySize(size.w*persp*(1-.045*bump),size.h*persp*(1+.03*bump));
    visual.setPosition(actor.x+bx,actor.y+4-bob+by);
    visual.setAngle((dir==='left'?2.5:dir==='right'?-2.5:0)*bump);

    actor.shadow.setPosition(actor.x,actor.y+7);
    actor.shadow.setDisplaySize((74+(moving?frame%3*3:0))*persp,(16-(moving?2:0))*persp);
    actor.shadow.setAlpha(moving?.40:.48);
  }

  function npc(scene,key,x,y,height,phase=0){
    const s=scene.add.image(x,y,key).setOrigin(.5,1);
    const ratio=s.width/s.height;
    const targetH=height*perspectiveAt(y);
    s.setDisplaySize(targetH*ratio,targetH);
    s.baseX=x;
    s.baseY=y;
    s.baseW=s.displayWidth;
    s.baseH=s.displayHeight;
    s.idlePhase=phase;
    s.shadow=scene.add.ellipse(x,y+5,Math.max(42,s.displayWidth*.54),11,0x000000,.38);
    s.shadow.setDepth(80+y*.01-.04);
    s.setDepth(80+y*.01);
    return s;
  }

  function idleNpc(s,time){
    const t=time*.001;
    const breath=Math.sin(t*1.55+s.idlePhase);
    const shift=Math.sin(t*.78+s.idlePhase*1.9);
    s.setPosition(s.baseX+shift*2.2,s.baseY-Math.max(0,breath)*1.6);
    s.setAngle(shift*.55);
    s.setDisplaySize(s.baseW*(1-breath*.004),s.baseH*(1+breath*.006));
    s.shadow.setPosition(s.baseX,s.baseY+5);
    s.shadow.setScale(1-breath*.018,1);
  }

  // ACT I: A genuine second location, not another overlay over the pub.
  // The first thing the player sees is the actual illustrated Tap exterior.
  class Street extends Phaser.Scene {
    constructor(){ super('Street'); }
    create(){
      current=this;
      document.body.dataset.v5Ready='true';
      document.body.dataset.v5Scene='street';
      document.body.dataset.v7Street='true';
      this.physics.world.setBounds(0,0,1600,900);
      this.cameras.main.setBounds(0,0,1600,900);
      this.cameras.main.centerOn(800,450);
      this.cameras.main.setZoom(1);
      this.add.image(800,450,'street-bg').setDisplaySize(1600,900).setDepth(-20);
      const night=this.add.rectangle(800,450,1600,900,0x07102b,.10).setDepth(-15);

      // Street lights and window glows pulse slowly over the painted practical lights.
      const glow=this.add.ellipse(1065,409,475,340,0xffa957,.07).setBlendMode(Phaser.BlendModes.ADD).setDepth(-10);
      this.tweens.add({targets:glow,alpha:{from:.025,to:.12},duration:2400,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
      this.tweens.add({targets:night,alpha:{from:.04,to:.13},duration:3700,yoyo:true,repeat:-1});

      this.actor=createActor(this,1150,830);
      this.actor.body.setCollideWorldBounds(true);
      this.actor.heroDir='left';
      this.actor.visual.setDepth(70);

      // The other hero follows you on the pavement, so this is Rick AND Laura's adventure.
      const friendHero=state.hero==='rick'?'laura':'rick';
      this.friend=this.add.sprite(1280,825,heroCycle(friendHero,'down'),0).setOrigin(.5,1).setDepth(60);
      this.friendHero=friendHero;
      this.friendX=1280;this.friendY=825;this.friendWalk=0;

      // Oversized location reveal deliberately makes this a different scene.
      this.locationTag=this.add.container(800,117).setDepth(110);
      const plate=this.add.rectangle(0,0,655,118,0x090b10,.92).setStrokeStyle(2,0xf2c766,.75);
      const line1=this.add.text(0,-18,'LEYLAND ROAD', {
        fontFamily:'Impact, Arial Black, sans-serif',fontSize:'57px',fontStyle:'italic',color:'#f2c766'
      }).setOrigin(.5);
      const line2=this.add.text(0,31,'PENWORTHAM • 11:46 PM • BAD DECISIONS AHEAD', {
        fontFamily:'Arial, sans-serif',fontSize:'19px',fontStyle:'bold',color:'#f4e9df'
      }).setOrigin(.5);
      this.locationTag.add([plate,line1,line2]);
      this.time.delayedCall(2400,()=>this.tweens.add({targets:this.locationTag,alpha:0,duration:550}));

      this.door={x:467,y:785,r:125,label:'ENTER TAP & VINE'};
      this.doorRing=this.add.ellipse(this.door.x,this.door.y+5,110,34,0xb6ff3b,.10)
        .setStrokeStyle(4,0xb6ff3b,.9).setDepth(115);
      this.doorPrompt=this.add.text(this.door.x,633,'ENTER TAP & VINE', {
        fontFamily:'Impact, Arial Black, sans-serif',fontSize:'26px',color:'#0b0e14',
        backgroundColor:'#b6ff3b',padding:{x:15,y:8}
      }).setOrigin(.5).setDepth(116);
      this.tweens.add({targets:this.doorRing,scaleX:1.15,scaleY:1.2,alpha:.4,duration:800,yoyo:true,repeat:-1});

      this.fats=null;
      if(state.quest===Q.COMPLETE){
        this.fats=npc(this,'fats',1130,800,225,1.3);
        this.fats.setTint(0xffebce);
        this.fatsHint=this.add.text(1130,548,'FATS • THE ROAST EMERGENCY',{
          fontFamily:'Impact, Arial Black, sans-serif',fontSize:'24px',color:'#100d16',
          backgroundColor:'#ff4fa3',padding:{x:12,y:8}
        }).setOrigin(.5).setDepth(150);
        this.tweens.add({targets:this.fatsHint,scaleX:1.06,scaleY:1.06,duration:850,yoyo:true,repeat:-1});
      }
      document.body.dataset.v7ExteriorAsset='true';
      refreshUI();
      this.updatePrompt();

      if(AUTOTEST==='street-entry'){
        this.actor.setPosition(585,798);
        this.streetProbe=true;
      }
    }

    updatePrompt(){
      const atDoor=this.nearDoor();
      const atFats=!!this.fats&&Phaser.Math.Distance.Between(this.actor.x,this.actor.y,1130,800)<135;
      ui.prompt.textContent=atFats?'ACT · TALK TO FATS':
        atDoor?'ACT · OPEN PUB DOOR':(this.fats?'FIND FATS OUTSIDE':'WALK TO THE PUB DOOR');
      ui.prompt.classList.remove('hidden');
      this.doorPrompt.setAlpha(this.fats?.5:(atDoor?1:.93));
    }

    nearDoor(){
      return Phaser.Math.Distance.Between(this.actor.x,this.actor.y,this.door.x,this.door.y)<this.door.r;
    }

    doAct(){
      if(advanceDialogue())return;
      if(this.fats&&Phaser.Math.Distance.Between(this.actor.x,this.actor.y,1130,800)<135){
        say('FATS',[
          "Fats: Two places. Neither has a roast. Explain yourself.",
          "Rick: We are literally standing outside the pub.",
          "Laura: That has never stopped him turning lunch into a crisis.",
          "Fats: It's not lunch. It's a matter of principle."
        ],()=>{
          document.body.dataset.v7FatsMet='true';
          ui.endcard.classList.remove('hidden');
        });
        return;
      }
      if(this.nearDoor()){
        document.body.dataset.v7StreetEntry='pass';
        this.cameras.main.flash(240,246,204,145);
        this.scene.start('Tap');
      }else showToast(this.fats?'FATS IS OVER THERE':'GET TO THE GREEN DOOR MARKER',1000);
    }

    swap(){
      if(dialogue)return;
      state.hero=state.hero==='rick'?'laura':'rick';
      this.friendHero=state.hero==='rick'?'laura':'rick';
      this.friend.setTexture(heroCycle(this.friendHero,'down'),0);
      applyHero(this.actor,state.hero,this.actor.heroDir||'down',false,0);
      save();
      showToast('PLAYING AS '+state.hero.toUpperCase(),600);
    }

    useAbility(){
      showToast(state.hero==='laura'?'SAVE IT FOR WILL':'THERE IS NOBODY TO BULLSHIT OUT HERE',900);
    }

    update(time,dtMs){
      if(dialogue){this.actor.setVelocity(0,0);return;}
      const dt=Math.min(dtMs/1000,.034);
      let x=stick.x,y=stick.y;
      for(const k of held){const axis=movementKeys[k];if(axis){x+=axis[0];y+=axis[1];}}
      if(this.streetProbe){x=-1;y=0;}
      const len=Math.hypot(x,y);
      if(len>1){x/=len;y/=len;}
      const moving=Math.hypot(x,y)>.06;
      const direction=moving?(Math.abs(x)>Math.abs(y)?(x<0?'left':'right'):(y<0?'up':'down')):this.actor.heroDir;
      this.actor.setVelocity(x*280,y*190);
      // Pavement is walkable; the building and the road are not.
      this.actor.y=Phaser.Math.Clamp(this.actor.y,715,868);
      this.actor.x=Phaser.Math.Clamp(this.actor.x,85,1505);
      applyHero(this.actor,state.hero,direction,moving,dt);
      this.actor.visual.setDepth(80+this.actor.y*.01);
      this.actor.shadow.setDepth(79+this.actor.y*.01);

      const dx=this.actor.x+105-this.friendX,dy=this.actor.y+14-this.friendY;
      const dist=Math.hypot(dx,dy);
      if(dist>75){this.friendX+=dx*.065;this.friendY+=dy*.065;}
      this.friendX=Phaser.Math.Clamp(this.friendX,80,1520);
      this.friendY=Phaser.Math.Clamp(this.friendY,715,865);
      const fd=dist>80?(Math.abs(dx)>Math.abs(dy)?(dx<0?'left':'right'):(dy<0?'up':'down')):'down';
      const friendTex=heroCycle(this.friendHero,fd);
      if(this.friend.texture.key!==friendTex){this.friend.stop();this.friend.setTexture(friendTex,0);}
      if(dist>80)this.friend.play(heroAnim(this.friendHero,fd),true);
      else{this.friend.stop();this.friend.setFrame(0);}
      const size=heroSize(this.friendHero),persp=perspectiveAt(this.friendY);
      this.friend.setFlipX(fd==='left');
      this.friend.setDisplaySize(size.w*persp*.89,size.h*persp*.89);
      this.friend.setPosition(this.friendX,this.friendY).setDepth(78+this.friendY*.01);

      this.updatePrompt();
      if(this.streetProbe&&this.nearDoor()){this.streetProbe=false;this.doAct();}
    }
  }

  class Tap extends Phaser.Scene {
    constructor(){super('Tap')}

    create(){
      current=this;
      this.physics.world.setBounds(0,0,1600,900);
      this.cameras.main.setBounds(0,0,1600,900);
      this.add.image(800,450,'tap-bg').setDisplaySize(1600,900).setDepth(-50);

      // A dark vignette lets the illustrated practical lighting do the work without
      // covering the playable centre of the room.
      const vignette=this.add.graphics().setDepth(-40);
      vignette.fillStyle(0x06070b,.18);
      vignette.fillRect(0,0,1600,80);
      vignette.fillRect(0,820,1600,80);

      this.solids=[];
      this.actor=createActor(this,780,790);

      const block=(x,y,w,h,label)=>{
        const r=this.add.rectangle(x,y,w,h,DEBUG?0xff3b7a:0x000000,DEBUG ? .16 : 0);
        if(DEBUG)r.setStrokeStyle(2,0xff7bad,.85);
        this.physics.add.existing(r,true);
        r.body.setSize(w,h,true);
        r.collisionLabel=label;
        this.solids.push(r);
        this.physics.add.collider(this.actor,r,()=>{
          this.actor.lastCollision=label;
          const now=this.time.now;
          if(this.actor.isWalking && now-(this.actor.lastBumpFx||0)>380){
            this.actor.lastBumpFx=now;
            this.actor.bump=1;
            const ring=this.add.ellipse(this.actor.x,this.actor.y+7,44,15,0xffffff,0)
              .setStrokeStyle(3,state.hero==='rick'?0xb6ff3b:0xff4fa3,.72)
              .setDepth(120);
            this.tweens.add({targets:ring,scaleX:1.65,scaleY:1.35,alpha:0,duration:180,onComplete:()=>ring.destroy()});
          }
        });
        return r;
      };

      // Collision map follows the actual illustrated furniture instead of four giant
      // generic boxes. It is deliberately built from small rectangles so the walkable
      // lanes match what the player can see.
      block(188,315,376,630,'bar body');
      block(425,202,112,404,'bar diagonal upper');
      block(408,470,110,250,'bar diagonal lower');
      block(225,775,450,250,'bar front');
      block(735,205,92,410,'centre pillar');
      block(1032,302,226,280,'stove and side table');
      block(1478,450,244,900,'right wall and chairs');

      // Bar stools.
      block(602,342,58,58,'bar stool 1');
      block(565,466,66,66,'bar stool 2');
      block(522,604,70,70,'bar stool 3');
      block(498,715,72,72,'bar stool 4');

      // Round table and its chairs: several smaller bodies read much more naturally
      // than one giant rectangle while still keeping the player out of the artwork.
      block(1138,626,222,132,'round table');
      block(1138,559,156,54,'round table rear');
      block(1138,696,168,58,'round table front');
      block(951,610,62,64,'table stool left');
      block(1322,682,76,82,'table chair right');
      block(1050,815,82,92,'table chair front');

      const npcCollider=(s,w=48,h=26)=>{
        const b=block(s.baseX,s.baseY-h*.45,w,h,'npc');
        b.setVisible(DEBUG);
        return b;
      };

      // NPC feet positions are world-space anchors. They now sit on the floor instead
      // of being centred over it, and they physically occupy the room.
      this.will=npc(this,'will',525,514,190,.2);
      this.denise=npc(this,'denise',1036,548,202,1.7);
      this.dad=npc(this,'dad',1280,824,184,3.1);
      npcCollider(this.will,50,26);
      npcCollider(this.denise,58,28);
      npcCollider(this.dad,54,28);

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
        {id:'exit',x:785,y:844,r:115,label:'PUB DOOR',
          enabled:()=>state.quest===Q.COMPLETE,
          act:()=>this.scene.start('Street')},
        {id:'will',x:525,y:514,r:118,label:'WILL',act:()=>this.onWill()},
        {id:'denise',x:1036,y:548,r:122,label:'DENISE',act:()=>this.onDenise()},
        {id:'dad',x:1280,y:824,r:118,label:'DAD',act:()=>this.onDad()},
        {id:'display',x:1330,y:360,r:125,label:'KENDAL DISPLAY',act:()=>this.onDisplay()},
        {id:'glasses',x:555,y:560,r:105,label:'YOUR GLASSES',enabled:()=>state.quest===Q.PICK_GLASSES,act:()=>this.takeGlasses()}
      ];
      this.beaconRing=this.add.ellipse(0,0,82,27,0xb6ff3b,.055)
        .setStrokeStyle(3,0xb6ff3b,.85);
      this.beaconLabel=this.add.text(0,-39,'', {
        fontFamily:'Arial Black, Impact, sans-serif',
        fontSize:'17px', color:'#0b0e14',
        backgroundColor:'#b6ff3b',
        padding:{x:12,y:6}
      }).setOrigin(.5,1);
      this.beaconPointer=this.add.triangle(0,-29,0,0,18,0,9,10,0xb6ff3b,1);
      this.beacon=this.add.container(0,0,[
        this.beaconRing,this.beaconLabel,this.beaconPointer
      ]).setDepth(125);
      this.tweens.add({
        targets:this.beaconRing, scaleX:1.20, scaleY:1.20, alpha:.3,
        duration:720, yoyo:true, repeat:-1, ease:'Sine.easeInOut'
      });
      this.lastBeaconQuest=null;

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
      document.body.dataset.v5Hotspots=this.hotspots.filter(h=>h.id!=='exit').map(h=>h.id).join(',');
      document.body.dataset.v7PubDoor='true';
      if(AUTOTEST==='street-entry' && CI)setTimeout(()=>this.game.destroy(false),90);
      document.body.dataset.v5CollisionCount=String(this.solids.length);
      document.body.dataset.v5GroundedSprites='true';
      document.body.dataset.v6ObjectiveMarker='true';
      document.body.dataset.v6InteractionFeedback='true';
      document.body.dataset.v5SpriteSheets='true';
      document.body.dataset.v5WalkFrames='6';
      refreshUI();

      if(AUTOTEST==='walk-showcase'){
        this.actor.setPosition(790,790);
        applyHero(this.actor,'rick','right',true,.045);
        this.actor.visual.stop();
        this.actor.visual.setFrame(1);
        this.actor.walkFramesSeen.add('1');
        this.showcaseFrozen=true;
        document.body.dataset.v5WalkShowcase='sprite-frame-1';
      }
      if(AUTOTEST==='smoke' && CI)setTimeout(()=>this.game.destroy(false),80);
      if(AUTOTEST==='quest-chain'){
        this.runAutotest();
        if(CI)setTimeout(()=>this.game.destroy(false),80);
      }
      if(AUTOTEST==='collision-map'){
        this.collisionProbe={frames:0};
        this.actor.lastCollision='';
        this.actor.walkFramesSeen.clear();
        this.actor.setPosition(520,860);
      }
      if(AUTOTEST==='navigation')this.beginNavigationTest();
      if(AUTOTEST==='pint'){
        openPintGame();pint.fill=.87;pint.foam=5;finishPint();
        document.body.dataset.v7PintTest=state.pintServed?'pass':'fail';
        if(CI)setTimeout(()=>this.game.destroy(false),80);
      }
      if(AUTOTEST==='pint-showcase'){
        openPintGame();pint.fill=.56;pint.foam=5;pint.held=true;
      }
    }

    addRoomLife(){
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
      if(!state.pintServed && AUTOTEST!=='quest-chain'){
        openPintGame();return;
      }
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
        showToast('FATS IS WAITING OUTSIDE!',1400);
      });
    }

    useAbility(){
      if(dialogue)return;

      if(state.hero==='laura' && state.quest===Q.CALL_BS && this.near('will',90)){
        say('LAURA',lines.lauraBs,()=>{
          state.quest=state.pintServed?Q.PICK_WRISTBAND:Q.GET_ACCESS;
          if(state.pintServed)state.access=true;
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
      if(h){h.act();return;}
      const next=this.objectiveHotspot();
      showToast(next?'MOVE CLOSER TO '+next.label:'NOTHING TO DO HERE',850);
    }

    beginNavigationTest(){
      // A genuine movement test: route around the SAME static bodies used by gameplay,
      // then physically walk the actor to Will and ACT. No teleporting/quest forcing.
      const cell=20,W=81,H=46,at=(gx,gy)=>gy*W+gx;
      const inside=(x,y)=>x>=28&&x<=1572&&y>=20&&y<=880;
      const passable=(x,y)=>inside(x,y)&&this.solids.every(s=>{
        const b=s.body;
        return x<b.x-25||x>b.x+b.width+25||
          y<b.y-19||y>b.y+b.height+19;
      });
      const startX=Math.round(this.actor.x/cell),startY=Math.round(this.actor.y/cell);
      const parent=new Int32Array(W*H).fill(-1);
      const queue=[[startX,startY]],start=at(startX,startY);
      parent[start]=start;
      const goal=this.hotspots.find(h=>h.id==='will');let found=-1;
      for(let head=0;head<queue.length&&head<15000;head++){
        const [cx,cy]=queue[head],key=at(cx,cy),x=cx*cell,y=cy*cell;
        if(Math.hypot(x-goal.x,y-goal.y)<goal.r-30){found=key;break;}
        for(const [dx,dy] of [[1,0],[0,1],[-1,0],[0,-1]]){
          const nx=cx+dx,ny=cy+dy;
          if(nx<0||ny<0||nx>=W||ny>=H)continue;
          const n=at(nx,ny);
          if(parent[n]!==-1||!passable(nx*cell,ny*cell))continue;
          parent[n]=key;
          queue.push([nx,ny]);
        }
      }
      if(found<0){
        document.body.dataset.v6NavigationTest='fail:no-route';
        return;
      }
      const route=[];
      for(let p=found;p!==start;p=parent[p]){
        route.push({x:(p%W)*cell,y:Math.floor(p/W)*cell});
      }
      route.reverse();
      this.navProbe={route,index:0,frames:0,lastX:this.actor.x,lastY:this.actor.y,
        distance:0};
      document.body.dataset.v6NavigationState='walking';
    }

    objectiveHotspot(){
      const id={
        [Q.TALK_WILL]:'will',
        [Q.CALL_BS]:'will',
        [Q.GET_ACCESS]:'denise',
        [Q.PICK_WRISTBAND]:'display',
        [Q.RETURN_WILL]:'will',
        [Q.PICK_GLASSES]:'glasses',
        [Q.DENISE]:'denise',
        [Q.COMPLETE]:'exit'
      }[state.quest];
      return this.hotspots.find(h=>h.id===id)||null;
    }

    updateBeacon(){
      const h=this.objectiveHotspot();
      this.beacon.setVisible(!!h&&!dialogue);
      if(!h)return;
      this.beacon.setPosition(h.x,h.y+6);
      // Keep the target ring around the feet, but put labels ABOVE the
      // illustrated character instead of plastering text across their chest.
      this.beaconLabel.setY(
        h.id==='will'?-209:
        h.id==='denise'?-225:
        h.id==='display'?-99:-111
      );
      if(this.lastBeaconQuest!==state.quest){
        this.lastBeaconQuest=state.quest;
        const special=state.quest===Q.CALL_BS?'CALL BS • LAURA'
          :state.quest===Q.GET_ACCESS?'BULLSHIT • RICK'
          :state.quest===Q.PICK_WRISTBAND?'OPEN DISPLAY'
          :state.quest===Q.RETURN_WILL?'RETURN WRISTBAND'
          :state.quest===Q.PICK_GLASSES?'TAKE GLASSES'
          :state.quest===Q.DENISE?'SPEAK TO DENISE'
          :state.quest===Q.COMPLETE?'GO OUTSIDE':'TALK TO WILL';
        this.beaconLabel.setText(special);
        const pink=[Q.CALL_BS,Q.DENISE].includes(state.quest);
        const color=pink?0xff4fa3:0xb6ff3b;
        this.beaconLabel.setBackgroundColor(pink?'#ff4fa3':'#b6ff3b');
        this.beaconPointer.setFillStyle(color,1);
        this.beaconRing.setStrokeStyle(3,color,.85);
      }
      // The marker responds to the player getting close, not just a looped glow.
      this.beaconLabel.setAlpha(this.near(h.id,20)?1:.88);
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
      state.hero='laura'; this.actor.setPosition(590,545); this.useAbility(); finishDialogue();
      state.hero='rick'; this.actor.setPosition(955,575); this.useAbility(); finishDialogue();
      this.actor.setPosition(1330,360); this.onDisplay(); finishDialogue();
      this.actor.setPosition(590,545); this.onWill(); finishDialogue();
      this.actor.setPosition(555,560); this.takeGlasses(); finishDialogue();
      this.actor.setPosition(955,575); this.onDenise(); finishDialogue();
      if(state.quest===Q.FATS_TEASER){ this.playFatsTeaser(); finishDialogue(); }
      document.body.dataset.v5AutoTest=state.quest+':wristband='+state.wristband+':access='+state.access+':glasses='+state.glasses+':wine='+state.sauvignon;
    }

    update(time,dtMs){
      if(pint.active){this.actor.body.setVelocity(0,0);return;}
      if(this.showcaseFrozen){
        this.actor.body.setVelocity(0,0);
        return;
      }
      if(dialogue){
        this.actor.body.setVelocity(0,0);
        applyHero(this.actor,state.hero,this.actor.heroDir||'down',false,0);
        return;
      }
      const dt=Math.min(.034,dtMs/1000);
      let x=this.collisionProbe?-1:stick.x,y=this.collisionProbe?0:stick.y;
      if(this.navProbe){
        const probe=this.navProbe;
        probe.frames++;
        probe.distance+=Math.hypot(this.actor.x-probe.lastX,this.actor.y-probe.lastY);
        probe.lastX=this.actor.x;probe.lastY=this.actor.y;
        let point=probe.route[probe.index];
        while(point&&Math.hypot(point.x-this.actor.x,point.y-this.actor.y)<12){
          probe.index++;point=probe.route[probe.index];
        }
        const will=this.hotspots.find(h=>h.id==='will');
        if(Math.hypot(this.actor.x-will.x,this.actor.y-will.y)<will.r-5 &&
          probe.distance>220){
          this.navProbe=null;
          this.actor.setVelocity(0,0);
          this.doAct();
          while(dialogue)advanceDialogue();
          document.body.dataset.v6NavigationTest=state.quest===Q.CALL_BS
            ?'pass':'fail:interaction';
          document.body.dataset.v6NavigationDistance=Math.round(probe.distance).toString();
          if(CI)setTimeout(()=>this.game.destroy(false),80);
          return;
        }
        if(probe.frames>1600||!point){
          this.navProbe=null;
          this.actor.setVelocity(0,0);
          document.body.dataset.v6NavigationTest='fail:blocked:'+Math.round(probe.distance);
          if(CI)setTimeout(()=>this.game.destroy(false),80);
          return;
        }
        x=point.x-this.actor.x;y=point.y-this.actor.y;
      }else if(!this.collisionProbe){
        for(const key of held){const axis=movementKeys[key];if(axis){x+=axis[0];y+=axis[1];}}
      }
      const m=Math.hypot(x,y);
      if(m>.01){x/=Math.max(1,m);y/=Math.max(1,m);}
      this.actor.setVelocity(x*235,y*235);
      const moving=Math.abs(x)+Math.abs(y)>.05;
      this.actor.isWalking=moving;
      let dir=this.actor.heroDir||'down';
      if(moving)dir=Math.abs(x)>Math.abs(y)?(x<0?'left':'right'):(y<0?'up':'down');
      applyHero(this.actor,state.hero,dir,moving,dt);
      if(moving){
        this.footstepClock=(this.footstepClock||0)+dt;
        if(this.footstepClock>.23){
          this.footstepClock=0;
          const p=this.add.ellipse(this.actor.x,this.actor.y+10,11,4,0xd2bfa8,.27)
            .setDepth(75+this.actor.y*.01);
          this.tweens.add({
            targets:p,alpha:0,scaleX:2.1,scaleY:.55,
            duration:280,onComplete:()=>p.destroy()
          });
        }
      }else this.footstepClock=.12;

      if(this.collisionProbe){
        this.collisionProbe.frames++;
        const collisionName=this.actor.lastCollision||'none';
        const hitBar=collisionName==='bar front';
        const escapedPastBar=this.actor.x<430;
        const timedOut=this.collisionProbe.frames>360;
        if(hitBar||escapedPastBar||timedOut){
          const pass=hitBar && this.actor.x<520 && this.actor.x>445;
          const walked=this.actor.visualKey==='rick-side-cycle' && this.actor.walkFramesSeen.size>=2;
          this.actor.body.setVelocity(0,0);
          document.body.dataset.v5CollisionTest=pass?'pass':'fail:'+collisionName+':'+Math.round(this.actor.x);
          document.body.dataset.v5CollisionBody=Math.round(this.actor.body.width)+'x'+Math.round(this.actor.body.height);
          document.body.dataset.v5CollisionFrames=String(this.collisionProbe.frames);
          document.body.dataset.v5WalkMotion=walked?'pass':'fail:'+(this.actor.visualKey||'none')+':frames='+[...this.actor.walkFramesSeen].join(',');
          this.collisionProbe=null;
          if(CI)setTimeout(()=>this.game.destroy(false),80);
        }
      }

      const footDepth=80+this.actor.y*.01;
      this.actor.visual.setDepth(footDepth);
      this.actor.shadow.setDepth(footDepth-.04);
      idleNpc(this.will,time);
      idleNpc(this.denise,time);
      idleNpc(this.dad,time);
      this.will.setDepth(80+this.will.baseY*.01);
      this.denise.setDepth(80+this.denise.baseY*.01);
      this.dad.setDepth(80+this.dad.baseY*.01);
      this.will.shadow.setDepth(80+this.will.baseY*.01-.04);
      this.denise.shadow.setDepth(80+this.denise.baseY*.01-.04);
      this.dad.shadow.setDepth(80+this.dad.baseY*.01-.04);

      this.updateBeacon();
      const n=this.nearest();
      if(n){
        const target=this.objectiveHotspot();
        const ability=(n.id==='will'&&state.quest===Q.CALL_BS)||
          (n.id==='denise'&&state.quest===Q.GET_ACCESS);
        ui.prompt.textContent=ability
          ?(state.hero===(state.quest===Q.CALL_BS?'laura':'rick')
            ?'USE '+(state.hero==='laura'?'CALL BS':'BULLSHIT')
            :'SWAP CHARACTER • THEN USE ABILITY')
          :(n.id===target?.id?'ACT · '+n.label:'ACT · TALK TO '+n.label);
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
    scene:[Boot,Street,Tap]
  };

  new Phaser.Game(config);

  ui.act.addEventListener('pointerdown',e=>{e.preventDefault();current?.doAct();});
  ui.dialogue.addEventListener('pointerdown',e=>{
    e.preventDefault();e.stopPropagation();advanceDialogue();
  });
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