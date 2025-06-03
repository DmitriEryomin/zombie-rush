import Phaser from 'phaser';

import logo from '../assets/logo.png';
import font from '../assets/fonts/RussoOne-Regular.ttf';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    this.load.image('logo', logo);
    this.load.font('RussoOne', font, 'truetype');
  }

  create() {
    this.scene.start('PreloadScene');
  }
}
