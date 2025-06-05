import { Weapon, type WeaponTypes } from './weapon';
import { Zombie } from './zombie';

export class Tower extends Phaser.GameObjects.Container {
  private patrolSpeed: number = 0.002;

  private closestZombie: Zombie | undefined;
  private weapon: Weapon;
  private firingRange: Phaser.GameObjects.Arc;

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
    this.firingRange = scene.add.circle(
      x,
      y,
      this.weapon.props.firingRange,
      0x000,
      // Set more alpha to visualize firing range
      0
    );
    scene.physics.add.existing(this.firingRange);
    if (this.firingRange.body) {
      const body = this.firingRange.body as Phaser.Physics.Arcade.Body;
      body.setCircle(this.weapon.props.firingRange); // Set the body to be a circle
      body.setCollideWorldBounds(true);
    }

    scene.add.existing(this);
    scene.events.on('update', this.update, this);
  }

  get gun() {
    return this.weapon.gameObject;
  }

  update(time: number, delta: number) {
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
      this.patrol();
    }
  }

  private patrol() {
    this.gun.rotation += this.patrolSpeed;

    const zombies = this.scene.children.list.filter(
      (obj) => obj instanceof Zombie && obj.active
    ) as Zombie[];

    this.scene.physics.overlap(this.firingRange, zombies, (_, zombie) => {
      if (this.closestZombie?.active) {
        return;
      }

      this.closestZombie = zombie as Zombie;
    });
  }
}
