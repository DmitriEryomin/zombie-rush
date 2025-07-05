import Phaser from 'phaser';

import { ZombieWave } from '../game-objects/zombie-wave';
import { Zombie } from '../game-objects/zombie';
import { Base } from '../game-objects/base';
import { PathGenerator } from '../services/path-generator';
import { BulletCollider } from '../services/bullet-collider';
import { TowerBase } from '../game-objects/tower-base';
import {
  ZombieWaveConfiguration,
  type ConfigurationSubmittedEvent,
} from '../ui/zombie-wave-configuration';

export class GameScene extends Phaser.Scene {
  private zombieWaves: ZombieWave[] = [];
  private bulletCollider: BulletCollider;
  private zombieWaveConfiguration!: ZombieWaveConfiguration;
  private base!: Base;

  constructor() {
    super('GameScene');
    this.bulletCollider = new BulletCollider();
  }

  create() {
    BulletCollider.createBloodSplashAnimation(this);
    Zombie.createMoveAnimation(this);
    this.bulletCollider.handleCollideWithZombie(this);
    this.zombieWaveConfiguration = new ZombieWaveConfiguration();

    this.base = new Base(this);

    this.zombieWaveConfiguration.on(
      'configurationSubmitted',
      (event: ConfigurationSubmittedEvent) => {
        const { infinite, zombieCount, attackDirection } = event;
        if (this.zombieWaves.length === 4) {
          return;
        }

        if (
          this.zombieWaves.some(
            (wave) => wave.attackDirection === attackDirection
          )
        ) {
          alert(`A wave with direction ${attackDirection} already exists.`);
          return;
        }

        const zombieWave = new ZombieWave(
          this,
          PathGenerator.generatePathToBase(this, this.base, attackDirection),
          zombieCount,
          attackDirection,
          infinite
        );
        this.zombieWaves.push(zombieWave);
        zombieWave.attack();
      }
    );

    new TowerBase(this, 500, 250);
    new TowerBase(this, 700, 800);
    new TowerBase(this, 300, 450);
  }

  update(_time: number, _delta: number) {
    const zombies = this.children.list.filter(
      (obj) => obj instanceof Zombie
    ) as Zombie[];

    this.physics.world.collide(zombies, this.base.shape, (zombie, base) => {
      (zombie as Zombie).attack();
    });

    this.zombieWaves.filter((wave) => !wave.finished);
  }
}
