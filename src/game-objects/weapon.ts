export type WeaponTypes =
  | 'machine-gun'
  | 'machine-gun-2'
  | 'machine-gun-3'
  | 'cannon'
  | 'cannon-2'
  | 'cannon-3'
  | 'missile-launcher'
  | 'missile-launcher-2'
  | 'missile-launcher-3';

type WeaponProps = {
  imageOrigins: [number, number];
  navigationSpeed: number;
  firingRange: number;
  fireRate: number;
  barrel: {
    offset: number;
    count: number;
    offsets: number[];
  };
  bullet: {
    damage: number;
    speed: number;
    image: string;
  };
  recoil?: {
    distance: number;
    duration: number;
  };
};

const weaponsProps: Record<WeaponTypes, WeaponProps> = {
  'machine-gun': {
    imageOrigins: [0.33, 0.7],
    navigationSpeed: 0.6,
    firingRange: 300,
    barrel: {
      offset: 60,
      count: 1,
      offsets: [0], // Single barrel, no offsets
    },
    bullet: {
      damage: 5,
      speed: 500,
      image: 'bullet-mg',
    },
    fireRate: 125,
    recoil: {
      distance: 7,
      duration: 110,
    },
  },
  'machine-gun-2': {
    imageOrigins: [0.25, 0.5],
    navigationSpeed: 0.6,
    firingRange: 300,
    barrel: {
      offset: 60,
      count: 2,
      offsets: [-12, 12], // Two barrels with offsets
    },
    bullet: {
      damage: 10,
      speed: 500,
      image: 'bullet-mg',
    },
    fireRate: 150,
    recoil: {
      distance: 5,
      duration: 100,
    },
  },
  'machine-gun-3': {
    imageOrigins: [0.3, 0.65],
    navigationSpeed: 0.6,
    firingRange: 300,
    barrel: {
      offset: 65,
      count: 6,
      offsets: [-8, 0, 8],
    },
    bullet: {
      damage: 30,
      speed: 500,
      image: 'bullet-mg',
    },
    fireRate: 100,
  },
  cannon: {
    imageOrigins: [0.25, 0.5],
    navigationSpeed: 0.008,
    firingRange: 500,
    barrel: {
      offset: 60,
      count: 1,
      offsets: [0],
    },
    bullet: {
      damage: 100,
      speed: 500,
      image: 'bullet-cannon',
    },
    fireRate: 1000,
    recoil: {
      distance: 5,
      duration: 100,
    },
  },
  'cannon-2': {
    imageOrigins: [0.3, 0.5],
    navigationSpeed: 0.008,
    firingRange: 500,
    barrel: {
      offset: 60,
      count: 2,
      offsets: [-10, 10],
    },
    bullet: {
      damage: 200,
      speed: 500,
      image: 'bullet-cannon',
    },
    fireRate: 1000,
    recoil: {
      distance: 5,
      duration: 100,
    },
  },
  'cannon-3': {
    imageOrigins: [0.33, 0.5],
    navigationSpeed: 0.008,
    firingRange: 500,
    barrel: {
      offset: 60,
      count: 1,
      offsets: [0],
    },
    bullet: {
      damage: 250,
      speed: 500,
      image: 'bullet-cannon',
    },
    fireRate: 1000,
    recoil: {
      distance: 5,
      duration: 100,
    },
  },
  'missile-launcher': {
    imageOrigins: [0.3, 0.5],
    navigationSpeed: 0.2,
    firingRange: 700,
    barrel: {
      offset: 60,
      count: 1,
      offsets: [0],
    },
    bullet: {
      damage: 200,
      speed: 500,
      image: 'missile',
    },
    fireRate: 1500,
  },
  'missile-launcher-2': {
    imageOrigins: [0.45, 0.5],
    navigationSpeed: 0.2,
    firingRange: 700,
    barrel: {
      offset: 60,
      count: 2,
      offsets: [-12, 12],
    },
    bullet: {
      damage: 400,
      speed: 500,
      image: 'missile',
    },
    fireRate: 1500,
  },
  'missile-launcher-3': {
    imageOrigins: [0.45, 0.5],
    navigationSpeed: 0.2,
    firingRange: 700,
    barrel: {
      offset: 60,
      count: 3,
      offsets: [6, 0, 6],
    },
    bullet: {
      damage: 600,
      speed: 500,
      image: 'missile',
    },
    fireRate: 1500,
  },
};

export class Weapon {
  private lastFired: number = 0;
  public readonly props: WeaponProps;

  // Add new properties for recoil animation
  private isRecoiling: boolean = false;
  private recoilTween: Phaser.Tweens.Tween | null = null;
  private originalGunPosition: Phaser.Math.Vector2 = new Phaser.Math.Vector2(
    0,
    0
  );

  #gameObject: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene, type: WeaponTypes, x: number, y: number) {
    this.props = weaponsProps[type];

