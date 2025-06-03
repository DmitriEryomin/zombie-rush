import Phaser from 'phaser';

import { Tower } from './tower';

export class Base {
  private health: number;
  private maxHealth: number;

  private shape: Phaser.GameObjects.Rectangle;

  #width = 240;
  #height = 140;

  towers: Tower[] = [];

  constructor(scene: Phaser.Scene) {
    const x = scene.cameras.main.centerX - this.#width / 2;
    const y = scene.cameras.main.centerY - this.#height / 2;

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
    this.towers.forEach((tower) => {
      tower.update(_time, _delta);
    });
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
