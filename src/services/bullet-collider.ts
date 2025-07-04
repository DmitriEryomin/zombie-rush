import Phaser from 'phaser';
import { Zombie } from '../game-objects/zombie';

type Bullet = Phaser.GameObjects.Image;
type Bullets = Bullet[];
type Zombies = Zombie[];

export class BulletCollider {
  constructor() {}

  handleCollideWithZombie(scene: Phaser.Scene) {
    scene.events.on('update', () => {
      const bullets = scene.children.list.filter(
        (obj) =>
          obj instanceof Phaser.GameObjects.Image && obj.name === 'bullet'
      ) as Bullets;

      const zombies = scene.children.list.filter(
        (obj) => obj instanceof Zombie
      ) as Zombies;

      scene.physics.world.overlap(
        bullets,
        zombies,
        (bulletBody, zombieBody) => {
          const bullet = bulletBody as Bullet;
          const zombie = zombieBody as Zombie;

          zombie.takeDamage(bullet.getData('damage') || 0);

          const [bloodSplashX, bloodSplashY] =
            this.getBloodSplashPosition(zombie);
          const scale = this.getBloodSplashScale(bullet);
          this.makeBloodSplash(bloodSplashX, bloodSplashY, scene, scale);

          bullet.destroy();
        }
      );
    });
  }

  getBloodSplashPosition(zombie: Zombie): [number, number] {
    const offsetX = Phaser.Math.Between(-22, 22);
    const offsetY = Phaser.Math.Between(-22, 22);
    return [zombie.x + offsetX, zombie.y + offsetY];
  }

  getBloodSplashScale(bullet: Bullet): number {
    if (bullet.getData('type') === 'cannon-bullet') {
      return 0.6;
    }
    return Phaser.Math.FloatBetween(0.1, 0.2);
  }

  makeBloodSplash(x: number, y: number, scene: Phaser.Scene, scale: number) {
    const bloodSplash = scene.add.sprite(x, y, 'blood-splash');

    bloodSplash.setOrigin(0.5, 0.5);

    // Random scale for variety
    bloodSplash.setScale(scale);

    // Random rotation
    bloodSplash.setRotation(Phaser.Math.FloatBetween(0, Math.PI * 2));

    bloodSplash.play('blood-splash');

    // Remove the blood splash sprite once the animation completes
    bloodSplash.once('animationcomplete', () => {
      bloodSplash.destroy();
    });
  }

  static createBloodSplashAnimation(scene: Phaser.Scene) {
    scene.anims.create({
      key: 'blood-splash',
      frames: scene.anims.generateFrameNumbers('blood-splash', {
        start: 0,
        end: 15, // Adjust based on your spritesheet frame count
      }),
      frameRate: 16,
      repeat: 0, // Play once
    });
  }
}
