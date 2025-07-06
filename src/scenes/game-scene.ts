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
    this.generateBackground();

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
    new TowerBase(this, 900, 550);
    // fill all scene with desert texture
  }

  generateBackground() {
    for (let i = 0; i < this.scale.width; i += 89) {
      for (let j = 0; j < this.scale.height; j += 89) {
        this.add.image(i, j, 'ground');
      }
    }

    // TODO: create Car class
    this.add.image(400, 350, 'car_1_shadow').setScale(0.14).setAngle(35);
    this.add.image(400, 350, 'car_1').setScale(0.13).setAngle(35);
    //
    this.add.image(850, 250, 'car_2_shadow').setScale(0.14).setAngle(20);
    this.add.image(850, 250, 'car_2').setScale(0.13).setAngle(20);
    //
    this.add.image(850, 850, 'car_3_shadow').setScale(0.14).setAngle(80);
    this.add.image(850, 850, 'car_3').setScale(0.13).setAngle(80);
  }

  update(_time: number, _delta: number) {
    const zombies = this.children.list.filter(
      (obj) => obj instanceof Zombie
    ) as Zombie[];

    this.physics.world.collide(zombies, this.base.shape, (zombie, _base) => {
      (zombie as Zombie).attack();
    });

    this.zombieWaves.filter((wave) => !wave.finished);
  }
}
