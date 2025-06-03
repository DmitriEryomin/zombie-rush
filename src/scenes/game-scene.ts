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

  update(time: number, delta: number) {
    this.zombieWaves.forEach((wave) => {
      wave.update(time, delta);
    });
    this.base.update(time, delta);
  }
}
