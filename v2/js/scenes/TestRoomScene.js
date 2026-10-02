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

    // Temporary capsule used only to validate movement. This is not ship art.
    if(!this.textures.exists('pad2-player')){
      const capsule=this.add.graphics();
      capsule.fillStyle(0xffffff);
      capsule.fillRoundedRect(2,2,64,92,22);
      capsule.lineStyle(3,0x17131c,1);
      capsule.strokeRoundedRect(2,2,64,92,22);
      capsule.generateTexture('pad2-player',68,96);
      capsule.destroy();
    }
    this.player=this.physics.add.sprite(W/2,H/2,'pad2-player').setDisplaySize(74,104);
    this.player.setCircle(24,10,48).setCollideWorldBounds(true);
    this.player.setTint(PAD2.state.data.hero==='rick'?0x2f6448:0xb94882);

    this.controller=new PAD2.PlayerController(this,this.player);
    this.cameras.main.startFollow(this.player,true,PAD2.config.camera.lerp,PAD2.config.camera.lerp);
    this.cameras.main.setZoom(PAD2.config.camera.zoom);

    this.prompt=this.add.circle(W/2+260,H/2,28,0xb7ff39,.9);
    this.add.text(W/2+260,H/2,'ACT',{fontFamily:'Bangers',fontSize:'15px',color:'#10150a'}).setOrigin(.5);

    this.wall=this.add.rectangle(W/2-310,H/2,120,240,0x3b2f42).setStrokeStyle(3,0x5f4e69);
    this.physics.add.existing(this.wall,true);
    this.physics.add.collider(this.player,this.wall);

    this.testNpc=this.add.circle(W/2-150,H/2+210,34,0xd6b06a).setStrokeStyle(3,0x17131c);
    this.add.text(W/2-150,H/2+210,'NPC',{fontFamily:'Bangers',fontSize:'16px',color:'#17131c'}).setOrigin(.5);
    this.testTarget={
      x:W/2-150,y:H/2+210,
      bullshittable:true,
      bullshitDetectable:true,
      onBullshit:()=>PAD2.dialogue.open('RICK',['Trust me. I know exactly what I am doing.','NPC: That somehow made me less confident.']),
      onCallBullshit:()=>PAD2.dialogue.open('LAURA',['Bullshit.','NPC: I literally only said hello.','Laura: Start as you mean to go on.'])
    };

    document.getElementById('objective').textContent='MOVE → TALK → SWAP → USE ABILITY → TRY TO PINCH-ZOOM';
    document.body.dataset.v2Ready='true';
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
    const d=Phaser.Math.Distance.Between(this.player.x,this.player.y,this.testTarget.x,this.testTarget.y);
    if(d<125){
      PAD2.abilities.use(this,this.testTarget);
      return;
    }
    const hero=PAD2.state.data.hero;
    PAD2.dialogue.open(hero==='rick'?'RICK':'LAURA',hero==='rick'
      ?['I could bullshit my way through something here.','There is currently fuck all to bullshit.']
      :['Bullshit.','Rick: On what?','Laura: Vibes.']);
  }
  update(_,dtMs){this.controller.update(Math.min(.034,dtMs/1000))}
};
