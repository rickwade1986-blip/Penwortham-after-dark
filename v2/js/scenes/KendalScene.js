PAD2.KendalScene=class extends PAD2.AdventureBase{
  constructor(){super('KendalScene')}
  create(data={}){
    this.createBase('room-kendal',data.spawn||{x:800,y:700},'Kendal Calling');

    this.andrew=this.physics.add.sprite(800,420,'npc-andrew').setScale(.48).setDepth(80);
    this.andrew.body.setImmovable(true);
    this.physics.add.collider(this.player,this.andrew);

    this.addInteractable({
      x:800,y:420,radius:115,prompt:'3000',
      onAct:()=>{
        const s=PAD2.state.data;
        if(!s.flags.beatFound){
          this.say('PRINCE ANDREW 3000',PAD2.writing.andrew,()=>{
            s.flags.beatFound=true;s.flags.kendalVisited=true;PAD2.state.save();this.pulse(800,420,0xf4c65f);
          });
        }else this.say('PRINCE ANDREW 3000',['Move on.']);
      }
    });

    this.addInteractable({
      x:800,y:805,radius:120,prompt:'BACK',
      onAct:()=>{
        PAD2.state.data.flags.kendalVisited=true;PAD2.state.save();
        this.goto('TapScene',{x:1140,y:610});
      }
    });

    this.time.delayedCall(350,()=>{
      if(!PAD2.state.data.flags.kendalVisited)this.say('DENISE',PAD2.writing.kendal);
    });
  }
};