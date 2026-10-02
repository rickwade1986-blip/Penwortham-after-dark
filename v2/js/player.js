PAD2.PlayerController=class{
  constructor(scene,sprite){
    this.scene=scene;
    this.sprite=sprite;
    this.hero=PAD2.state.data.hero;
    this.direction='down';
    this.frame=0;
    this.stepTimer=0;
    this.applyTexture();
  }

  key(){
    const dir=this.direction==='left'?'right':this.direction;
    return `${this.hero}-${dir}-${this.frame}`;
  }

  applyTexture(){
    const key=this.key();
    if(this.scene.textures.exists(key))this.sprite.setTexture(key);
    this.sprite.setFlipX(this.direction==='left');
    const scale=this.hero==='laura'?0.62:0.68;
    this.sprite.setScale(scale);
    this.sprite.body?.setSize(92,70,true);
  }

  update(dt){
    if(PAD2.runtime.pausedForDialogue){
      this.sprite.setVelocity(0,0);
      return;
    }

    let x=PAD2.runtime.input.x,y=PAD2.runtime.input.y;
    const keys=this.scene.keys;
    if(keys){
      x+=(keys.D.isDown||keys.RIGHT.isDown?1:0)-(keys.A.isDown||keys.LEFT.isDown?1:0);
      y+=(keys.S.isDown||keys.DOWN.isDown?1:0)-(keys.W.isDown||keys.UP.isDown?1:0);
    }

    const mag=Math.hypot(x,y);
    if(mag<PAD2.config.player.deadzone){x=0;y=0}
    else if(mag>1){x/=mag;y/=mag}

    const speedMul=PAD2.characters[this.hero]?.speed||1;
    const max=PAD2.config.player.maxSpeed*speedMul;
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
      const nextDir=Math.abs(x)>Math.abs(y)?(x<0?'left':'right'):(y<0?'up':'down');
      if(nextDir!==this.direction){
        this.direction=nextDir;
        this.frame=0;
        this.stepTimer=0;
      }
      this.stepTimer+=dt;
      if(this.stepTimer>.16){
        this.stepTimer=0;
        this.frame=1-this.frame;
      }
    }else{
      this.frame=0;
      this.stepTimer=0;
    }

    this.applyTexture();
    this.sprite.setDepth(100+this.sprite.y*.01);
  }

  swap(){
    this.hero=this.hero==='rick'?'laura':'rick';
    PAD2.state.data.hero=this.hero;
    PAD2.state.save();
    this.frame=0;
    this.applyTexture();
    PAD2.ui?.refresh?.();
    PAD2.abilities?.refreshButton?.();
  }
};