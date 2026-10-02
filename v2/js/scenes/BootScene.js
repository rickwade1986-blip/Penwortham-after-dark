PAD2.BootScene=class extends Phaser.Scene{
  constructor(){super('BootScene')}

  preload(){
    const heroes=['rick','laura'];
    const dirs=['down','up','right','left'];
    for(const hero of heroes){
      for(const dir of dirs){
        for(let frame=0;frame<2;frame++){
          this.load.image(`${hero}-${dir}-${frame}`,`./assets/characters/${hero}-${dir}-${frame}.png`);
        }
      }
    }

    this.load.image('npc-dad','./assets/characters/dad.png');
    this.load.image('npc-will','./assets/characters/will.png');
    this.load.image('npc-denise','./assets/characters/denise.png');
    this.load.image('npc-fats','./assets/characters/fats.png');
    this.load.image('npc-andrew','./assets/characters/andrew.png');

    this.load.image('room-street','./assets/rooms/street.png');
    this.load.image('room-shop','./assets/rooms/shop.png');
    this.load.image('room-tap','./assets/rooms/tap.png');
    this.load.image('room-turkish','./assets/rooms/turkish.png');
    this.load.image('room-kendal','./assets/rooms/kendal.png');
    this.load.image('room-fats','./assets/rooms/fats.png');
  }

  create(){
    const requested=PAD2.state.data.room;
    const known=['StreetScene','ShopScene','TapScene','TurkishScene','KendalScene','FatsScene'];
    this.scene.start(known.includes(requested)?requested:'StreetScene');
    this.scene.launch('UIScene');
  }
};