    this.#gameObject = scene.add
      .image(x, y, type)
      .setScale(0.28)
      .setOrigin(...this.props.imageOrigins)
      .setName(type);
  }

  get gameObject(): Phaser.GameObjects.Image {
    return this.#gameObject;
  }

  get scene(): Phaser.Scene {
    return this.#gameObject.scene;
  }

  private triggerRecoil(): void {
    if (!this.props.recoil) return;

    if (this.isRecoiling) return;

    this.isRecoiling = true;

    // Get the direction vector for recoil (opposite of gun's facing direction)
    const recoilAngle = this.gameObject.rotation - Math.PI; // Opposite direction
    const recoilVector = new Phaser.Math.Vector2(
      Math.cos(recoilAngle),
      Math.sin(recoilAngle)
    ).normalize();

    // Calculate the recoil position
    const recoilPosition = {
      x:
        this.originalGunPosition.x +
          recoilVector.x * this.props.recoil.distance || 0,
      y:
        this.originalGunPosition.y +
          recoilVector.y * this.props.recoil.distance || 0,
    };

    // Stop any existing tween
    if (this.recoilTween) {
      this.recoilTween.stop();
    }

    // Create the recoil tween
    this.recoilTween = this.scene.tweens.add({
      targets: this.gameObject,
      x: [recoilPosition.x, this.originalGunPosition.x],
      y: [recoilPosition.y, this.originalGunPosition.y],
      duration: this.props.recoil.duration || 0,
      ease: 'Power2',
      onComplete: () => {
        this.isRecoiling = false;
      },
    });
  }

  private fireBullet(barrelOffset: number): void {
    // Create bullet at gun position
    const gunPosition = new Phaser.Math.Vector2(
      this.gameObject.parentContainer.x,
      this.gameObject.parentContainer.y
    );

    // Calculate bullet direction (same as gun direction)
    const bulletAngle = this.gameObject.rotation;
    const bulletVector = new Phaser.Math.Vector2(
      Math.cos(bulletAngle),
      Math.sin(bulletAngle)
    ).normalize();

    // Create a perpendicular vector for barrel offsets
    const perpendicularVector = new Phaser.Math.Vector2(
      -bulletVector.y, // Perpendicular to bullet direction
      bulletVector.x
    ).normalize();

    // Offset the bullet starting position to appear at the gun's barrel
    const offsetDistance = this.props.barrel.offset; // Distance from center to gun barrel

    // Apply both forward offset and barrel offset
    const startX =
      gunPosition.x +
      bulletVector.x * offsetDistance +
      perpendicularVector.x * barrelOffset;

    const startY =
      gunPosition.y +
      bulletVector.y * offsetDistance +
      perpendicularVector.y * barrelOffset;

    // Create the bullet
    const bullet = this.scene.physics.add
      .image(startX, startY, this.props.bullet.image)
      .setScale(0.5)
      .setName('bullet')
      .setData('damage', this.props.bullet.damage)
      .setRotation(bulletAngle);

    // Set bullet velocity based on direction and speed
    bullet.setVelocity(
      bulletVector.x * this.props.bullet.speed,
      bulletVector.y * this.props.bullet.speed
    );

    // Destroy bullet after it travels beyond firing range
    this.scene.time.delayedCall(
      ((this.props.firingRange - this.props.barrel.offset) /
        this.props.bullet.speed) *
        1000,
      () => {
        if (bullet && bullet.active) {
          bullet.destroy();
        }
      }
    );
    if (this.props.recoil) {
      this.triggerRecoil();
    }
  }

  public navigateTo(x: number, y: number, delta: number): boolean {
    const angle = Phaser.Math.Angle.Between(
      this.gameObject.parentContainer.x,
      this.gameObject.parentContainer.y,
      x,
      y
    ); // Adjust for machine gun orientation
    const currentRotation = this.gameObject.rotation;

    // Calculate the shortest angle to rotate (handles wraparound)
    let angleDiff =
      Phaser.Math.Angle.ShortestBetween(currentRotation, angle) *
      (Math.PI / 180); // Convert to radians

    // Apply rotation based on delta time for smooth movement
    const rotationAmount = this.props.navigationSpeed * (delta / 16); // Normalize for 60fps

    // Determine if we need to rotate and by how much
    if (Math.abs(angleDiff) > 0.001) {
      // Threshold to prevent jittering
      // Move a step toward the target angle
      const step =
        Math.sign(angleDiff) * Math.min(rotationAmount, Math.abs(angleDiff));
      this.gameObject.rotation = Phaser.Math.Angle.Wrap(
        this.gameObject.rotation + step
      );
      return false; // Indicate that weapon is still navigating
    } else {
      // Close enough, snap to exact angle
      this.gameObject.rotation = angle;

      return true; // Indicate that weapon reached the target angle
    }
  }

  public fire(time: number): void {
    if (time < this.lastFired + this.props.fireRate) return;

    for (const offsetY of this.props.barrel.offsets) {
      this.fireBullet(offsetY);
    }
    this.lastFired = time;
  }
}
