PAD2.BootScene=class extends Phaser.Scene{
  constructor(){super('BootScene')}

  preload(){
    const heroes=['rick','laura'];
    const dirs=['down','up','right','left'];
    for(const hero of heroes){
      for(const dir of dirs){
        for(let frame=0;frame<2;frame++){
          this.load.svg(`${hero}-${dir}-${frame}`,`./assets/characters/${hero}-${dir}-${frame}.svg`);
        }
      }
    }

    this.load.svg('npc-dad','./assets/characters/dad.svg');
    this.load.svg('npc-will','./assets/characters/will.svg');
    this.load.svg('npc-denise','./assets/characters/denise.svg');
    this.load.svg('npc-fats','./assets/characters/fats.svg');
    this.load.svg('npc-andrew','./assets/characters/andrew.svg');

    this.load.svg('room-street','./assets/rooms/street.svg');
    this.load.svg('room-shop','./assets/rooms/shop.svg');
    this.load.svg('room-tap','./assets/rooms/tap.svg');
    this.load.svg('room-turkish','./assets/rooms/turkish.svg');
    this.load.svg('room-kendal','./assets/rooms/kendal.svg');
    this.load.svg('room-fats','./assets/rooms/fats.svg');
  }

  create(){
    const requested=PAD2.state.data.room;
    const known=['StreetScene','ShopScene','TapScene','TurkishScene','KendalScene','FatsScene'];
    this.scene.start(known.includes(requested)?requested:'StreetScene');
    this.scene.launch('UIScene');
  }
};