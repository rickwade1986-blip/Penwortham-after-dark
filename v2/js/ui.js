PAD2.ui={
  objective:document.getElementById('objective'),
  heroName:document.getElementById('hero-name'),
  hp:document.getElementById('hero-hp'),
  ability:document.getElementById('ability'),

  refresh(){
    const s=PAD2.state.data;
    const hero=PAD2.characters[s.hero];
    if(this.objective)this.objective.textContent=PAD2.state.objective();
    if(this.heroName){
      this.heroName.textContent=hero.name;
      this.heroName.style.color=hero.accent;
    }
    if(this.hp)this.hp.textContent='♥'.repeat(Math.max(0,s.hp))+'♡'.repeat(Math.max(0,6-s.hp));

    const scene=PAD2.runtime.activeScene;
    const combat=scene?.scene?.key==='FatsScene'&&scene.inCombat;
    if(this.ability){
      if(combat)this.ability.textContent=s.hero==='rick'?'BARS':'RIFF';
      else this.ability.textContent=hero.abilityLabel;
    }
  }
};