PAD2.BootScene=class extends Phaser.Scene{
  constructor(){super('BootScene')}

  preload(){
    for(const hero of ['rick','laura']){
      for(const dir of ['down','up','right']){
        for(let frame=0;frame<2;frame++){
          this.load.image(`${hero}-${dir}-${frame}`,`./assets/game/players/${hero}-${dir}-${frame}.png`);
        }
      }
    }

    this.load.image('npc-dad','./assets/game/npcs/dad.png');
    this.load.image('npc-will','./assets/game/npcs/will.png');
    this.load.image('npc-denise','./assets/game/npcs/denise.png');
    this.load.image('npc-fats','./assets/game/npcs/fats.png');
    this.load.image('npc-andrew','./assets/game/npcs/andrew.png');

    for(const key of ['street','shop','tap','turkish','kendal','fats']){
      this.load.image(`room-${key}`,`./assets/game/rooms/${key}.png`);
    }
  }

  create(){
    const requested=PAD2.state.data.room;
    const known=['StreetScene','ShopScene','TapScene','TurkishScene','KendalScene','FatsScene'];
    this.scene.start(known.includes(requested)?requested:'StreetScene');
    this.scene.launch('UIScene');
  }
};