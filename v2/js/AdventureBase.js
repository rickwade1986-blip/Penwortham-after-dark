PAD2.AdventureBase=class extends Phaser.Scene{
  constructor(key){super(key);this.interactables=[];this.prompt=null;this.promptText=null;this.roomKey='';}

  createBase(bgKey,spawn={x:800,y:650},roomName=''){
    PAD2.runtime.activeScene=this;
    PAD2.state.data.room=this.scene.key;
    PAD2.state.save();

    this.keys=this.input.keyboard?.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,E,K,SPACE');
    this.physics.world.setBounds(0,0,1600,900);
    this.cameras.main.setBounds(0,0,1600,900);
    this.cameras.main.setBackgroundColor('#101319');

    this.add.image(800,450,bgKey).setDisplaySize(1600,900).setDepth(-100);

    this.player=this.physics.add.sprite(spawn.x,spawn.y,'rick-down-0').setDepth(100);
    this.player.setCollideWorldBounds(true);
    this.controller=new PAD2.PlayerController(this,this.player);

    this.cameras.main.startFollow(this.player,true,PAD2.config.camera.lerp,PAD2.config.camera.lerp);
    this.cameras.main.setZoom(1.15);

    this.prompt=this.add.container(0,0).setDepth(500).setVisible(false);
    const c=this.add.circle(0,0,24,0x0c0f16,.94).setStrokeStyle(3,0xb7ff39);
    const t=this.add.text(0,0,'ACT',{fontFamily:'Bangers',fontSize:'14px',color:'#b7ff39'}).setOrigin(.5);
    this.prompt.add([c,t]);
    this.promptText=t;

    document.body.dataset.v2Ready='true';
    document.body.dataset.v2Room=this.scene.key;
    PAD2.ui.refresh();
    this.onRoomCreate?.();
  }

  addInteractable(def){this.interactables.push(def);return def;}

  nearestInteractable(){
    let best=null,bestD=Infinity;
    for(const i of this.interactables){
      if(i.enabled&& !i.enabled())continue;
      const d=Phaser.Math.Distance.Between(this.player.x,this.player.y,i.x,i.y);
      const r=i.radius||90;
      if(d<r&&d<bestD){best=i;bestD=d}
    }
    return best;
  }

  act(){
    if(PAD2.runtime.pausedForDialogue)return;
    const i=this.nearestInteractable();
    if(!i)return;
    i.onAct?.();
  }

  ability(){
    if(PAD2.runtime.pausedForDialogue)return;
    const i=this.nearestInteractable();
    if(i?.onAbility){
      i.onAbility(PAD2.state.data.hero);
      return;
    }
    PAD2.abilities.use(this,i);
  }

  swap(){
    if(PAD2.runtime.pausedForDialogue)return;
    this.controller.swap();
  }

  goto(scene,spawn){
    if(PAD2.runtime.pausedForDialogue)return;
    this.cameras.main.fadeOut(160,0,0,0);
    this.time.delayedCall(175,()=>this.scene.start(scene,{spawn}));
  }

  say(name,lines,onDone){PAD2.dialogue.open(name,lines,onDone);}

  pulse(x,y,color=0xb7ff39){
    const r=this.add.circle(x,y,18,color,.08).setStrokeStyle(4,color,.9).setDepth(300);
    this.tweens.add({targets:r,scale:3.4,alpha:0,duration:430,onComplete:()=>r.destroy()});
  }

  update(_,dtMs){
    const dt=Math.min(.034,dtMs/1000);
    if(!this.player)return;

    if(PAD2.runtime.pausedForDialogue){
      this.player.setVelocity(0,0);
      this.prompt.setVisible(false);
      this.updatePaused?.(dt);
      return;
    }

    this.controller.update(dt);

    if(this.keys?.E&&Phaser.Input.Keyboard.JustDown(this.keys.E))this.act();
    if(this.keys?.K&&Phaser.Input.Keyboard.JustDown(this.keys.K))this.swap();
    if(this.keys?.SPACE&&Phaser.Input.Keyboard.JustDown(this.keys.SPACE))this.ability();

    const n=this.nearestInteractable();
    if(n){
      this.prompt.setVisible(true).setPosition(n.x,n.y-(n.promptY||52));
      this.promptText.setText(n.prompt||'ACT');
    }else this.prompt.setVisible(false);

    this.updateRoom?.(dt);
  }
};