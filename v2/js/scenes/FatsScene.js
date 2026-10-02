PAD2.FatsScene=class extends PAD2.AdventureBase{
  constructor(){super('FatsScene')}
  create(data={}){
    this.createBase('room-fats',data.spawn||{x:800,y:735},'Pad Thai Palace');
    this.inCombat=false;
    this.bossHp=34;
    this.bossMax=34;
    this.phase=1;
    this.cooldown=1.0;

    this.fats=this.physics.add.sprite(800,420,'npc-fats').setScale(.50).setDepth(85);
    this.fats.body.setImmovable(false);
    this.fats.setCollideWorldBounds(true);

    this.addInteractable({
      x:800,y:420,radius:130,prompt:'FATS',
      enabled:()=>!this.inCombat&&PAD2.state.data.quest!==PAD2.quest.COMPLETE,
      onAct:()=>{
        const s=PAD2.state.data;
        if(s.quest===PAD2.quest.FATS_UNLOCKED||s.quest===PAD2.quest.BOSS_ACTIVE){
          this.say('FATS',PAD2.writing.fatsIntro,()=>this.startCombat());
        }else this.say('FATS',['Not now. I am processing the roast situation.']);
      }
    });

    this.addInteractable({
      x:800,y:825,radius:120,prompt:'OUT',
      enabled:()=>!this.inCombat,
      onAct:()=>this.goto('StreetScene',{x:805,y:820})
    });
  }

  startCombat(){
    this.inCombat=true;
    PAD2.state.setQuest(PAD2.quest.BOSS_ACTIVE);
    this.physics.add.collider(this.player,this.fats);
    this.makeBossBar();
    PAD2.ui.refresh();
  }

  makeBossBar(){
    this.barBg=this.add.rectangle(800,90,460,36,0x11131a,.92).setStrokeStyle(4,0xff5e67).setScrollFactor(0).setDepth(600);
    this.bar=this.add.rectangle(580,90,440,18,0xff5e67).setOrigin(0,.5).setScrollFactor(0).setDepth(601);
    this.barText=this.add.text(800,58,'FATS — NORMAL POUT',{fontFamily:'Bangers',fontSize:'24px',color:'#ff8d96',stroke:'#17131b',strokeThickness:5}).setOrigin(.5).setScrollFactor(0).setDepth(601);
  }

  ability(){
    if(PAD2.runtime.pausedForDialogue||!this.inCombat)return super.ability();
    const hero=PAD2.state.data.hero;
    if(hero==='rick')this.rickAttack();
    else this.lauraAttack();
  }

  rickAttack(){
    const bonus=PAD2.state.data.flags.beatFound?2.4:1.7;
    const a=Phaser.Math.Angle.Between(this.player.x,this.player.y,this.fats.x,this.fats.y);
    const t=this.add.text(this.player.x,this.player.y-32,PAD2.state.data.flags.beatFound?'DUSTY BARS':'BARS',{
      fontFamily:'Bangers',fontSize:'20px',color:'#11150a',backgroundColor:'#b7ff39',padding:{x:7,y:3}
    }).setOrigin(.5).setDepth(300);
    this.physics.add.existing(t);t.body.setVelocity(Math.cos(a)*520,Math.sin(a)*520);t.damage=bonus;
    this.physics.add.overlap(t,this.fats,()=>{if(t.active){t.destroy();this.hitBoss(bonus)}});
    this.time.delayedCall(1100,()=>t.active&&t.destroy());
  }

  lauraAttack(){
    const range=PAD2.state.data.items.wine?235:195;
    const damage=PAD2.state.data.items.wine?3.8:3.0;
    for(let i=0;i<3;i++){
      const r=this.add.circle(this.player.x,this.player.y-18,22,0xff4fa3,.04).setStrokeStyle(5-i,0xff4fa3,.95-i*.18).setDepth(250);
      this.tweens.add({targets:r,scale:(range/22),alpha:0,duration:240+i*70,delay:i*25,onComplete:()=>r.destroy()});
    }
    const d=Phaser.Math.Distance.Between(this.player.x,this.player.y,this.fats.x,this.fats.y);
    if(d<range){
      this.hitBoss(damage);
      const a=Phaser.Math.Angle.Between(this.player.x,this.player.y,this.fats.x,this.fats.y);
      this.fats.setVelocity(Math.cos(a)*330,Math.sin(a)*330);
      this.time.delayedCall(120,()=>this.fats?.active&&this.fats.setVelocity(0));
    }
  }

  hitBoss(dmg){
    if(!this.inCombat)return;
    this.bossHp=Math.max(0,this.bossHp-dmg);
    this.bar.width=440*(this.bossHp/this.bossMax);
    this.fats.setTintFill(0xffffff);
    this.cameras.main.shake(85,.007);
    this.time.delayedCall(75,()=>this.fats?.active&&this.fats.clearTint());

    if(this.phase===1&&this.bossHp<=this.bossMax/2){
      this.phase=2;
      this.barText.setText('FATS — PAD THAI MODE');
      this.say('FATS',PAD2.writing.fatsPhase2);
    }
    if(this.bossHp<=0)this.win();
  }

  bossShot(){
    if(!this.inCombat||PAD2.runtime.pausedForDialogue)return;
    const a=Phaser.Math.Angle.Between(this.fats.x,this.fats.y,this.player.x,this.player.y);
    const count=this.phase===2?3:1;
    for(let i=0;i<count;i++){
      const aa=a+(i-(count-1)/2)*.28;
      const p=this.add.circle(this.fats.x,this.fats.y-35,18,0xe8dbc6).setStrokeStyle(4,0x8f5c41).setDepth(240);
      this.physics.add.existing(p);p.body.setCircle(18);
      p.body.setVelocity(Math.cos(aa)*(this.phase===2?330:245),Math.sin(aa)*(this.phase===2?330:245));
      this.physics.add.overlap(p,this.player,()=>{if(p.active){p.destroy();this.hurt()}});
      this.time.delayedCall(2800,()=>p.active&&p.destroy());
    }
  }

  hurt(){
    if(PAD2.runtime.pausedForDialogue||!this.inCombat||this.hurtLock>0)return;
    this.hurtLock=.8;
    PAD2.state.data.hp=Math.max(0,PAD2.state.data.hp-1);
    PAD2.state.save();
    this.cameras.main.shake(140,.012);
    this.player.setTint(0xff6874);
    this.time.delayedCall(120,()=>this.player?.clearTint());
    if(PAD2.state.data.hp<=0){
      PAD2.state.data.hp=6;PAD2.state.save();
      this.inCombat=false;
      this.say('FATS',['Beaten by a roast dispute. Grim.'],()=>this.goto('StreetScene',{x:805,y:820}));
    }
  }

  win(){
    if(!this.inCombat)return;
    this.inCombat=false;
    this.fats.setVelocity(0);
    this.cameras.main.shake(500,.018);
    PAD2.state.setQuest(PAD2.quest.COMPLETE);
    this.time.delayedCall(450,()=>{
      this.say('FATS',PAD2.writing.fatsDefeat,()=>{
        this.fats.setTint(0x7d7d7d);
        this.barBg?.destroy();this.bar?.destroy();this.barText?.destroy();
      });
    });
  }

  swap(){
    super.swap();
    if(this.inCombat)PAD2.ui.refresh();
  }

  updateRoom(dt){
    this.hurtLock=Math.max(0,(this.hurtLock||0)-dt);
    if(!this.inCombat||PAD2.runtime.pausedForDialogue)return;

    const d=Phaser.Math.Distance.Between(this.fats.x,this.fats.y,this.player.x,this.player.y);
    if(d>145)this.physics.moveToObject(this.fats,this.player,this.phase===2?110:62);
    else this.fats.setVelocity(0);

    if(d<72)this.hurt();

    this.cooldown-=dt;
    if(this.cooldown<=0){
      this.cooldown=this.phase===2?.68:1.05;
      this.bossShot();
    }
  }
};