PAD2.ShopScene=class extends PAD2.AdventureBase{
  constructor(){super('ShopScene')}
  create(data={}){
    this.createBase('room-shop',data.spawn||{x:800,y:720},'Leyland Road Stores');

    this.addInteractable({
      x:290,y:500,radius:110,prompt:'MILK',
      onAct:()=>{
        const s=PAD2.state.data;
        if(s.quest!==PAD2.quest.GLASSES_FOUND){
          this.say('LAURA',['We have enough milk.', 'Somehow.']);
          return;
        }
        s.items.milk=true;
        PAD2.state.setQuest(PAD2.quest.MILK_FOUND);
        this.say(s.hero.toUpperCase(),PAD2.writing.milk[s.hero],()=>this.pulse(290,500));
      }
    });

    this.addInteractable({
      x:800,y:820,radius:120,prompt:'OUT',
      onAct:()=>this.goto('StreetScene',{x:170,y:790})
    });

    this.addInteractable({
      x:1200,y:575,radius:125,prompt:'ACT',
      onAbility:(hero)=>{
        this.say(hero.toUpperCase(),hero==='rick'
          ?['Rick: I can probably get us a discount.', 'Laura: On milk?', 'Rick: You lack vision.']
          :['Laura: That sign says no more coffee.', 'Rick: Targeted harassment.']);
      }
    });
  }
};