PAD2.quest={
  CAR_NOT_FOUND:'CAR_NOT_FOUND',
  CAR_FOUND:'CAR_FOUND',
  GLASSES_FOUND:'GLASSES_FOUND',
  MILK_FOUND:'MILK_FOUND',
  WILL_MET:'WILL_MET',
  DENISE_MET:'DENISE_MET',
  TURKISH_DONE:'TURKISH_DONE',
  FATS_UNLOCKED:'FATS_UNLOCKED',
  BOSS_ACTIVE:'BOSS_ACTIVE',
  COMPLETE:'COMPLETE'
};

PAD2.objectives={
  CAR_NOT_FOUND:"Find Rick's car",
  CAR_FOUND:"Now find the glasses, genius",
  GLASSES_FOUND:"Behbeh, we need milk too",
  MILK_FOUND:"Go to Tap & Vine",
  WILL_MET:"Find Denise. She'll know what's going on.",
  DENISE_MET:"Get some food at The Turkish",
  TURKISH_DONE:"Something's kicked off. Find FATS.",
  FATS_UNLOCKED:"Enter Pad Thai Palace",
  BOSS_ACTIVE:"De-pout FATS",
  COMPLETE:"Go somewhere unnecessarily expensive for a water"
};

PAD2.state={
  fresh(){
    return{
      hero:'rick',
      hp:6,
      quest:PAD2.quest.CAR_NOT_FOUND,
      room:'StreetScene',
      items:{car:false,glasses:false,milk:false,wine:false,baklava:false},
      flags:{
        willMet:false,deniseMet:false,kendalVisited:false,beatFound:false,
        dadTalked:false,turkishEaten:false
      },
      settings:{haptics:true}
    };
  },
  load(){
    if(new URLSearchParams(location.search).get('reset')==='1'){
      localStorage.removeItem(PAD2.config.storageKey);
      history.replaceState({},'',location.pathname);
    }
    try{
      const raw=JSON.parse(localStorage.getItem(PAD2.config.storageKey)||'null');
      const fresh=this.fresh();
      this.data=raw?{
        ...fresh,...raw,
        items:{...fresh.items,...(raw.items||{})},
        flags:{...fresh.flags,...(raw.flags||{})},
        settings:{...fresh.settings,...(raw.settings||{})}
      }:fresh;
    }catch{this.data=this.fresh()}
    return this.data;
  },
  save(){
    try{localStorage.setItem(PAD2.config.storageKey,JSON.stringify(this.data))}catch{}
    PAD2.ui?.refresh?.();
  },
  setQuest(next){
    this.data.quest=next;this.save();return true;
  },
  objective(){
    return PAD2.objectives[this.data.quest]||'Cause avoidable chaos';
  }
};
PAD2.state.load();
