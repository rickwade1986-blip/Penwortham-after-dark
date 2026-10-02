(() => {
  'use strict';

  const P = new URLSearchParams(location.search);
  const DEV = P.get('dev') === '1' || P.get('test') === '1';

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

  function say(speaker, lines, done) {
    dialogue={speaker,lines:[...lines],index:0,done:done||null};
    ui.speaker.textContent=speaker;
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
      this.load.image('tap-bg','./assets/environments/tap-interior-candidate-01.jpg');
    }
    create(){this.scene.start('Tap')}
  }

  class Tap extends Phaser.Scene {
    constructor(){super('Tap')}
    create(){
      current=this;
      this.physics.world.setBounds(0,0,1600,900);
      this.cameras.main.setBounds(0,0,1600,900);
      this.add.image(800,450,'tap-bg').setDisplaySize(1600,900).setDepth(-20);

      // Production collision map derived from the first approved room composition.
      this.solids=this.physics.add.staticGroup();
      const wall=(x,y,w,h)=>{
        const r=this.add.rectangle(x,y,w,h,0x000000,0);
        this.physics.add.existing(r,true);
        this.solids.add(r);
      };
      wall(355,455,620,360);   // bar
      wall(1030,460,245,150);  // centre table
      wall(1085,705,260,160);  // lower table
      wall(1020,245,220,150);  // stove/snug furniture

      // DEV-only actor. Shipping build will refuse to use this once approved sprite art lands.
      this.actor=this.physics.add.circle ? null : null;
      this.actor=this.physics.add.sprite(860,760);
      const g=this.add.graphics().setDepth(50);
      g.fillStyle(DEV?0xb6ff3b:0x000000,DEV?0.85:0);
      g.fillCircle(0,0,22);
      g.lineStyle(DEV?4:0,0x0b0d12,1);
      g.strokeCircle(0,0,22);
      const tex='v5-dev-actor';
      if(!this.textures.exists(tex)){g.generateTexture(tex,52,52);g.destroy();}
      else g.destroy();
      this.actor.setTexture(tex).setDepth(50).setCollideWorldBounds(true);
      this.actor.body.setCircle(18);
      this.physics.add.collider(this.actor,this.solids);

      this.cameras.main.startFollow(this.actor,true,.12,.12);
      this.cameras.main.setZoom(1);
      this.cameras.main.centerOn(800,450);

      this.hotspots=[
        {id:'will',x:520,y:390,r:105,label:'WILL',act:()=>this.will()},
        {id:'denise',x:770,y:535,r:90,label:'DENISE',act:()=>this.denise()},
        {id:'dad',x:1210,y:575,r:90,label:'DAD',act:()=>this.dad()},
        {id:'display',x:1280,y:270,r:110,label:'KENDAL DISPLAY',act:()=>this.display()}
      ];

      if(DEV){
        this.markers=this.add.graphics().setDepth(20);
        this.markers.lineStyle(3,0xff4fa3,.45);
        for(const h of this.hotspots)this.markers.strokeCircle(h.x,h.y,h.r);
      }

      document.body.dataset.v5Ready='true';
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
          refreshUI();
          const pulse=this.add.circle(1280,270,22,0xff4fa3,.18).setStrokeStyle(5,0xff4fa3,1).setDepth(70);
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
        say('LAURA',LINES.lauraBs,()=>{state.quest=Q.ACCESS_DISPLAY;refreshUI();});
        return;
      }
      if(state.hero==='rick'&&state.quest===Q.ACCESS_DISPLAY){
        say('RICK',LINES.rickBs,()=>{state.access=true;state.quest=Q.WRISTBAND;refreshUI();});
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
    scene:[Boot,Tap]
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