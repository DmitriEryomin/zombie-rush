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

    // Machine Guns
    this.load.image('machine-gun', getAssetSrc('tower/MG.png'));
    this.load.image('machine-gun-2', getAssetSrc('tower/MG2.png'));
    this.load.image('machine-gun-3', getAssetSrc('tower/MG3.png'));

    // Cannons
    this.load.image('cannon', getAssetSrc('tower/Cannon.png'));
    this.load.image('cannon-2', getAssetSrc('tower/Cannon2.png'));
    this.load.image('cannon-3', getAssetSrc('tower/Cannon3.png'));

    // Missile launchers
    this.load.image(
      'missile-launcher',
      getAssetSrc('tower/Missile_Launcher.png')
    );
    this.load.image(
      'missile-launcher-2',
      getAssetSrc('tower/Missile_Launcher2.png')
    );
    this.load.image(
      'missile-launcher-3',
      getAssetSrc('tower/Missile_Launcher3.png')
    );

    // bullets
    this.load.image('bullet-cannon', getAssetSrc('tower/Bullet_Cannon.png'));
    this.load.image('bullet-mg', getAssetSrc('tower/Bullet_MG.png'));
    this.load.image('missile', getAssetSrc('tower/Missile.png'));

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
