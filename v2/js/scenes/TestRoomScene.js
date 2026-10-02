PAD2.TestRoomScene=class extends Phaser.Scene{
  constructor(){super('TestRoomScene')}
  create(){
    PAD2.runtime.activeScene=this;
    const W=PAD2.config.world.width,H=PAD2.config.world.height;
    this.physics.world.setBounds(0,0,W,H);
    this.cameras.main.setBounds(0,0,W,H);
    this.cameras.main.setBackgroundColor('#17251e');

    const g=this.add.graphics();
    g.fillStyle(0x274f3a);g.fillRect(0,0,W,H);
    g.fillStyle(0x8b745f);g.fillRoundedRect(120,170,W-240,H-340,50);
    g.fillStyle(0x1a3024);g.fillRoundedRect(360,310,880,380,36);
    g.lineStyle(3,0xffffff,.08);
    for(let x=390;x<1220;x+=80)g.lineBetween(x,330,x,670);
    for(let y=350;y<670;y+=80)g.lineBetween(380,y,1220,y);

    this.add.text(W/2,245,'V2 MOVEMENT / DIALOGUE TEST',{fontFamily:'Bangers',fontSize:'34px',color:'#f4efe8'}).setOrigin(.5);
    this.add.text(W/2,290,'This room is deliberately temporary. No ship art lives here.',{fontFamily:'IBM Plex Sans',fontSize:'14px',color:'#b9b0bd'}).setOrigin(.5);

    this.player=this.physics.add.sprite(W/2,H/2).setDisplaySize(74,100).setTint(0xffffff);
    this.player.setCircle(28,9,42).setCollideWorldBounds(true);
    this.player.setTexture('__WHITE');
    this.player.setFillStyle=()=>{};
    this.player.setTint(PAD2.state.data.hero==='rick'?0x2f6448:0xb94882);

    // use a simple capsule graphic overlay solely for movement foundation testing
    const capsule=this.add.graphics();
    capsule.fillStyle(PAD2.state.data.hero==='rick'?0x2f6448:0xb94882);
    capsule.fillRoundedRect(-34,-48,68,96,24);
    capsule.generateTexture('pad2-player',68,96);capsule.destroy();
    this.player.setTexture('pad2-player').clearTint();

    this.controller=new PAD2.PlayerController(this,this.player);
    this.cameras.main.startFollow(this.player,true,PAD2.config.camera.lerp,PAD2.config.camera.lerp);
    this.cameras.main.setZoom(PAD2.config.camera.zoom);

    this.prompt=this.add.circle(W/2+260,H/2,28,0xb7ff39,.9);
    this.add.text(W/2+260,H/2,'ACT',{fontFamily:'Bangers',fontSize:'15px',color:'#10150a'}).setOrigin(.5);

    this.wall=this.add.rectangle(W/2-310,H/2,120,240,0x3b2f42).setStrokeStyle(3,0x5f4e69);
    this.physics.add.existing(this.wall,true);
    this.physics.add.collider(this.player,this.wall);

    document.getElementById('objective').textContent='MOVE → TALK → SWAP → TRY TO PINCH-ZOOM';
  }
  act(){
    const d=Phaser.Math.Distance.Between(this.player.x,this.player.y,this.prompt.x,this.prompt.y);
    if(d>100)return;
    PAD2.dialogue.open('FOUNDATION TEST',[
      'Everything should freeze cleanly here.',
      'No enemies. No sliding. No browser zoom.',
      'ACT closes this. Then SWAP should work.'
    ]);
  }
  swap(){this.controller.swap()}
  ability(){
    if(PAD2.runtime.pausedForDialogue)return;
    const ring=this.add.circle(this.player.x,this.player.y,18,0xff4fa3,.08).setStrokeStyle(4,0xff4fa3,.9);
    this.tweens.add({targets:ring,scale:4,alpha:0,duration:260,onComplete:()=>ring.destroy()});
  }
  update(_,dtMs){this.controller.update(Math.min(.034,dtMs/1000))}
};
