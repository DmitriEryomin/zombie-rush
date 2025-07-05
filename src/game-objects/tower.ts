import { Weapon, type WeaponTypes } from './weapon';
import { Zombie } from './zombie';

export class Tower extends Phaser.GameObjects.Container {
  private patrolSpeed: number = 0.002;

  private closestZombie: Zombie | undefined;
  private weapon: Weapon | null = null;
  private firingRange?: Phaser.GameObjects.Arc;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    const tower = scene.add
      .image(0, 0, 'tower')
      .setName('tower')
      .setScale(0.25);

    this.add(tower);
    scene.add.existing(this);
  }

  /**
   * Adds a weapon to the tower.
   * @param weaponType The type of weapon to add.
   * @param weaponInitialRotationDegree The initial rotation of the weapon in degrees.
   */
  addWeapon(weaponType: WeaponTypes, weaponInitialRotationDegree: number = 0) {
    this.weapon = new Weapon(this.scene, weaponType, 0, 0);
    this.weapon.gameObject.setRotation(
      Phaser.Math.DegToRad(weaponInitialRotationDegree)
    );
    this.firingRange = this.scene.add.circle(
      0,
      0,
      this.weapon.props.firingRange,
      0x000,
      // Set more alpha to visualize firing range
      0
    );
    this.add([this.firingRange, this.weapon.gameObject]);

    this.scene.physics.add.existing(this.firingRange);
    if (this.firingRange.body) {
      const body = this.firingRange.body as Phaser.Physics.Arcade.Body;
      body.setCircle(this.weapon.props.firingRange); // Set the body to be a circle
      body.setCollideWorldBounds(true);
    }

    this.scene.events.on('update', this.handleUpdate, this);
  }

  private handleUpdate(time: number, delta: number) {
    if (!this.weapon) {
      return;
    }

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
    if (!this.weapon || !this.firingRange) {
      return;
    }

    this.weapon.gameObject.rotation += this.patrolSpeed;

    const arcadeBodiesInRange = this.scene.physics
      .overlapCirc(this.x, this.y, this.firingRange.radius)
      .filter(
        (obj) => obj.gameObject instanceof Zombie && obj.gameObject.active
      );

    type Closest = {
      zombie: Zombie | null;
      distance: number;
    };

    // Find the closest zombie in range
    const { zombie } = arcadeBodiesInRange.reduce(
      (closest, arcadeBody) => {
        const distance = Phaser.Math.Distance.Between(
          this.x,
          this.y,
          (arcadeBody.gameObject as Zombie).x,
          (arcadeBody.gameObject as Zombie).y
        );
        if (!closest || distance < closest.distance) {
          return { zombie: arcadeBody.gameObject as Zombie, distance };
        }
        return closest;
      },
      { zombie: null, distance: Infinity } as Closest
    );

    if (zombie) {
      this.closestZombie = zombie;
    }
  }
}
