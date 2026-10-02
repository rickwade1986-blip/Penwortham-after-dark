PAD2.abilities={
  bullshit(scene,target){
    if(PAD2.runtime.pausedForDialogue)return false;
    if(target?.bullshittable){
      target.onBullshit?.(scene);
      return true;
    }
    PAD2.dialogue.open('RICK',[
      'I can explain.',
      'There is currently nothing to explain.'
    ]);
    return false;
  },

  callBullshit(scene,target){
    if(PAD2.runtime.pausedForDialogue)return false;
    if(target?.bullshitDetectable){
      target.onCallBullshit?.(scene);
      return true;
    }
    PAD2.dialogue.open('LAURA',[
      'Bullshit.',
      'Rick: nobody actually said anything.',
      'Laura: preventative.'
    ]);
    return false;
  },

  use(scene,target){
    const hero=PAD2.state.data.hero;
    const ability=PAD2.characters[hero]?.worldAbility;
    return this[ability]?.(scene,target)??false;
  },

  refreshButton(){
    const hero=PAD2.state.data.hero;
    const def=PAD2.characters[hero];
    const button=document.getElementById('ability');
    if(button&&def)button.textContent=def.abilityLabel;
  }
};
