import Phaser from 'phaser';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  create() {
    const height = this.cameras.main.height;

    const logo = this.add.image(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      'logo'
    );
    // Scale the logo to fill the screen width
    const screenWidth = this.cameras.main.height;
    const scale = screenWidth / logo.height;
    logo.setScale(scale);

    const startButton = this.add
      .image(this.cameras.main.centerX, height * 0.95, 'button')
      .setDisplaySize(225, 90)
      .setInteractive();

    this.add
      .text(this.cameras.main.centerX, height * 0.95, 'Start Game', {
        font: '28px RussoOne',
        color: '#facd4b',
        resolution: 2,
      })
      .setOrigin(0.5);

    startButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    startButton.on('pointerover', () => {
      startButton.setInteractive({ useHandCursor: true });
      startButton.setTint(0xaacbf8);
    });

    startButton.on('pointerout', () => {
      startButton.setInteractive({ useHandCursor: false });
      startButton.clearTint();
    });
  }
}
