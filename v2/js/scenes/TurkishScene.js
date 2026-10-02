PAD2.TurkishScene=class extends PAD2.AdventureBase{
  constructor(){super('TurkishScene')}
  create(data={}){
    this.createBase('room-turkish',data.spawn||{x:800,y:740},'The Turkish');

    this.food=this.addInteractable({
      x:800,y:600,radius:150,prompt:'EAT',
      bullshittable:true,bullshitDetectable:true,
      onAct:()=>{
        const s=PAD2.state.data;
        if(s.quest!==PAD2.quest.DENISE_MET&&s.quest!==PAD2.quest.TURKISH_DONE&&s.quest!==PAD2.quest.FATS_UNLOCKED){
          this.say('LAURA',['We can eat, but we are meant to be doing something else.']);
          return;
        }
        if(!s.flags.turkishEaten){
          this.say(s.hero.toUpperCase(),PAD2.writing.turkish[s.hero],()=>{
            s.flags.turkishEaten=true;
            PAD2.state.setQuest(PAD2.quest.TURKISH_DONE);
            this.time.delayedCall(250,()=>this.say('PHONE — FATS',PAD2.writing.fatsPhone,()=>PAD2.state.setQuest(PAD2.quest.FATS_UNLOCKED)));
          });
        }else this.say('RICK',['I physically cannot eat another thing.', 'Laura: Give it seven minutes.']);
      },
      onAbility:(hero)=>this.say(hero.toUpperCase(),hero==='rick'?PAD2.writing.turkishBullshit:PAD2.writing.turkishCallBullshit)
    });

    this.addInteractable({
      x:800,y:825,radius:120,prompt:'OUT',
      onAct:()=>this.goto('StreetScene',{x:1480,y:790})
    });
  }
};