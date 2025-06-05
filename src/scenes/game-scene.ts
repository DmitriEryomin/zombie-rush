import Phaser from 'phaser';

import { ZombieWave } from '../game-objects/zombie-wave';
import { Zombie } from '../game-objects/zombie';
import { Base } from '../game-objects/base';
import { PathGenerator } from '../services/path-generator';

export class GameScene extends Phaser.Scene {
  private zombieWaves: ZombieWave[] = [];
  private base!: Base;

  constructor() {
    super('GameScene');
  }

  create() {
    Zombie.createMoveAnimation(this);
    this.base = new Base(this);

    this.zombieWaves = [
      new ZombieWave(
        this,
        PathGenerator.generatePathToBase(this, this.base, 'top'),
        4
      ),
      new ZombieWave(
        this,
        PathGenerator.generatePathToBase(this, this.base, 'left'),
        3
      ),
      new ZombieWave(
        this,
        PathGenerator.generatePathToBase(this, this.base, 'down'),
        2
      ),
      new ZombieWave(
        this,
        PathGenerator.generatePathToBase(this, this.base, 'right'),
        5
      ),
    ];
  }

  update(_time: number, _delta: number) {
    const zombies = this.children.list.filter(
      (obj) => obj instanceof Zombie
    ) as Zombie[];

    this.physics.world.collide(zombies, this.base.shape, (zombie, base) => {
      (zombie as Zombie).attack();
    });

    const bullets = this.children.list.filter(
      (obj) => obj instanceof Phaser.GameObjects.Image && obj.name === 'bullet'
    ) as Phaser.GameObjects.Image[];
    this.physics.world.overlap(bullets, zombies, (bulletBody, zombieBody) => {
      const bullet = bulletBody as Phaser.GameObjects.Image;
      const zombie = zombieBody as Zombie;

      zombie.takeDamage(bullet.getData('damage') || 0);
      bullet.destroy();
    });
  }
}
