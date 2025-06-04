import { Weapon, type WeaponTypes } from './weapon';
import { Zombie } from './zombie';

export class Tower extends Phaser.GameObjects.Container {
  private patrolSpeed: number = 0.002;

  private closestZombie: Zombie | undefined;
  private weapon: Weapon;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    weaponType: WeaponTypes
  ) {
    super(scene, x, y);

    const tower = scene.add
      .image(0, 0, 'tower')
      .setName('tower')
      .setScale(0.25);

    this.weapon = new Weapon(scene, weaponType, 0, 0);

    this.add(tower);
    this.add(this.weapon.gameObject);
    // Uncomment to visualize firing range
    scene.add.circle(x, y, this.weapon.props.firingRange, 0x000000, 0.1);

    scene.add.existing(this);
  }

  get gun() {
    return this.weapon.gameObject;
  }

  update(time: number, delta: number) {
    // Find closest zombie
    if (!this.closestZombie?.active) {
      const zombies = this.scene.children.list.filter(
        (obj) => obj instanceof Zombie
      ) as Zombie[];
      for (const zombie of zombies) {
        if (zombie.active) {
          const distance = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            zombie.x,
            zombie.y
          );
          if (distance <= this.weapon.props.firingRange) {
            this.closestZombie = zombie;
          }
        }
      }
    }

    // If we found a zombie nearby, aim at it
    if (this.closestZombie?.active) {
      const targetFixed = this.weapon.navigateTo(
        this.closestZombie.x,
        this.closestZombie.y,
        delta
      );
      if (targetFixed) {
        this.weapon.fire(time);
      }
    } else {
      this.gun.rotation += this.patrolSpeed;
    }
  }
}
