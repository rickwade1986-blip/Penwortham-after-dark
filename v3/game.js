(() => {
  'use strict';

  const SAVE_KEY='penwortham-after-dark-v3-1';

  const Q={
    CAR:'CAR',
    GLASSES:'GLASSES',
    MILK:'MILK',
    WILL:'WILL',
    DENISE:'DENISE',
    TURKISH:'TURKISH',
    FATS:'FATS',
    BOSS:'BOSS',
    DONE:'DONE'
  };

  const OBJECTIVES={
    [Q.CAR]:"Find Rick's car",
    [Q.GLASSES]:'Now find the glasses, genius',
    [Q.MILK]:'Behbeh, we need milk too',
    [Q.WILL]:'Go to Tap & Vine. Find Will.',
    [Q.DENISE]:'Find Denise. She knows everything.',
    [Q.TURKISH]:'Get some food at The Turkish',
    [Q.FATS]:'FATS has had a roast incident. Find him.',
    [Q.BOSS]:'De-pout FATS',
    [Q.DONE]:'Go somewhere stupidly expensive for a water'
  };

  const HERO={
    rick:{name:'RICK',accent:'#b6ff3b',ability:'BULLSHIT',speed:1.04},
    laura:{name:'LAURA',accent:'#ff4fa3',ability:'CALL BS',speed:.99}
  };

  const freshState=()=>({
    hero:'rick',
    hp:6,
    maxHp:6,
    quest:Q.CAR,
    room:'street',
    items:{car:false,glasses:false,milk:false,wine:false,beat:false},
    flags:{will:false,denise:false,dad:false,kendal:false,turkish:false},
    bossHp:36
  });

  function loadState(){
    const params=new URLSearchParams(location.search);
    if(params.get('reset')==='1'){
      localStorage.removeItem(SAVE_KEY);
      history.replaceState({},'',location.pathname);
    }
    try{
      const raw=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');
      if(!raw)return freshState();
      const f=freshState();
      return {...f,...raw,items:{...f.items,...(raw.items||{})},flags:{...f.flags,...(raw.flags||{})}};
    }catch{return freshState()}
  }

  const state=loadState();
  const save=()=>{
    try{localStorage.setItem(SAVE_KEY,JSON.stringify(state))}catch{}
    uiRefresh();
  };

  const ui={
    objective:document.getElementById('objective'),
    heroName:document.getElementById('hero-name'),
    hp:document.getElementById('hp'),
    nearby:document.getElementById('nearby'),
    dialogue:document.getElementById('dialogue'),
    portrait:document.getElementById('portrait'),
    speaker:document.getElementById('speaker'),
    line:document.getElementById('line'),
    toast:document.getElementById('toast'),
    swap:document.getElementById('swap'),
    act:document.getElementById('act'),
    ability:document.getElementById('ability'),
    joystick:document.getElementById('joystick'),
    knob:document.getElementById('knob'),
    moveHint:document.getElementById('move-hint')
  };

  let activeScene=null;
  let dialogueState=null;
  let toastTimer=null;
  const moveInput={x:0,y:0};

  function uiRefresh(){
    const h=HERO[state.hero];
    ui.objective.textContent=OBJECTIVES[state.quest]||'Cause avoidable chaos';
    ui.heroName.textContent=h.name;
    ui.heroName.style.color=h.accent;
    ui.hp.textContent='♥'.repeat(Math.max(0,state.hp))+'♡'.repeat(Math.max(0,state.maxHp-state.hp));
    const bossMode=activeScene?.roomKey==='fats'&&activeScene?.bossActive;
    ui.ability.textContent=bossMode?(state.hero==='rick'?'BARS':'RIFF'):h.ability;
  }

  function toast(text,ms=950){
    ui.toast.textContent=text;
    ui.toast.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>ui.toast.classList.add('hidden'),ms);
  }

  const portraitPath=name=>{
    const n=(name||'').toUpperCase();
    if(n.includes('RICK'))return './assets/characters/rick-down-0.png';
    if(n.includes('LAURA'))return './assets/characters/laura-down-0.png';
    if(n==='DAD')return './assets/characters/dad.png';
    if(n==='WILL')return './assets/characters/will.png';
    if(n==='DENISE')return './assets/characters/denise.png';
    if(n.includes('FATS'))return './assets/characters/fats.png';
    if(n.includes('3000'))return './assets/characters/andrew.png';
    return '';
  };

  function setPortrait(name){
    ui.portrait.innerHTML='';
    const src=portraitPath(name);
    if(src){
      const img=document.createElement('img');
      img.src=src;
      img.alt='';
      ui.portrait.appendChild(img);
    }else{
      const span=document.createElement('span');
      span.textContent=(name||'?').split(/\s+/).map(x=>x[0]).join('').slice(0,3);
      ui.portrait.appendChild(span);
    }
  }

  function say(name,lines,onDone){
    dialogueState={name,lines:[...lines],index:0,onDone:onDone||null};
    ui.speaker.textContent=name||'';
    ui.line.textContent=dialogueState.lines[0]||'';
    setPortrait(name);
    ui.dialogue.classList.remove('hidden');
    moveInput.x=0;moveInput.y=0;
    resetJoystick();
    activeScene?.freezeForDialogue();
  }

  function advanceDialogue(){
    if(!dialogueState)return false;
    dialogueState.index++;
    if(dialogueState.index>=dialogueState.lines.length){
      const done=dialogueState.onDone;
      dialogueState=null;
      ui.dialogue.classList.add('hidden');
      activeScene?.resumeAfterDialogue();
      done?.();
      uiRefresh();
    }else{
      ui.line.textContent=dialogueState.lines[dialogueState.index];
    }
    return true;
  }

  const D={
    car:{
      rick:['Found it.','Laura: The large blue car? Extraordinary detective work.'],
      laura:['There. Your car.','Rick: I knew where it was.','Laura: Course you did.']
    },
    glasses:{
      rick:['And the glasses.','Laura: Object permanence. Massive day for you.'],
      laura:['They were basically next to the car.','Rick: I was doing a sweep.','Laura: Die.']
    },
    milk:{
      rick:['Milk acquired.','Laura: We bought one thing. Do not get emotional.'],
      laura:['Milk.','Rick: Look at us. Functioning adults.','Laura: Do not push it.']
    },
    will:{
      rick:["Will: When you're in the Tap, you're a pub.","Rick: That's still not a sentence, Will.","Will: It doesn't need to be."],
      laura:["Will: When you're in the Tap, you're a pub.","Laura: Will, what the fuck does that mean?",'Will: Exactly.']
    },
    denise:{
      rick:['Denise: Kendal again next year then?',"Rick: Apparently I've already agreed.","Denise: You have now."],
      laura:['Denise: Kendal again next year then?','Laura: Obviously.',"Denise: Good. Wasn't asking."]
    },
    dad:{
      rick:['Dad: You lost the car again?','Rick: Temporarily misplaced.',"Dad: That's not a personality trait, son."],
      laura:['Dad: You keeping him organised then?',"Laura: I've tried systems.",'Dad: Brave.']
    },
    kendal:['Denise: I remember this bit.','Laura: No you do not.','Denise: Correct. That is why it was good.'],
    andrew:['Got a beat for you.','Rick: Why are you called Prince Andrew 3000?','Move on.'],
    turkish:{
      rick:['Rick: We ordered for two.',"Laura: There's enough lamb here to destabilise a small economy.",'Rick: Leftovers?','Laura: Behave.'],
      laura:["Laura: I said we'd order sensibly.",'Rick: We have.','Laura: There are six plates of bread alone.']
    },
    fatsPhone:['FATS: First pub. No roast.','FATS: Second pub. Twenty-minute wait.','Rick: Oh no.','Laura: He is going to make this everyone else’s problem.'],
    fatsIntro:['First pub: no roast.','Second pub: twenty-minute wait.',"So yes, obviously, we're fighting."],
    fatsPhase2:['Fine.','PAD THAI MODE.'],
    fatsWin:['Laura: Was all that genuinely about a roast?',"Rick: Don't.",'FATS: It was about respect.']
  };

  const ROOMS={
    street:{
      key:'street',bg:'room-street',w:2200,h:1400,spawn:{x:1100,y:980},
      obstacles:[
        {x:120,y:710,w:490,h:290},
        {x:1610,y:670,w:515,h:330},
        {x:700,y:360,w:800,h:450}
      ]
    },
    shop:{
      key:'shop',bg:'room-shop',w:1800,h:1100,spawn:{x:900,y:930},
      obstacles:[
        {x:130,y:250,w:410,h:590},
        {x:665,y:270,w:440,h:520},
        {x:1190,y:270,w:440,h:235}
      ]
    },
    tap:{
      key:'tap',bg:'room-tap',w:1800,h:1100,spawn:{x:900,y:930},
      obstacles:[
        {x:150,y:285,w:1500,h:260},
        {x:200,y:655,w:290,h:185},
        {x:755,y:700,w:290,h:185},
        {x:1305,y:635,w:290,h:185}
      ]
    },
    kendal:{
      key:'kendal',bg:'room-kendal',w:1800,h:1100,spawn:{x:900,y:880},
      obstacles:[]
    },
    turkish:{
      key:'turkish',bg:'room-turkish',w:1800,h:1100,spawn:{x:900,y:960},
      obstacles:[
        {x:1120,y:95,w:510,h:285},
        {x:200,y:555,w:420,h:220},
        {x:670,y:650,w:460,h:240},
        {x:1195,y:552,w:410,h:220}
      ]
    },
    fats:{
      key:'fats',bg:'room-fats',w:1800,h:1100,spawn:{x:900,y:930},
      obstacles:[]
    }
  };

  class BootScene extends Phaser.Scene{
    constructor(){super('Boot')}
    preload(){
      for(const hero of ['rick','laura']){
        for(const dir of ['down','up','right']){
          for(let f=0;f<2;f++)this.load.image(`${hero}-${dir}-${f}`,`./assets/characters/${hero}-${dir}-${f}.png`);
        }
      }
      for(const n of ['dad','will','denise','fats','andrew'])this.load.image(`npc-${n}`,`./assets/characters/${n}.png`);
      for(const r of ['street','shop','tap','turkish','kendal','fats'])this.load.image(`room-${r}`,`./assets/rooms/${r}.png`);
    }
    create(){
      this.scene.start('Room',{room:state.room||'street'});
    }
  }

  class RoomScene extends Phaser.Scene{
    constructor(){super('Room')}
    init(data){
      this.roomKey=data.room||state.room||'street';
      this.room=ROOMS[this.roomKey]||ROOMS.street;
      this.interactables=[];
      this.npcs=[];
      this.direction='down';
      this.frame=0;
      this.stepClock=0;
      this.attackLock=0;
      this.hurtLock=0;
      this.bossActive=false;
      this.bossPhase=1;
      this.bossCooldown=1;
      this.boss=null;
    }

    create(){
      activeScene=this;
      state.room=this.roomKey;
      save();

      this.physics.world.setBounds(0,0,this.room.w,this.room.h);
      this.cameras.main.setBounds(0,0,this.room.w,this.room.h);
      this.cameras.main.setBackgroundColor('#111318');
      this.add.image(this.room.w/2,this.room.h/2,this.room.bg).setDisplaySize(this.room.w,this.room.h).setDepth(-100);

      this.keys=this.input.keyboard?.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,E,K,SPACE');

      const spawn=this.room.spawn;
      this.player=this.physics.add.sprite(spawn.x,spawn.y,'rick-down-0').setDepth(100);
      this.player.setCollideWorldBounds(true);
      this.player.body.setSize(125,80,true);
      this.player.setScale(.38);

      this.createWalls();
      this.createRoomContent();

      this.cameras.main.startFollow(this.player,true,.095,.095);
      this.applyCameraZoom();

      window.addEventListener('resize',()=>this.applyCameraZoom(),{once:false});
      uiRefresh();
      this.updateHeroTexture(true);
      document.body.dataset.gameReady='true';
      document.body.dataset.room=this.roomKey;

      if(this.roomKey==='street'&&!state.flags.intro){
        state.flags.intro=true;save();
        this.time.delayedCall(250,()=>say('RICK + LAURA',["It's Rick from the weird friends app btw.",'Laura: I gathered that, yeah.']));
      }
    }

    applyCameraZoom(){
      const vw=this.scale.width||innerWidth;
      const vh=this.scale.height||innerHeight;
      const fit=Math.min(vw/this.room.w,vh/this.room.h);
      const target=this.roomKey==='street'
        ?Math.max(.68,Math.min(.78,fit*1.22))
        :Math.max(.76,Math.min(.90,fit*1.18));
      this.cameras.main.setZoom(target);
    }

    createWalls(){
      const walls=[];
      const make=(x,y,w,h)=>{
        const r=this.add.rectangle(x+w/2,y+h/2,w,h,0x000000,0);
        this.physics.add.existing(r,true);
        this.physics.add.collider(this.player,r);
        walls.push(r);
      };
      (this.room.obstacles||[]).forEach(o=>make(o.x,o.y,o.w,o.h));
      this._walls=walls;
    }

    addNPC(name,key,x,y,scale=.36){
      const s=this.physics.add.sprite(x,y,`npc-${key}`).setScale(scale).setDepth(110);
      s.body.setImmovable(true);
      s.body.setSize(125,82,true);
      this.physics.add.collider(this.player,s);
      this.npcs.push(s);
      return s;
    }

    addInteractable(def){
      this.interactables.push(def);
      return def;
    }

    createRoomContent(){
      if(this.roomKey==='street')this.createStreet();
      if(this.roomKey==='shop')this.createShop();
      if(this.roomKey==='tap')this.createTap();
      if(this.roomKey==='kendal')this.createKendal();
      if(this.roomKey==='turkish')this.createTurkish();
      if(this.roomKey==='fats')this.createFats();
    }

    createStreet(){
      // A small physical pair of glasses. First quest items are unmistakably separate.
      const gl=this.add.container(560,1080).setDepth(60);
      const g=this.add.graphics();
      g.lineStyle(7,0xeaf2ff,1);g.strokeCircle(-24,0,18);g.strokeCircle(24,0,18);g.lineBetween(-6,0,6,0);
      gl.add(g);
      this.tweens.add({targets:gl,y:'-=10',alpha:{from:.55,to:1},duration:620,yoyo:true,repeat:-1});

      this.addInteractable({
        id:'car',x:420,y:1160,r:145,label:'CAR',
        act:()=>{
          if(state.quest===Q.CAR){
            state.items.car=true;state.quest=Q.GLASSES;save();
            say(state.hero.toUpperCase(),D.car[state.hero],()=>this.fxPulse(420,1160,'#b6ff3b'));
          }else say('RICK',['Yep. Still the car. Miraculous.']);
        }
      });

      this.addInteractable({
        id:'glasses',x:560,y:1080,r:110,label:'GLASSES',
        act:()=>{
          if(state.quest===Q.CAR){
            say('LAURA',['Car first. Then the tiny transparent objects.']);
            return;
          }
          if(state.quest===Q.GLASSES){
            state.items.glasses=true;state.quest=Q.MILK;save();
            say(state.hero.toUpperCase(),D.glasses[state.hero],()=>this.fxPulse(560,1080,'#eaf2ff'));
          }else say('RICK',['They remain glasses. I checked.']);
        }
      });

      this.addInteractable({
        id:'coffee',x:340,y:995,r:105,label:'4AM COFFEE',
        act:()=>{
          const lines=state.hero==='rick'
            ?['Coffee?','Laura: It is nearly 4am.','Rick: So that is a yes.']
            :['No.','Rick: You did not even ask what I wanted.','Laura: Coffee. At 4am. No.'];
          say(state.hero.toUpperCase(),lines);
        }
      });

      this.addInteractable({
        id:'shop',x:170,y:1240,r:150,label:'LEYLAND ROAD STORES',
        enabled:()=>state.quest!==Q.CAR&&state.quest!==Q.GLASSES,
        locked:()=>state.quest===Q.CAR||state.quest===Q.GLASSES,
        act:()=>this.go('shop'),
        lockedAct:()=>say('LAURA',['Car. Glasses. Then milk.','One crisis at a time.'])
      });

      this.addInteractable({
        id:'tap',x:1760,y:980,r:150,label:'TAP & VINE',
        enabled:()=>![Q.CAR,Q.GLASSES,Q.MILK].includes(state.quest),
        locked:()=>[Q.CAR,Q.GLASSES,Q.MILK].includes(state.quest),
        act:()=>this.go('tap'),
        lockedAct:()=>say('LAURA',['Milk first.','Rick: The Tap is basically hydration.','Laura: No.'])
      });

      this.addInteractable({
        id:'turkish',x:1940,y:1230,r:155,label:'THE TURKISH',
        enabled:()=>[Q.TURKISH,Q.FATS,Q.BOSS,Q.DONE].includes(state.quest),
        locked:()=>![Q.TURKISH,Q.FATS,Q.BOSS,Q.DONE].includes(state.quest),
        act:()=>this.go('turkish'),
        lockedAct:()=>say('RICK',['Food?','Laura: We literally have a task.','Rick: Food is a task.'])
      });

      this.addInteractable({
        id:'fats',x:1100,y:1320,r:145,label:'PAD THAI PALACE',
        enabled:()=>[Q.FATS,Q.BOSS,Q.DONE].includes(state.quest),
        locked:()=>false,
        act:()=>this.go('fats')
      });

      if([Q.FATS,Q.BOSS,Q.DONE].includes(state.quest)){
        const sign=this.add.text(1100,1280,'PAD THAI PALACE ↓',{fontFamily:'Bangers',fontSize:'26px',color:'#ff7b85',stroke:'#17131b',strokeThickness:6}).setOrigin(.5).setDepth(65);
        this.tweens.add({targets:sign,alpha:{from:.6,to:1},duration:700,yoyo:true,repeat:-1});
      }
    }

    createShop(){
      this.addInteractable({
        id:'milk',x:340,y:520,r:145,label:'MILK',
        act:()=>{
          if(state.quest!==Q.MILK){
            say('LAURA',['We have milk.','Against all odds.']);
            return;
          }
          state.items.milk=true;state.quest=Q.WILL;save();
          say(state.hero.toUpperCase(),D.milk[state.hero],()=>this.fxPulse(340,520,'#75bdd5'));
        }
      });

      this.addInteractable({
        id:'till',x:1420,y:500,r:150,label:'TILL',
        ability:hero=>{
          say(hero.toUpperCase(),hero==='rick'
            ?['Rick: I can probably get us a discount.','Laura: On milk?','Rick: You lack vision.']
            :['Laura: That sign says no more coffee.','Rick: Targeted harassment.']);
        }
      });

      this.addInteractable({id:'out',x:900,y:1010,r:150,label:'OUT',act:()=>this.go('street',{x:250,y:1220})});
    }

    createTap(){
      this.will=this.addNPC('Will','will',650,610,.34);
      this.denise=this.addNPC('Denise','denise',1020,610,.35);
      this.dad=this.addNPC('Dad','dad',1450,830,.34);

      this.addInteractable({
        id:'will',x:650,y:610,r:130,label:'WILL',
        act:()=>{
          say('WILL',D.will[state.hero],()=>{
            state.flags.will=true;
            if(state.quest===Q.WILL)state.quest=Q.DENISE;
            save();
          });
        },
        ability:hero=>{
          say(hero.toUpperCase(),hero==='rick'
            ?['Rick: Explain the pub sentence.','Will: No. It loses power.']
            :['Laura: Calling bullshit on that entire sentence.','Will: Yet you understood it.']);
        }
      });

      this.addInteractable({
        id:'denise',x:1020,y:610,r:135,label:'DENISE',
        act:()=>{
          if(state.quest===Q.WILL&&!state.flags.will){
            say('DENISE',['Speak to Will first.','He has been dying to say the pub thing.']);
            return;
          }
          say('DENISE',D.denise[state.hero],()=>{
            state.flags.denise=true;
            state.items.wine=true;
            if(state.quest===Q.DENISE)state.quest=Q.TURKISH;
            save();
          });
        },
        ability:hero=>{
          say(hero.toUpperCase(),hero==='rick'
            ?['Rick: Kendal was calm last time.','Denise: That is an outrageous lie.']
            :['Laura: We are absolutely going again.','Denise: Finally, someone sensible.']);
        }
      });

      this.addInteractable({
        id:'dad',x:1450,y:830,r:140,label:'DAD',
        act:()=>{
          say('DAD',D.dad[state.hero],()=>{state.flags.dad=true;save();});
        }
      });

      this.addInteractable({
        id:'kendal',x:1340,y:580,r:120,label:'KENDAL WALL',
        act:()=>this.go('kendal')
      });

      this.addInteractable({
        id:'wine',x:1100,y:930,r:110,label:'SAUVIGNON',
        act:()=>{
          if(state.hero==='laura'){
            state.items.wine=true;save();toast('TACTICAL SAUVIGNON ACQUIRED');
            this.fxPulse(1100,930,'#f4efe8');
          }else say('RICK',['That is very obviously Laura’s.','I value my life.']);
        }
      });

      this.addInteractable({id:'out',x:900,y:1030,r:150,label:'OUT',act:()=>this.go('street',{x:1770,y:1010})});
    }

    createKendal(){
      this.andrew=this.addNPC('Prince Andrew 3000','andrew',900,560,.35);
      this.addInteractable({
        id:'andrew',x:900,y:560,r:145,label:'PRINCE ANDREW 3000',
        act:()=>{
          if(!state.items.beat){
            say('PRINCE ANDREW 3000',D.andrew,()=>{
              state.items.beat=true;state.flags.kendal=true;save();toast('DUSTY BEAT ACQUIRED');
              this.fxPulse(900,560,'#f2c764');
            });
          }else say('PRINCE ANDREW 3000',['Move on.']);
        }
      });
      this.addInteractable({id:'back',x:900,y:1010,r:160,label:'BACK TO TAP',act:()=>this.go('tap',{x:1320,y:790})});
      if(!state.flags.kendal)this.time.delayedCall(300,()=>say('DENISE',D.kendal));
    }

    createTurkish(){
      this.addInteractable({
        id:'food',x:900,y:770,r:190,label:'THE FEAST',
        act:()=>{
          if(![Q.TURKISH,Q.FATS,Q.BOSS,Q.DONE].includes(state.quest)){
            say('LAURA',['We can eat later.','We are pretending to have structure.']);
            return;
          }
          if(!state.flags.turkish){
            say(state.hero.toUpperCase(),D.turkish[state.hero],()=>{
              state.flags.turkish=true;state.quest=Q.FATS;save();
              this.time.delayedCall(260,()=>say('PHONE — FATS',D.fatsPhone));
            });
          }else say('RICK',['I physically cannot eat another thing.','Laura: Give it seven minutes.']);
        },
        ability:hero=>{
          say(hero.toUpperCase(),hero==='rick'
            ?['Rick: This is exactly what we ordered.','WAITER: It absolutely is not.','Rick: See? Agreement.']
            :['Laura: That is not two portions.','WAITER: Turkish two portions.','Laura: Ah. Fair.']);
        }
      });

      this.addInteractable({id:'out',x:900,y:1020,r:155,label:'OUT',act:()=>this.go('street',{x:1940,y:1230})});
    }

    createFats(){
      this.fats=this.addNPC('FATS','fats',900,540,.36);
      this.fats.body.setImmovable(false);
      this.fats.setCollideWorldBounds(true);

      this.addInteractable({
        id:'fats',x:900,y:540,r:155,label:'FATS',
        enabled:()=>!this.bossActive&&state.quest!==Q.DONE,
        act:()=>{
          if(state.quest===Q.FATS||state.quest===Q.BOSS){
            say('FATS',D.fatsIntro,()=>this.startBoss());
          }else say('FATS',['Not now.','I am processing the roast situation.']);
        }
      });

      this.addInteractable({
        id:'out',x:900,y:1020,r:150,label:'OUT',
        enabled:()=>!this.bossActive,
        act:()=>this.go('street',{x:1100,y:1240})
      });

      if(state.quest===Q.BOSS)this.startBoss(false);
      if(state.quest===Q.DONE)this.fats.setTint(0x777777);
    }

    nearest(){
      let best=null,bestD=Infinity;
      for(const i of this.interactables){
        const enabled=i.enabled?i.enabled():true;
        const locked=i.locked?i.locked():false;
        if(!enabled&&!locked)continue;
        const d=Phaser.Math.Distance.Between(this.player.x,this.player.y,i.x,i.y);
        if(d<(i.r||110)&&d<bestD){best={...i,locked:!enabled&&locked};bestD=d}
      }
      return best;
    }

    act(){
      if(dialogueState)return;
      const n=this.nearest();
      if(!n)return;
      if(n.locked){n.lockedAct?.();return}
      n.act?.();
    }

    ability(){
      if(dialogueState)return;
      if(this.roomKey==='fats'&&this.bossActive){
        if(this.attackLock>0)return;
        if(state.hero==='rick')this.rickAttack();
        else this.lauraAttack();
        return;
      }
      const n=this.nearest();
      if(n?.ability){n.ability(state.hero);return}
      say(state.hero.toUpperCase(),state.hero==='rick'
        ?['I can bullshit my way through something here.','There is currently fuck all to bullshit.']
        :['Bullshit.','Rick: On what?','Laura: Vibes.']);
    }

    swap(){
      if(dialogueState)return;
      state.hero=state.hero==='rick'?'laura':'rick';
      this.frame=0;this.direction='down';
      save();this.updateHeroTexture(true);
      toast(state.hero==='rick'?'RICK IN':'LAURA IN',550);
    }

    go(room,spawnOverride){
      if(dialogueState)return;
      state.room=room;save();
      this.cameras.main.fadeOut(160,0,0,0);
      this.time.delayedCall(170,()=>{
        if(spawnOverride)ROOMS[room].spawn={...spawnOverride};
        this.scene.restart({room});
      });
    }

    freezeForDialogue(){
      this.player?.setVelocity(0,0);
      this.fats?.setVelocity(0,0);
      this.physics.world.pause();
    }

    resumeAfterDialogue(){
      this.physics.world.resume();
    }

    updateHeroTexture(force=false){
      const side=this.direction==='left'||this.direction==='right';
      const dir=side?'right':this.direction;
      const key=`${state.hero}-${dir}-${this.frame}`;
      if(force||this.player.texture.key!==key)this.player.setTexture(key);
      this.player.setFlipX(this.direction==='left');
      this.player.setScale(state.hero==='laura'?.36:.37);
      this.player.body.setSize(125,80,true);
    }

    fxPulse(x,y,color){
      const c=Phaser.Display.Color.HexStringToColor(color).color;
      const r=this.add.circle(x,y,18,c,.08).setStrokeStyle(4,c,.9).setDepth(300);
      this.tweens.add({targets:r,scale:4,alpha:0,duration:430,onComplete:()=>r.destroy()});
    }

    startBoss(announce=true){
      if(this.bossActive||state.quest===Q.DONE)return;
      this.bossActive=true;
      state.quest=Q.BOSS;save();
      uiRefresh();
      this.bossHp=Math.max(1,state.bossHp||36);
      this.bossMax=36;
      this.bossPhase=this.bossHp<=18?2:1;
      this.bossCooldown=.8;
      this.physics.add.collider(this.player,this.fats);
      this.makeBossBar();
      if(announce)toast('SUNDAY ROAST INCIDENT',1100);
    }

    makeBossBar(){
      this.bossBarBg=this.add.rectangle(900,90,500,34,0x11131a,.94).setStrokeStyle(3,0xff6874).setDepth(600).setScrollFactor(0);
      this.bossBar=this.add.rectangle(662,90,476,18,0xff6874).setOrigin(0,.5).setDepth(601).setScrollFactor(0);
      this.bossBarText=this.add.text(900,57,this.bossPhase===1?'FATS — NORMAL POUT':'FATS — PAD THAI MODE',{fontFamily:'Bangers',fontSize:'23px',color:'#ff9aa2',stroke:'#17131b',strokeThickness:4}).setOrigin(.5).setDepth(601).setScrollFactor(0);
      this.updateBossBar();
    }

    updateBossBar(){
      if(!this.bossBar)return;
      this.bossBar.width=476*Math.max(0,this.bossHp/this.bossMax);
      this.bossBarText.setText(this.bossPhase===1?'FATS — NORMAL POUT':'FATS — PAD THAI MODE');
    }

    rickAttack(){
      this.attackLock=.26;
      const dx=this.direction==='left'?-1:this.direction==='right'?1:0;
      const dy=this.direction==='up'?-1:this.direction==='down'?1:0;
      const vx=dx||(!dy?1:0),vy=dy;
      const word=state.items.beat?'DUSTY BARS':'BARS';
      const t=this.add.text(this.player.x+vx*42,this.player.y-38+vy*42,word,{
        fontFamily:'Bangers',fontSize:'21px',color:'#11150a',backgroundColor:'#b6ff3b',padding:{x:8,y:4}
      }).setOrigin(.5).setDepth(320);
      this.physics.add.existing(t);
      t.body.setVelocity(vx*560,vy*560);
      t.damage=state.items.beat?2.6:1.8;
      this.physics.add.overlap(t,this.fats,()=>{if(t.active){t.destroy();this.hitBoss(t.damage)}});
      this.time.delayedCall(900,()=>t.active&&t.destroy());
    }

    lauraAttack(){
      this.attackLock=.38;
      const range=state.items.wine?255:215;
      const dmg=state.items.wine?4.0:3.1;
      for(let i=0;i<3;i++){
        const r=this.add.circle(this.player.x,this.player.y-20,20,0xff4fa3,.04).setStrokeStyle(5-i,0xff4fa3,.94-i*.18).setDepth(310);
        this.tweens.add({targets:r,scale:range/20,alpha:0,duration:240+i*70,delay:i*25,onComplete:()=>r.destroy()});
      }
      // Guitar exists only during the attack, not welded to Laura.
      const guitar=this.add.text(this.player.x+12,this.player.y-58,'🎸',{fontSize:'42px'}).setOrigin(.5).setDepth(315);
      this.tweens.add({targets:guitar,angle:18,scale:1.15,alpha:0,duration:310,onComplete:()=>guitar.destroy()});

      const d=Phaser.Math.Distance.Between(this.player.x,this.player.y,this.fats.x,this.fats.y);
      if(d<range){
        this.hitBoss(dmg);
        const a=Phaser.Math.Angle.Between(this.player.x,this.player.y,this.fats.x,this.fats.y);
        this.fats.setVelocity(Math.cos(a)*360,Math.sin(a)*360);
        this.time.delayedCall(120,()=>this.fats?.active&&this.fats.setVelocity(0,0));
      }
    }

    hitBoss(dmg){
      if(!this.bossActive)return;
      this.bossHp=Math.max(0,this.bossHp-dmg);
      state.bossHp=this.bossHp;save();
      this.updateBossBar();
      this.fats.setTintFill(0xffffff);
      this.cameras.main.shake(90,.006);
      this.time.delayedCall(75,()=>this.fats?.active&&this.fats.clearTint());

      if(this.bossPhase===1&&this.bossHp<=18){
        this.bossPhase=2;
        this.updateBossBar();
        say('FATS',D.fatsPhase2);
      }
      if(this.bossHp<=0)this.winBoss();
    }

    bossShot(){
      if(!this.bossActive||dialogueState)return;
      const angle=Phaser.Math.Angle.Between(this.fats.x,this.fats.y,this.player.x,this.player.y);
      const count=this.bossPhase===2?3:1;
      for(let i=0;i<count;i++){
        const a=angle+(i-(count-1)/2)*.28;
        const p=this.add.circle(this.fats.x,this.fats.y-35,18,0xeadfce).setStrokeStyle(4,0x915d42).setDepth(280);
        this.physics.add.existing(p);
        p.body.setCircle(18);
        p.body.setVelocity(Math.cos(a)*(this.bossPhase===2?345:260),Math.sin(a)*(this.bossPhase===2?345:260));
        this.physics.add.overlap(p,this.player,()=>{if(p.active){p.destroy();this.hurtPlayer()}});
        this.time.delayedCall(2800,()=>p.active&&p.destroy());
      }
    }

    hurtPlayer(){
      if(this.hurtLock>0||dialogueState||!this.bossActive)return;
      this.hurtLock=.85;
      state.hp=Math.max(0,state.hp-1);save();
      this.player.setTint(0xff6874);
      this.cameras.main.shake(140,.012);
      this.time.delayedCall(130,()=>this.player?.clearTint());
      if(state.hp<=0){
        state.hp=state.maxHp;state.bossHp=36;save();
        this.bossActive=false;
        say('FATS',['Beaten by a roast dispute. Grim.'],()=>this.go('street',{x:1100,y:1200}));
      }
    }

    winBoss(){
      if(!this.bossActive)return;
      this.bossActive=false;
      state.quest=Q.DONE;state.bossHp=0;save();
      this.fats.setVelocity(0,0);
      this.cameras.main.shake(450,.018);
      this.time.delayedCall(420,()=>{
        say('FATS',D.fatsWin,()=>{
          this.fats.setTint(0x777777);
          this.bossBarBg?.destroy();this.bossBar?.destroy();this.bossBarText?.destroy();
          toast('ACHIEVEMENT: SILLY BULLSHIT BITCH',2200);
        });
      });
    }

    update(_,dtMs){
      if(!this.player)return;
      const dt=Math.min(.034,dtMs/1000);
      this.attackLock=Math.max(0,this.attackLock-dt);
      this.hurtLock=Math.max(0,this.hurtLock-dt);

      if(dialogueState){
        ui.nearby.classList.add('hidden');
        return;
      }

      let x=moveInput.x,y=moveInput.y;
      const k=this.keys;
      if(k){
        x+=(k.D.isDown||k.RIGHT.isDown?1:0)-(k.A.isDown||k.LEFT.isDown?1:0);
        y+=(k.S.isDown||k.DOWN.isDown?1:0)-(k.W.isDown||k.UP.isDown?1:0);
      }

      const mag=Math.hypot(x,y);
      if(mag<.12){x=0;y=0}
      else if(mag>1){x/=mag;y/=mag}

      const speed=245*HERO[state.hero].speed;
      const targetX=x*speed,targetY=y*speed;
      const response=(Math.abs(x)+Math.abs(y))>.001?9.5:12.5;
      const blend=1-Math.exp(-response*dt);
      this.player.body.velocity.x=Phaser.Math.Linear(this.player.body.velocity.x,targetX,blend);
      this.player.body.velocity.y=Phaser.Math.Linear(this.player.body.velocity.y,targetY,blend);

      if(Math.abs(this.player.body.velocity.x)+Math.abs(this.player.body.velocity.y)<2)this.player.setVelocity(0,0);

      const moving=Math.abs(x)+Math.abs(y)>.06;
      if(moving){
        this.direction=Math.abs(x)>Math.abs(y)?(x<0?'left':'right'):(y<0?'up':'down');
        this.stepClock+=dt;
        if(this.stepClock>.17){this.stepClock=0;this.frame=1-this.frame}
      }else{this.stepClock=0;this.frame=0}
      this.updateHeroTexture();

      if(k?.E&&Phaser.Input.Keyboard.JustDown(k.E))this.act();
      if(k?.K&&Phaser.Input.Keyboard.JustDown(k.K))this.swap();
      if(k?.SPACE&&Phaser.Input.Keyboard.JustDown(k.SPACE))this.ability();

      const n=this.nearest();
      if(n){
        ui.nearby.textContent=`${n.locked?'LOCKED':'ACT'} · ${n.label}`;
        ui.nearby.classList.remove('hidden');
      }else ui.nearby.classList.add('hidden');

      if(this.roomKey==='fats'&&this.bossActive&&this.fats?.active){
        const d=Phaser.Math.Distance.Between(this.fats.x,this.fats.y,this.player.x,this.player.y);
        if(d>160)this.physics.moveToObject(this.fats,this.player,this.bossPhase===2?115:70);
        else this.fats.setVelocity(0,0);
        if(d<78)this.hurtPlayer();
        this.bossCooldown-=dt;
        if(this.bossCooldown<=0){
          this.bossCooldown=this.bossPhase===2?.66:1.05;
          this.bossShot();
        }
      }

      this.player.setDepth(100+this.player.y*.02);
      this.npcs.forEach(n=>n.setDepth(100+n.y*.02));
    }
  }

  function resetJoystick(){
    moveInput.x=0;moveInput.y=0;
    ui.joystick.classList.add('hidden');
    ui.knob.style.transform='translate(-50%,-50%)';
  }

  // Floating thumb joystick. Browser zoom is independently locked below.
  let pointerId=null,origin={x:0,y:0};
  const MAX=44;
  const leftZone=e=>e.clientX<innerWidth*.48;

  window.addEventListener('pointerdown',e=>{
    if(dialogueState||pointerId!==null||!leftZone(e))return;
    pointerId=e.pointerId;
    origin={x:e.clientX,y:e.clientY};
    ui.joystick.style.left=origin.x+'px';
    ui.joystick.style.top=origin.y+'px';
    ui.joystick.classList.remove('hidden');
    ui.moveHint.style.opacity='.25';
  },{passive:false});

  window.addEventListener('pointermove',e=>{
    if(e.pointerId!==pointerId)return;
    let dx=e.clientX-origin.x,dy=e.clientY-origin.y;
    const d=Math.hypot(dx,dy);
    if(d>MAX){dx=dx/d*MAX;dy=dy/d*MAX}
    moveInput.x=dx/MAX;moveInput.y=dy/MAX;
    ui.knob.style.transform=`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px))`;
  },{passive:false});

  const endPointer=e=>{
    if(e.pointerId!==pointerId)return;
    pointerId=null;
    resetJoystick();
    ui.moveHint.style.opacity='.55';
  };
  window.addEventListener('pointerup',endPointer,{passive:false});
  window.addEventListener('pointercancel',endPointer,{passive:false});

  ui.act.addEventListener('pointerdown',e=>{
    e.preventDefault();
    if(advanceDialogue())return;
    activeScene?.act();
  });
  ui.swap.addEventListener('pointerdown',e=>{e.preventDefault();if(!dialogueState)activeScene?.swap()});
  ui.ability.addEventListener('pointerdown',e=>{e.preventDefault();if(!dialogueState)activeScene?.ability()});

  // Aggressive iOS zoom prevention. Game zoom is controlled only by Phaser.
  const prevent=e=>e.preventDefault();
  document.addEventListener('gesturestart',prevent,{passive:false});
  document.addEventListener('gesturechange',prevent,{passive:false});
  document.addEventListener('gestureend',prevent,{passive:false});
  document.addEventListener('dblclick',prevent,{passive:false});
  document.addEventListener('touchmove',e=>{if(e.touches&&e.touches.length>1)e.preventDefault()},{passive:false});
  let lastTouchEnd=0;
  document.addEventListener('touchend',e=>{
    const now=Date.now();
    if(now-lastTouchEnd<=300)e.preventDefault();
    lastTouchEnd=now;
  },{passive:false});

  uiRefresh();

  new Phaser.Game({
    type:Phaser.CANVAS,
    parent:'game',
    backgroundColor:'#101319',
    scale:{mode:Phaser.Scale.RESIZE,width:innerWidth,height:innerHeight},
    physics:{default:'arcade',arcade:{gravity:{x:0,y:0},debug:false}},
    render:{antialias:true,roundPixels:true},
    scene:[BootScene,RoomScene]
  });
})();