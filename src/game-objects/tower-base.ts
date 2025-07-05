import { Tower } from './tower';
import type { WeaponTypes } from './weapon';

const correctWeaponTypes = [
  'cannon',
  'machine-gun',
  'machine-gun-2',
  'machine-gun-3',
  'cannon-2',
  'cannon-3',
];

const getPoints = (x: number, y: number) => [
  new Phaser.Geom.Point(x - 16, y - 16), // Top left
  new Phaser.Geom.Point(x + 16, y - 16), // Top right
  new Phaser.Geom.Point(x + 32, y + 8), // Right
  new Phaser.Geom.Point(x + 16, y + 32), // Bottom right
  new Phaser.Geom.Point(x - 16, y + 32), // Bottom left
  new Phaser.Geom.Point(x - 32, y + 8), // Left
];

export class TowerBase {
  x: number;
  y: number;
  scene: Phaser.Scene;
  towerBase: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.x = x;
    this.y = y;
    this.scene = scene;

    // hexagon for the tower base
    const polygon = new Phaser.Geom.Polygon(getPoints(x, y));
    this.towerBase = scene.add
      .graphics({
        fillStyle: { color: 0xfacd4b },
        lineStyle: { width: 2, color: 0x000000, alpha: 1 },
      })
      .fillPoints(polygon.points, true)
      .strokePoints(polygon.points, true)
      .setInteractive(polygon, Phaser.Geom.Polygon.Contains);

    this.towerBase.on('pointerdown', () => {
      const weapon = prompt(
        `Please enter the tower weapon: ${correctWeaponTypes.join(', ')}`,
        'machine-gun'
      );
      this.addTower(weapon);
    });
  }

  addTower(weapon: string | null) {
    if (!weapon) {
      alert('No weapon specified for the tower.');
      return;
    }

    if (!correctWeaponTypes.includes(weapon)) {
      alert(
        `Invalid weapon type. Please choose from: ${correctWeaponTypes.join(
          ', '
        )}`
      );
      return;
    }

    const tower = new Tower(this.scene, this.x, this.y);
    tower.addWeapon(weapon as WeaponTypes, 0);
    this.towerBase.destroy();
  }
}
