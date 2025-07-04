import Phaser from 'phaser';

import { ZombieWave } from '../game-objects/zombie-wave';
import { Zombie } from '../game-objects/zombie';
import { Base } from '../game-objects/base';
import { PathGenerator } from '../services/path-generator';
import { BulletCollider } from '../services/bullet-collider';

export class GameScene extends Phaser.Scene {
  private zombieWaves: ZombieWave[] = [];
  private bulletCollider: BulletCollider;
  private base!: Base;

  constructor() {
    super('GameScene');
    this.bulletCollider = new BulletCollider();
  }

  create() {
    BulletCollider.createBloodSplashAnimation(this);
    Zombie.createMoveAnimation(this);
    this.base = new Base(this);

    this.zombieWaves = [
      new ZombieWave(
        this,
        PathGenerator.generatePathToBase(this, this.base, 'top'),
        14
      ),
      new ZombieWave(
        this,
        PathGenerator.generatePathToBase(this, this.base, 'left'),
        13
      ),
      new ZombieWave(
        this,
        PathGenerator.generatePathToBase(this, this.base, 'down'),
        12
      ),
      new ZombieWave(
        this,
        PathGenerator.generatePathToBase(this, this.base, 'right'),
        15
      ),
    ];

    this.zombieWaves.forEach((wave) => {
      wave.attack();
    });

    this.bulletCollider.handleCollideWithZombie(this);
  }

  update(_time: number, _delta: number) {
    const zombies = this.children.list.filter(
      (obj) => obj instanceof Zombie
    ) as Zombie[];

    this.physics.world.collide(zombies, this.base.shape, (zombie, base) => {
      (zombie as Zombie).attack();
    });
  }
}
