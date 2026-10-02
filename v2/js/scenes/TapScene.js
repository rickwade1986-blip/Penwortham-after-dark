PAD2.TapScene=class extends PAD2.AdventureBase{
  constructor(){super('TapScene')}
  create(data={}){
    this.createBase('room-tap',data.spawn||{x:800,y:710},'Tap & Vine');

    this.will=this.physics.add.sprite(650,390,'npc-will').setScale(.48).setDepth(80);
    this.will.body.setImmovable(true).setSize(105,74,true);
    this.denise=this.physics.add.sprite(920,405,'npc-denise').setScale(.50).setDepth(80);
    this.denise.body.setImmovable(true).setSize(112,78,true);
    this.dad=this.physics.add.sprite(1240,650,'npc-dad').setScale(.43).setDepth(80);
    this.dad.body.setImmovable(true).setSize(125,82,true);

    this.physics.add.collider(this.player,this.will);
    this.physics.add.collider(this.player,this.denise);
    this.physics.add.collider(this.player,this.dad);

    this.addInteractable({
      x:650,y:390,radius:105,prompt:'WILL',
      onAct:()=>{
        const s=PAD2.state.data;
        this.say('WILL',PAD2.writing.will[s.hero],()=>{
          s.flags.willMet=true;
          if(s.quest===PAD2.quest.MILK_FOUND)PAD2.state.setQuest(PAD2.quest.WILL_MET);
          else PAD2.state.save();
        });
      },
      onAbility:(hero)=>{
        this.say(hero.toUpperCase(),hero==='rick'
          ?['Rick: Explain the pub sentence.', 'Will: No. It loses power.']
          :['Laura: I am calling bullshit on the entire sentence.', 'Will: Yet you understood it.']);
      }
    });

    this.addInteractable({
      x:920,y:405,radius:110,prompt:'DENISE',
      onAct:()=>{
        const s=PAD2.state.data;
        if(s.quest===PAD2.quest.MILK_FOUND&&!s.flags.willMet){
          this.say('DENISE',['Speak to Will first.', "He's been dying to say the pub thing."]);
          return;
        }
        this.say('DENISE',PAD2.writing.denise[s.hero],()=>{
          s.flags.deniseMet=true;
          s.items.wine=true;
          if(s.quest===PAD2.quest.WILL_MET)PAD2.state.setQuest(PAD2.quest.DENISE_MET);
          else PAD2.state.save();
        });
      },
      onAbility:(hero)=>{
        this.say(hero.toUpperCase(),hero==='rick'
          ?['Rick: Kendal was calm last time.', 'Denise: That is an outrageous lie.']
          :['Laura: We are absolutely going again.', 'Denise: Finally, someone sensible.']);
      }
    });

    this.addInteractable({
      x:1240,y:650,radius:115,prompt:'DAD',
      onAct:()=>{
        const s=PAD2.state.data;
        this.say('DAD',PAD2.writing.dad[s.hero],()=>{s.flags.dadTalked=true;PAD2.state.save();});
      }
    });

    this.addInteractable({
      x:1210,y:555,radius:105,prompt:'KENDAL',
      onAct:()=>this.goto('KendalScene',{x:800,y:700})
    });

    this.addInteractable({
      x:800,y:810,radius:110,prompt:'OUT',
      onAct:()=>this.goto('StreetScene',{x:1280,y:660})
    });
  }
};