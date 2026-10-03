(() => {
  'use strict';

  const P = new URLSearchParams(location.search);
  const DEV = P.get('dev') === '1';

  const Q = Object.freeze({
    TALK_WILL:'TALK_WILL',
    CALL_BS:'CALL_BS',
    ACCESS_DISPLAY:'ACCESS_DISPLAY',
    WRISTBAND:'WRISTBAND',
    RETURN_WILL:'RETURN_WILL',
    COMPLETE:'COMPLETE'
  });

  const objectives = {
    [Q.TALK_WILL]:'Talk to Will',
    [Q.CALL_BS]:'Laura thinks Will is talking shite',
    [Q.ACCESS_DISPLAY]:'Get access to the Kendal display',
    [Q.WRISTBAND]:"Get Will's Kendal wristband",
    [Q.RETURN_WILL]:'Take the wristband back to Will',
    [Q.COMPLETE]:'Glasses recovered. Somehow.'
  };

  const state = {
    hero:'rick',
    hp:6,
    quest:Q.TALK_WILL,
    wristband:false,
    access:false
  };

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
    moveGhost:document.getElementById('moveGhost')
  };

  const refreshUI = () => {
    ui.objective.textContent = objectives[state.quest];
    ui.heroName.textContent = state.hero.toUpperCase();
    ui.heroName.style.color = state.hero === 'rick' ? '#b6ff3b' : '#ff4fa3';
    ui.ability.textContent = state.hero === 'rick' ? 'BULLSHIT' : 'CALL BS';
    document.body.dataset.quest = state.quest;
    document.body.dataset.hero = state.hero;
  };

  let current = null;
  let dialogue = null;
  const stick = {x:0,y:0};

  function portraitFor(speaker){
    const s=String(speaker||'').toUpperCase();
    if(s.includes('LAURA')) return './assets/characters/laura-master.png';
    if(s.includes('RICK')) return './assets/characters/rick-master.png';
    if(s==='WILL') return './assets/characters/will.png';
    if(s==='DENISE') return './assets/characters/denise.png';
    if(s==='DAD') return './assets/characters/dad.png';
    return '';
  }

  function say(speaker, lines, done) {
    dialogue={speaker,lines:[...lines],index:0,done:done||null};
    ui.speaker.textContent=speaker;
    const portrait=portraitFor(speaker);
    ui.portrait.innerHTML=portrait?'<img alt="" src="'+portrait+'">':'';
    ui.speaker.style.color=speaker==='LAURA'?'#ff4fa3':speaker==='RICK'?'#b6ff3b':'#f2c766';
    ui.line.textContent=dialogue.lines[0]||'';
    ui.dialogue.classList.remove('hidden');
    stick.x=stick.y=0;
    current?.actor?.setVelocity(0,0);
  }

  function advanceDialogue() {
    if (!dialogue) return false;
    dialogue.index++;
    if (dialogue.index >= dialogue.lines.length) {
      const done=dialogue.done;
      dialogue=null;
      ui.dialogue.classList.add('hidden');
      done?.();
      refreshUI();
    } else ui.line.textContent=dialogue.lines[dialogue.index];
    return true;
  }

  const LINES = {
    willIntro:[
      "Yeah, I've got your glasses.",
      "Rick: Why have you got my glasses?",
      "Will: You left them here.",
      "Laura: Of course he did.",
      "Will: Find my Kendal wristband and we're even."
    ],
    lauraBs:[
      "Laura: Storage? Bullshit.",
      "Will: What?",
      "Laura: That wristband is still on the Kendal display.",
      "Will: ...possibly."
    ],
    rickBs:[
      "Rick: Good news. I'm temporary Tap heritage staff.",
      "Dad: No you're not.",
      "Rick: I hadn't finished.",
      "Denise: Just let him get the bloody wristband."
    ],
    pickup:[
      "Laura: There it is.",
      "Rick: Weirdly easy once everyone stopped lying.",
      "Laura: Imagine that."
    ],
    finish:[
      "Will: That's the one. Here — your glasses.",
      "Laura: An unnecessarily complicated transaction for an object he already owned.",
      "Dad: Customer.",
      "Denise: Tactical Sauvignon?",
      "Laura: Obviously."
    ]
  };

  class Boot extends Phaser.Scene {
    constructor(){super('Boot')}
    preload(){
      this.load.image('tap-bg','./assets/environments/tap-interior.png');
      this.load.image('tap-exterior','./assets/environments/tap-exterior.png');

      this.load.image('rick-down','./assets/characters/rick-master.png');
      this.load.image('rick-side','./assets/characters/rick-side-walk.png');
      this.load.image('rick-up','./assets/characters/rick-back-walk.png');

      this.load.image('laura-down','./assets/characters/laura-master.png');
      this.load.image('laura-side','./assets/characters/laura-side-walk.png');
      this.load.image('laura-up','./assets/characters/laura-back-walk.png');

      this.load.image('will','./assets/characters/will.png');
      this.load.image('denise','./assets/characters/denise.png');
      this.load.image('dad','./assets/characters/dad.png');
    }
    create(){
      this.scene.start(P.get('scene')==='tap'?'Tap':'Exterior');
    }
  }

  function heroTexture(hero,dir){
    if(dir==='up') return hero+'-up';
    if(dir==='left'||dir==='right') return hero+'-side';
    return hero+'-down';
  }

  function createProductionActor(scene,x,y){
    const actor=scene.physics.add.sprite(x,y,heroTexture(state.hero,'down')).setDepth(50).setCollideWorldBounds(true);
    actor.heroDir='down';
    actor.walkClock=0;
    actor.setDisplaySize(state.hero==='laura'?112:106,150);
    actor.body.setSize(actor.width*.42,actor.height*.20,true);
    actor.body.setOffset(actor.width*.29,actor.height*.73);
    return actor;
  }

  function applyHeroVisual(actor,hero,dir,moving,dt){
    const key=heroTexture(hero,dir);
    if(actor.texture.key!==key) actor.setTexture(key);
    actor.setFlipX(dir==='right');
    actor.heroDir=dir;
    actor.setDisplaySize(hero==='laura'?112:106,150);

    if(moving){
      actor.walkClock=(actor.walkClock||0)+dt*10;
      actor.setAngle(Math.sin(actor.walkClock*Math.PI)*1.15*(dir==='left'?-1:1));
    }else{
      actor.walkClock=0;
      actor.setAngle(0);
    }
  }

  function addNpc(scene,key,x,y,height){
    const s=scene.add.image(x,y,key).setDepth(45);
    const ratio=s.width/s.height;
    s.setDisplaySize(height*ratio,height);
    return s;
  }

  class Exterior extends Phaser.Scene {
    constructor(){super('Exterior')}
    create(){
      current=this;
      this.physics.world.setBounds(0,0,1600,900);
      this.cameras.main.setBounds(0,0,1600,900);
      this.add.image(800,450,'tap-exterior').setDisplaySize(1600,900).setDepth(-20);

      this.add.text(825,240,'TAP AND VINE   @69',{
        fontFamily:'Arial Black, Impact, sans-serif',
        fontSize:'46px',
        color:'#efe6cf',
        stroke:'#151218',
        strokeThickness:4,
        letterSpacing:7
      }).setOrigin(.5).setDepth(-5).setAngle(-1);

      this.actor=createProductionActor(this,820,770);

      const facade=this.add.rectangle(800,295,1600,520,0x000000,0);
      this.physics.add.existing(facade,true);
      this.physics.add.collider(this.actor,facade);

      this.hotspots=[
        {id:'tap-door',x:925,y:625,r:150,label:'ENTER TAP & VINE',act:()=>{
          this.cameras.main.fadeOut(160,0,0,0);
          this.time.delayedCall(170,()=>this.scene.start('Tap'));
        }}
      ];

      document.body.dataset.v5Ready='true';
      document.body.dataset.scene='exterior';
      document.body.dataset.hotspots='tap-door';
      refreshUI();
    }
    nearest(){
      let best=null,bd=Infinity;
      for(const h of this.hotspots){
        const d=Phaser.Math.Distance.Between(this.actor.x,this.actor.y,h.x,h.y);
        if(d<h.r&&d<bd){best=h;bd=d;}
      }
      return best;
    }
    doAct(){
      if(advanceDialogue())return;
      this.nearest()?.act?.();
    }
    swap(){if(dialogue)return;state.hero=state.hero==='rick'?'laura':'rick';refreshUI();}
    useAbility(){
      if(dialogue)return;
      say(state.hero.toUpperCase(),state.hero==='rick'
        ?['Rick: I can get us straight in.','Laura: It is a door.']
        :['Laura: I am calling bullshit on needing an ability to enter a pub.']);
    }
    update(_,dtMs){
      if(dialogue)return;
      let x=stick.x,y=stick.y;const m=Math.hypot(x,y);
      if(m>.01){x/=Math.max(1,m);y/=Math.max(1,m);}
      this.actor.setVelocity(x*245,y*245);
      const moving=Math.abs(x)+Math.abs(y)>.05;
      let dir=this.actor.heroDir||'down';
      if(moving) dir=Math.abs(x)>Math.abs(y)?(x<0?'left':'right'):(y<0?'up':'down');
      applyHeroVisual(this.actor,state.hero,dir,moving,dtMs/1000);
      const n=this.nearest();
      if(n){ui.prompt.textContent='ACT · '+n.label;ui.prompt.classList.remove('hidden');}
      else ui.prompt.classList.add('hidden');
    }
  }

  class Tap extends Phaser.Scene {
    constructor(){super('Tap')}
    create(){
      current=this;
      this.physics.world.setBounds(0,0,1600,900);
      this.cameras.main.setBounds(0,0,1600,900);
      this.add.image(800,450,'tap-bg').setDisplaySize(1600,900).setDepth(-20);

      // Collision map matched to the production Tap background:
      // keep the floor open, stop the player walking through the bar and stove.
      this.solids=this.physics.add.staticGroup();
      const wall=(x,y,w,h)=>{
        const r=this.add.rectangle(x,y,w,h,0x000000,0);
        this.physics.add.existing(r,true);
        this.solids.add(r);
      };
      wall(1190,620,650,310);  // U-shaped bar/front cabinetry
      wall(560,320,235,185);   // stove / fireplace alcove

      // DEV-only body. Final branch will use approved Rick/Laura production sprites.
      this.actor=createProductionActor(this,860,760);
      this.physics.add.collider(this.actor,this.solids);

      this.willSprite=addNpc(this,'will',1090,410,132);
      this.deniseSprite=addNpc(this,'denise',720,560,142);
      this.dadSprite=addNpc(this,'dad',455,705,126);

      this.wristbandVisual=this.add.graphics().setDepth(35);
      this.wristbandVisual.lineStyle(8,0xff4fa3,1);
      this.wristbandVisual.strokeCircle(805,205,16);
      this.wristbandVisual.lineStyle(3,0xf2c766,1);
      this.wristbandVisual.strokeCircle(805,205,10);
      this.wristbandVisual.setVisible(false);

      this.cameras.main.startFollow(this.actor,true,.12,.12);
      this.cameras.main.setZoom(1);
      this.cameras.main.centerOn(800,450);

      this.hotspots=[
        {id:'will',x:825,y:455,r:150,label:'WILL',act:()=>this.will()},
        {id:'denise',x:720,y:560,r:105,label:'DENISE',act:()=>this.denise()},
        {id:'dad',x:455,y:705,r:105,label:'DAD',act:()=>this.dad()},
        {id:'display',x:760,y:300,r:125,label:'KENDAL DISPLAY',act:()=>this.display()}
      ];

      if(DEV){
        this.markers=this.add.graphics().setDepth(20);
        this.markers.lineStyle(3,0xff4fa3,.45);
        for(const h of this.hotspots)this.markers.strokeCircle(h.x,h.y,h.r);
      }

      this.wristbandVisual.setVisible([Q.ACCESS_DISPLAY,Q.WRISTBAND].includes(state.quest));

      document.body.dataset.v5Ready='true';
      document.body.dataset.scene='tap';
      document.body.dataset.hotspots=this.hotspots.map(h=>h.id).join(',');
      refreshUI();

      if(P.get('autotest')==='quest-chain') this.runAutotest();
    }

    nearest(){
      let best=null,bd=Infinity;
      for(const h of this.hotspots){
        const d=Phaser.Math.Distance.Between(this.actor.x,this.actor.y,h.x,h.y);
        if(d<h.r&&d<bd){best=h;bd=d}
      }
      return best;
    }

    will(){
      if(state.quest===Q.TALK_WILL){
        say('WILL',LINES.willIntro,()=>{state.quest=Q.CALL_BS;refreshUI();});
      }else if(state.quest===Q.RETURN_WILL&&state.wristband){
        say('WILL',LINES.finish,()=>{state.quest=Q.COMPLETE;refreshUI();});
      }else if([Q.CALL_BS,Q.ACCESS_DISPLAY,Q.WRISTBAND].includes(state.quest)){
        say('WILL',['Wristband first.']);
      }else say('WILL',["I've already given them back. Try keeping them this time."]);
    }

    denise(){
      say('DENISE',state.quest===Q.ACCESS_DISPLAY
        ?['Just get the wristband before Will invents another rule.']
        :['You two causing trouble already?','Laura: Existing near Will seems to be enough.']);
    }

    dad(){
      say('DAD',state.quest===Q.ACCESS_DISPLAY
        ?["You're not staff.",'Rick: I know.','Dad: Just checking.']
        :['Customer.','Rick: Nobody asked.','Dad: Still true.']);
    }

    display(){
      if(state.quest===Q.WRISTBAND&&state.access){
        say('LAURA',LINES.pickup,()=>{
          state.wristband=true;
          state.quest=Q.RETURN_WILL;
          this.wristbandVisual?.setVisible(false);
          refreshUI();
          const pulse=this.add.circle(760,300,22,0xff4fa3,.18).setStrokeStyle(5,0xff4fa3,1).setDepth(70);
          this.tweens.add({targets:pulse,scale:4,alpha:0,duration:420,onComplete:()=>pulse.destroy()});
        });
      }else if(state.quest===Q.ACCESS_DISPLAY){
        say('RICK',['Apparently this is “staff only”.','Laura: Your turn, bullshit artist.']);
      }else if(state.quest===Q.CALL_BS){
        say('LAURA',['Will is lying about where it is.','CALL BS first.']);
      }else say('RICK',['Kendal memorabilia. Some memories sold separately.']);
    }

    useAbility(){
      if(dialogue)return;
      if(state.hero==='laura'&&state.quest===Q.CALL_BS){
        say('LAURA',LINES.lauraBs,()=>{state.quest=Q.ACCESS_DISPLAY;this.wristbandVisual?.setVisible(true);refreshUI();});
        return;
      }
      if(state.hero==='rick'&&state.quest===Q.ACCESS_DISPLAY){
        say('RICK',LINES.rickBs,()=>{state.access=true;state.quest=Q.WRISTBAND;this.wristbandVisual?.setVisible(true);refreshUI();});
        return;
      }
      const n=this.nearest();
      if(n?.id==='dad')this.dad();
      else if(n?.id==='will')say(state.hero.toUpperCase(),state.hero==='rick'?['Rick: This whole arrangement is ridiculous.','Will: Yet here you are.']:['Laura: Bullshit.','Will: Very broad use of the ability there.']);
      else say(state.hero.toUpperCase(),state.hero==='rick'?['Nothing worth bullshitting here.']:['Nothing currently deserves the full CALL BS.']);
    }

    doAct(){
      if(advanceDialogue())return;
      const n=this.nearest();
      n?.act?.();
    }

    swap(){
      if(dialogue)return;
      state.hero=state.hero==='rick'?'laura':'rick';
      if(this.actor) applyHeroVisual(this.actor,state.hero,this.actor.heroDir||'down',false,0);
      refreshUI();
    }

    runAutotest(){
      state.quest=Q.TALK_WILL;
      this.will();
      while(dialogue)advanceDialogue();
      state.hero='laura';
      this.useAbility();
      while(dialogue)advanceDialogue();
      state.hero='rick';
      this.useAbility();
      while(dialogue)advanceDialogue();
      this.display();
      while(dialogue)advanceDialogue();
      this.will();
      while(dialogue)advanceDialogue();
      document.body.dataset.autoTest=state.quest+':wristband='+state.wristband+':access='+state.access;
    }

    update(_,dtMs){
      if(dialogue)return;
      const dt=Math.min(.034,dtMs/1000);
      let x=stick.x,y=stick.y;
      const speed=245;
      const m=Math.hypot(x,y);
      if(m>.01){x/=Math.max(1,m);y/=Math.max(1,m);}
      this.actor.setVelocity(x*speed,y*speed);
      const moving=Math.abs(x)+Math.abs(y)>.05;
      let dir=this.actor.heroDir||'down';
      if(moving) dir=Math.abs(x)>Math.abs(y)?(x<0?'left':'right'):(y<0?'up':'down');
      applyHeroVisual(this.actor,state.hero,dir,moving,dt);
      const n=this.nearest();
      if(n){ui.prompt.textContent='ACT · '+n.label;ui.prompt.classList.remove('hidden');}
      else ui.prompt.classList.add('hidden');
    }
  }

  const config={
    type:Phaser.AUTO,
    parent:'game',
    backgroundColor:'#090b10',
    scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:1600,height:900},
    physics:{default:'arcade',arcade:{gravity:{x:0,y:0},debug:false}},
    render:{antialias:true,roundPixels:false},
    scene:[Boot,Exterior,Tap]
  };
  new Phaser.Game(config);

  ui.act.addEventListener('pointerdown',e=>{e.preventDefault();current?.doAct();});
  ui.swap.addEventListener('pointerdown',e=>{e.preventDefault();current?.swap();});
  ui.ability.addEventListener('pointerdown',e=>{e.preventDefault();current?.useAbility();});

  let pointerId=null,origin={x:0,y:0};const MAX=44;
  window.addEventListener('pointerdown',e=>{
    if(dialogue||pointerId!==null||e.clientX>innerWidth*.48||e.target.closest?.('button'))return;
    pointerId=e.pointerId;origin={x:e.clientX,y:e.clientY};
    ui.joystick.style.left=e.clientX+'px';ui.joystick.style.top=e.clientY+'px';
    ui.joystick.classList.remove('hidden');ui.moveGhost.style.opacity='.18';
  },{passive:false});
  window.addEventListener('pointermove',e=>{
    if(e.pointerId!==pointerId)return;
    let dx=e.clientX-origin.x,dy=e.clientY-origin.y;const d=Math.hypot(dx,dy);
    if(d>MAX){dx=dx/d*MAX;dy=dy/d*MAX;}
    stick.x=dx/MAX;stick.y=dy/MAX;
    ui.knob.style.transform=`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px))`;
  },{passive:false});
  const end=e=>{if(e.pointerId!==pointerId)return;pointerId=null;stick.x=stick.y=0;ui.joystick.classList.add('hidden');ui.knob.style.transform='translate(-50%,-50%)';ui.moveGhost.style.opacity='.55';};
  window.addEventListener('pointerup',end,{passive:false});window.addEventListener('pointercancel',end,{passive:false});

  ['gesturestart','gesturechange','gestureend','dblclick'].forEach(t=>document.addEventListener(t,e=>e.preventDefault(),{passive:false}));
  document.addEventListener('touchmove',e=>{if(e.touches?.length>1)e.preventDefault();},{passive:false});

  refreshUI();
})();