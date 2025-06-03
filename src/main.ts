import Phaser from 'phaser';
import './style.css';

import { BootScene } from './scenes/boot-scene';
import { PreloadScene } from './scenes/preload-scene';
import { MainMenuScene } from './scenes/main-menu-scene';
import { GameScene } from './scenes/game-scene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  scene: [BootScene, PreloadScene, MainMenuScene, GameScene],
  disableContextMenu: true,
  backgroundColor: '#fff',
  physics: {
    default: 'arcade',
    arcade: { debug: false },
  },
};

new Phaser.Game(config);
