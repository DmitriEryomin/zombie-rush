import Phaser from 'phaser';
import { Zombie } from './zombie';

export class Base {
  private health: number;
  private maxHealth: number;

  private shape: Phaser.GameObjects.Rectangle;
  private mg: Phaser.GameObjects.Image;
  private scene: Phaser.Scene;
  private patrolAngle: number = 0; // Start facing top direction
  private patrolSpeed: number = 0.01;

  private angleRange = [Math.PI / 2, -Math.PI / 2]; // Range of angles to patrol between

  #width = 240;
  #height = 140;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    const x = scene.cameras.main.width / 2 - this.#width / 2;
    const y = scene.cameras.main.height / 2 - this.#height / 2;

    this.health = 100;
    this.maxHealth = 100;

    this.shape = scene.add.rectangle(
      x,
      y,
      this.#width,
      this.#height,
      0x000000,
      0.1
    );
    this.shape.setOrigin(0, 0);
    scene.add.image(x, y, 'tower').setScale(0.25);
    this.mg = scene.add
      .image(x, y, 'machine-gun')
      .setScale(0.3)
      .setOrigin(0.65, 0.7);

    // Set initial rotation to face top
    this.mg.setRotation(this.patrolAngle);
  }

  takeDamage(amount: number) {
    this.health -= amount;
    if (this.health <= 0) {
      this.shape.destroy();
    }
  }

  getHealth() {
    return this.health;
  }

  getMaxHealth() {
    return this.maxHealth;
  }

  update(_time: number, _delta: number) {
    // Get center position of the base for calculations
    const centerX = this.mg.x;
    const centerY = this.mg.y;

    // Find closest zombie
    const zombies = this.scene.children.list.filter(
      (obj) => obj instanceof Zombie && obj.y < centerY
    ) as Zombie[];

    let closestZombie = null;
    let closestDistance = Number.MAX_VALUE;

    for (const zombie of zombies) {
      if (zombie.active) {
        const distance = Phaser.Math.Distance.Between(
          centerX,
          centerY,
          zombie.x,
          zombie.y
        );

        if (distance < closestDistance) {
          closestDistance = distance;
          closestZombie = zombie;
        }
      }
    }

    // If we found a zombie nearby, aim at it
    if (closestZombie && closestDistance < 300) {
      const angle = Phaser.Math.Angle.Between(
        centerX,
        centerY,
        closestZombie.x,
        closestZombie.y
      );

      const realAngle = angle + Math.PI / 2;

      // console.log({ l: -Math.PI / 2, r: Math.PI / 2, realAngle });\
      // const [l, r] = this.angleRange;
      // if (realAngle < r && realAngle > l) {
      this.mg.setRotation(realAngle);
      // }

      // this.patrolAngle = realAngle; // Set patrol angle to the zombie's angle
    } else {
      const baseAngle = Math.PI / 2;
      this.patrolAngle += this.patrolSpeed;
      if (this.patrolAngle > baseAngle) {
        this.patrolAngle = baseAngle - (this.patrolAngle - baseAngle);
        this.patrolSpeed *= -1;
      }
      if (this.patrolAngle < -baseAngle) {
        this.patrolSpeed *= -1;
      }
      this.mg.setRotation(this.patrolAngle);
    }
  }

  get x() {
    return this.shape.x;
  }

  get y() {
    return this.shape.y;
  }

  get width() {
    return this.shape.width;
  }

  get height() {
    return this.shape.height;
  }
}
