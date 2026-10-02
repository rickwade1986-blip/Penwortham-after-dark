PAD2.PlayerController=class{
  constructor(scene,sprite){
    this.scene=scene;this.sprite=sprite;this.hero=PAD2.state.data.hero;this.direction='down';
  }
  update(dt){
    if(PAD2.runtime.pausedForDialogue){
      this.sprite.setVelocity(0,0);return;
    }
    let x=PAD2.runtime.input.x,y=PAD2.runtime.input.y;
    const mag=Math.hypot(x,y);
    if(mag<PAD2.config.player.deadzone){x=0;y=0}
    else if(mag>1){x/=mag;y/=mag}

    const max=PAD2.config.player.maxSpeed;
    const targetX=x*max,targetY=y*max;
    const moving=Math.abs(x)+Math.abs(y)>.001;
    const response=moving?PAD2.config.player.accel:PAD2.config.player.decel;
    const k=1-Math.exp(-response*dt);

    const body=this.sprite.body;
    body.velocity.x=Phaser.Math.Linear(body.velocity.x,targetX,k);
    body.velocity.y=Phaser.Math.Linear(body.velocity.y,targetY,k);

    if(Math.abs(body.velocity.x)+Math.abs(body.velocity.y)<2){
      body.velocity.x=0;body.velocity.y=0;
    }

    if(moving){
      this.direction=Math.abs(x)>Math.abs(y)?(x<0?'left':'right'):(y<0?'up':'down');
    }
  }
  swap(){
    this.hero=this.hero==='rick'?'laura':'rick';
    PAD2.state.data.hero=this.hero;PAD2.state.save();
    this.sprite.setFillStyle(this.hero==='rick'?0x2f6448:0xb94882);
    document.getElementById('hero-name').textContent=this.hero.toUpperCase();
    document.getElementById('hero-name').style.color=this.hero==='rick'?'#b7ff39':'#ff4fa3';
  }
};
