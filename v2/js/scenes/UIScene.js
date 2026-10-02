PAD2.UIScene=class extends Phaser.Scene{
  constructor(){super('UIScene')}
  create(){
    this.scene.bringToTop();
    PAD2.ui.refresh();
  }
};