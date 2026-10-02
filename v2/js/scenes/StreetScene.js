PAD2.StreetScene=class extends PAD2.AdventureBase{
  constructor(){super('StreetScene')}
  create(data={}){
    this.createBase('room-street',data.spawn||{x:800,y:690},'Street');

    // Separate, visible glasses so the first objective cannot be ambiguous.
    const g=this.add.graphics().setDepth(40);
    g.lineStyle(6,0xeef4ff,1);
    g.strokeCircle(470,680,17);g.strokeCircle(510,680,17);g.lineBetween(487,680,493,680);
    this.tweens.add({targets:g,alpha:{from:.55,to:1},duration:600,yoyo:true,repeat:-1});

    this.add.text(78,785,'← LEYLAND ROAD STORES',{fontFamily:'Arial Black',fontSize:'18px',color:'#f4efe8',stroke:'#17131b',strokeThickness:5}).setDepth(30);
    this.add.text(1290,785,'THE TURKISH →',{fontFamily:'Arial Black',fontSize:'18px',color:'#f4efe8',stroke:'#17131b',strokeThickness:5}).setDepth(30);

    this.addInteractable({
      x:360,y:720,radius:115,prompt:'CAR',
      onAct:()=>{
        const s=PAD2.state.data;
        if(s.quest===PAD2.quest.CAR_NOT_FOUND){
          s.items.car=true;PAD2.state.setQuest(PAD2.quest.CAR_FOUND);
          this.say(s.hero.toUpperCase(),PAD2.writing.car[s.hero],()=>this.pulse(360,720));
        }else this.say('RICK',['Yep. Still the car.']);
      }
    });

    this.addInteractable({
      x:490,y:680,radius:95,prompt:'GLASSES',
      onAct:()=>{
        const s=PAD2.state.data;
        if(s.quest===PAD2.quest.CAR_NOT_FOUND){
          this.say('LAURA',['Car first. Then the tiny transparent objects.']);
          return;
        }
        if(s.quest===PAD2.quest.CAR_FOUND){
          s.items.glasses=true;PAD2.state.setQuest(PAD2.quest.GLASSES_FOUND);
          this.say(s.hero.toUpperCase(),PAD2.writing.glasses[s.hero],()=>this.pulse(490,680));
        }else this.say('RICK',['They are, against all odds, still glasses.']);
      }
    });

    // 4AM coffee is a tiny optional joke, not another whole location.
    this.addInteractable({
      x:225,y:625,radius:95,prompt:'COFFEE',
      onAct:()=>{
        const h=PAD2.state.data.hero;
        this.say(h.toUpperCase(),h==='rick'
          ?['Coffee?', 'Laura: It is nearly 4am.', 'Rick: So that is a yes.']
          :['No.', 'Rick: You did not even ask what I wanted.', 'Laura: Coffee. At 4am. No.']);
      }
    });

    this.addInteractable({
      x:1280,y:625,radius:120,prompt:'ENTER',
      onAct:()=>this.goto('TapScene',{x:800,y:700})
    });

    this.addInteractable({
      x:100,y:795,radius:130,prompt:'SHOP',
      onAct:()=>this.goto('ShopScene',{x:800,y:720})
    });

    this.addInteractable({
      x:1510,y:790,radius:120,prompt:'EAT',
      onAct:()=>this.goto('TurkishScene',{x:800,y:730})
    });

    this.fatsExit=this.addInteractable({
      x:805,y:845,radius:90,prompt:'FATS',
      enabled:()=>[PAD2.quest.FATS_UNLOCKED,PAD2.quest.BOSS_ACTIVE,PAD2.quest.COMPLETE].includes(PAD2.state.data.quest),
      onAct:()=>this.goto('FatsScene',{x:800,y:730})
    });
    this.fatsSign=this.add.text(805,815,'PAD THAI PALACE ↓',{fontFamily:'Arial Black',fontSize:'17px',color:'#ff7e88',stroke:'#17131b',strokeThickness:5}).setOrigin(.5).setDepth(30);
    this.fatsSign.setVisible(this.fatsExit.enabled());
  }
  updateRoom(){
    this.fatsSign?.setVisible(this.fatsExit.enabled());
  }
};