import Phaser from 'phaser';

const getAssetSrc = (name: string) => {
  const path = `/src/assets/${name}`;
  const modules = import.meta.glob(`/src/assets/**/*`, { eager: true });
  const mod = modules[path] as { default: string };
  return mod.default;
};

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  createProgressBar() {
    const centerX = this.cameras.main.width / 2;
    const progressBox = this.add.graphics();
    const width = 780;
    const height = 50;
    progressBox.fillStyle(0xc66614);
    progressBox.fillRoundedRect(
      centerX - width / 2,
      this.cameras.main.height * 0.93,
      width,
      height,
      10
    );

    const progressBar = this.add.graphics();
    progressBar.fillStyle(0x771b08, 1);
    progressBar.fillRoundedRect(
      centerX - width / 2,
      this.cameras.main.height * 0.93,
      0,
      height,
      10
    );

    return { progressBox, progressBar };
  }

  preload() {
    this.add.image(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      'logo'
    );
    const { progressBox, progressBar } = this.createProgressBar();

    // Display progress
    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0x771b08, 1);
      progressBar.fillRoundedRect(
        this.cameras.main.centerX - 390,
        this.cameras.main.height * 0.93,
        780 * value,
        50,
        10
      );
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
    });

    // Load all game assets
    this.loadAssets();
  }

  loadAssets() {
    // Towers
    this.load.image('tower', getAssetSrc('tower/Tower.png'));
    this.load.image('machine-gun', getAssetSrc('tower/MG.png'));
    this.load.image('button', getAssetSrc('ui/button.png'));

    const frameCount = 16; // Adjust based on how many frames you have
    for (let i = 0; i < frameCount; i++) {
      this.load.image(
        `skeleton-move_${i}`,
        getAssetSrc(`zombie/skeleton-move_${i}.png`)
      );
    }
  }

  create() {
    this.scene.start('MainMenuScene');
  }
}
