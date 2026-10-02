PAD2.BootScene=class extends Phaser.Scene{
  constructor(){super('BootScene')}
  create(){
    this.scene.start('TestRoomScene');
    this.scene.launch('UIScene');
  }
};
