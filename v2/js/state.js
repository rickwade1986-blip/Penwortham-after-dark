PAD2.quest={
  CAR_NOT_FOUND:'CAR_NOT_FOUND',
  CAR_FOUND:'CAR_FOUND',
  GLASSES_FOUND:'GLASSES_FOUND',
  MILK_FOUND:'MILK_FOUND',
  WILL_MET:'WILL_MET',
  DENISE_MET:'DENISE_MET',
  BEAT_FOUND:'BEAT_FOUND',
  FATS_UNLOCKED:'FATS_UNLOCKED',
  BOSS_ACTIVE:'BOSS_ACTIVE',
  COMPLETE:'COMPLETE'
};

PAD2.state={
  fresh(){
    return{
      hero:'rick',
      hp:6,
      quest:PAD2.quest.CAR_NOT_FOUND,
      room:'test',
      items:{},
      flags:{},
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
      this.data=raw?{...this.fresh(),...raw}:this.fresh();
    }catch{this.data=this.fresh()}
    return this.data;
  },
  save(){
    try{localStorage.setItem(PAD2.config.storageKey,JSON.stringify(this.data))}catch{}
  },
  transition(next){
    const q=PAD2.quest;
    const allowed={
      [q.CAR_NOT_FOUND]:[q.CAR_FOUND],
      [q.CAR_FOUND]:[q.GLASSES_FOUND],
      [q.GLASSES_FOUND]:[q.MILK_FOUND],
      [q.MILK_FOUND]:[q.WILL_MET],
      [q.WILL_MET]:[q.DENISE_MET],
      [q.DENISE_MET]:[q.BEAT_FOUND],
      [q.BEAT_FOUND]:[q.FATS_UNLOCKED],
      [q.FATS_UNLOCKED]:[q.BOSS_ACTIVE],
      [q.BOSS_ACTIVE]:[q.COMPLETE],
      [q.COMPLETE]:[]
    };
    const current=this.data.quest;
    if(!(allowed[current]||[]).includes(next))return false;
    this.data.quest=next;this.save();return true;
  }
};
PAD2.state.load();
