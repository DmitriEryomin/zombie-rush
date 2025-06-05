import Phaser from 'phaser';

import { Tower } from './tower';

export class Base {
  private health: number;
  private maxHealth: number;

  #shape: Phaser.GameObjects.Rectangle;

  #width = 240;
  #height = 140;

  towers: Tower[] = [];

  constructor(scene: Phaser.Scene) {
    const x = scene.cameras.main.centerX - this.#width / 2;
    const y = scene.cameras.main.centerY - this.#height / 2;

    this.health = 100;
    this.maxHealth = 100;

    this.#shape = scene.add
      .rectangle(x, y, this.#width, this.#height, 0x000000, 0.1)
      .setName('base')
      .setOrigin(0, 0);

    // Add physics to the shape
    scene.physics.add.existing(this.#shape); // true makes it a static body

    // Enable collision detection
    if (this.#shape.body) {
      const body = this.#shape.body as Phaser.Physics.Arcade.Body;
      body.setCollideWorldBounds(true);
      // body.debugBodyColor = 0xff0000; // Set debug color for the body
    }

    this.towers = [
      new Tower(scene, x, y, 'machine-gun'),
      new Tower(scene, x + this.#width, y, 'machine-gun-2'),
      new Tower(scene, x, y + this.#height, 'machine-gun-3'),
      new Tower(scene, x + this.#width, y + this.#height, 'machine-gun'),
    ];
  }

  takeDamage(amount: number) {
    this.health -= amount;
    if (this.health <= 0) {
      this.#shape.destroy();
    }
  }

  getHealth() {
    return this.health;
  }

  getMaxHealth() {
    return this.maxHealth;
  }

  get shape() {
    return this.#shape;
  }

  get x() {
    return this.#shape.x;
  }

  get y() {
    return this.#shape.y;
  }

  get width() {
    return this.#shape.width;
  }

  get height() {
    return this.#shape.height;
  }
}
