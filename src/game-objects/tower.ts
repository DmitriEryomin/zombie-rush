import { Zombie } from './zombie';

type GunNames =
  | 'machine-gun'
  | 'machine-gun-2'
  | 'machine-gun-3'
  | 'cannon'
  | 'cannon-2'
  | 'cannon-3'
  | 'missile-launcher'
  | 'missile-launcher-2'
  | 'missile-launcher-3';

const gunOrigins = {
  'machine-gun': [0.33, 0.7],
  'machine-gun-2': [0.33, 0.5],
  'machine-gun-3': [0.3, 0.65],
  cannon: [0.25, 0.5],
  'cannon-2': [0.3, 0.5],
  'cannon-3': [0.33, 0.5],
  'missile-launcher': [0.3, 0.5],
  'missile-launcher-2': [0.45, 0.5],
  'missile-launcher-3': [0.45, 0.5],
};

const gunNavigationSpeeds = {
  'machine-gun': 0.6,
  'machine-gun-2': 0.6,
  'machine-gun-3': 0.6,
  cannon: 0.008,
  'cannon-2': 0.008,
  'cannon-3': 0.008,
  'missile-launcher': 0.2,
  'missile-launcher-2': 0.2,
  'missile-launcher-3': 0.2,
};

const gunFiringRanges = {
  'machine-gun': 300,
  'machine-gun-2': 300,
  'machine-gun-3': 300,
  cannon: 500,
  'cannon-2': 500,
  'cannon-3': 500,
  'missile-launcher': 700,
  'missile-launcher-2': 700,
  'missile-launcher-3': 700,
};

const bulletImages = {
  cannon: 'bullet-cannon',
  'cannon-2': 'bullet-cannon',
  'cannon-3': 'bullet-cannon',
  'machine-gun': 'bullet-mg',
  'machine-gun-2': 'bullet-mg',
  'machine-gun-3': 'bullet-mg',
  'missile-launcher': 'missile',
  'missile-launcher-2': 'missile',
  'missile-launcher-3': 'missile',
};

export class Tower extends Phaser.GameObjects.Container {
  private patrolSpeed: number = 0.002;
  private navigationSpeed: number;

  private closestZombie: Zombie | undefined;
  private firingRange: number; // Distance to the closest zombie
  private gunName: GunNames;

  private bulletImage: string;
  private lastFired: number = 0;
  private fireRate: number = 150; // Time between shots in ms
  private bulletSpeed: number = 500; // Speed of bullets
  private bulletDamage: number = 10; // Damage per bullet

  // Add new properties for recoil animation
  private isRecoiling: boolean = false;
  private recoilDistance: number = 7; // Pixels to move backward
  private recoilDuration: number = 150; // Duration in ms
  private recoilTween: Phaser.Tweens.Tween | null = null;
  private originalGunPosition: Phaser.Math.Vector2 = new Phaser.Math.Vector2(
    0,
    0
  );

  constructor(scene: Phaser.Scene, x: number, y: number, gunName: GunNames) {
    super(scene, x, y);
    this.gunName = gunName;
    this.navigationSpeed = gunNavigationSpeeds[gunName];
    this.firingRange = gunFiringRanges[gunName];
    this.bulletImage = bulletImages[gunName];

    const tower = scene.add
      .image(0, 0, 'tower')
      .setName('tower')
      .setScale(0.25);

    const machineGun = scene.add
      .image(0, 0, gunName)
      .setScale(0.28)
      .setOrigin(...gunOrigins[gunName])
      .setName(gunName);

    // Store the original position of the gun
    this.originalGunPosition = new Phaser.Math.Vector2(
      machineGun.x,
      machineGun.y
    );

    this.add(tower);
    this.add(machineGun);
    // Uncomment to visualize firing range
    // scene.add.circle(x, y, this.firingRange, 0x000000, 0.1);

    scene.add.existing(this);
  }

  get gun() {
    return this.getByName(this.gunName) as Phaser.GameObjects.Image;
  }

  // Add method to trigger recoil animation
  private triggerRecoil(): void {
    if (this.isRecoiling) return; // Don't start a new recoil if one is in progress

    this.isRecoiling = true;

    // Get the direction vector for recoil (opposite of gun's facing direction)
    const recoilAngle = this.gun.rotation - Math.PI; // Opposite direction
    const recoilVector = new Phaser.Math.Vector2(
      Math.cos(recoilAngle),
      Math.sin(recoilAngle)
    ).normalize();

    // Calculate the recoil position
    const recoilPosition = {
      x: this.originalGunPosition.x + recoilVector.x * this.recoilDistance,
      y: this.originalGunPosition.y + recoilVector.y * this.recoilDistance,
    };

    // Stop any existing tween
    if (this.recoilTween) {
      this.recoilTween.stop();
    }

    // Create the recoil tween
    this.recoilTween = this.scene.tweens.add({
      targets: this.gun,
      x: [recoilPosition.x, this.originalGunPosition.x],
      y: [recoilPosition.y, this.originalGunPosition.y],
      duration: this.recoilDuration,
      ease: 'Power2',
      onComplete: () => {
        this.isRecoiling = false;
      },
    });
  }

  private fireBullet(time: number): void {
    // Check if enough time has passed since last firing
    if (time < this.lastFired + this.fireRate) return;

    this.lastFired = time;

    // Create bullet at gun position
    const gunPosition = new Phaser.Math.Vector2(this.x, this.y);

    // Calculate bullet direction (same as gun direction)
    const bulletAngle = this.gun.rotation;
    const bulletVector = new Phaser.Math.Vector2(
      Math.cos(bulletAngle),
      Math.sin(bulletAngle)
    ).normalize();

    // Offset the bullet starting position to appear at the gun's barrel
    const offsetDistance = 60; // Distance from center to gun barrel
    const startX = gunPosition.x + bulletVector.x * offsetDistance;
    const startY = gunPosition.y + bulletVector.y * offsetDistance;

    // Create the bullet
    const bullet = this.scene.physics.add
      .image(startX, startY, this.bulletImage)
      .setScale(0.5)
      .setRotation(bulletAngle);

    // Set bullet velocity based on direction and speed
    bullet.setVelocity(
      bulletVector.x * this.bulletSpeed,
      bulletVector.y * this.bulletSpeed
    );

    // Destroy bullet after it travels beyond firing range
    this.scene.time.delayedCall(
      ((this.firingRange * 2) / this.bulletSpeed) * 1000,
      () => {
        if (bullet && bullet.active) {
          bullet.destroy();
        }
      }
    );

    // Trigger recoil animation
    this.triggerRecoil();
  }

  update(_time: number, delta: number) {
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
          if (distance <= this.firingRange) {
            this.closestZombie = zombie;
          }
        }
      }
    }

    // If we found a zombie nearby, aim at it
    if (this.closestZombie?.active) {
      const angle = Phaser.Math.Angle.Between(
        this.x,
        this.y,
        this.closestZombie.x,
        this.closestZombie.y
      ); // Adjust for machine gun orientation
      const currentRotation = this.gun.rotation;

      // Calculate the shortest angle to rotate (handles wraparound)
      let angleDiff =
        Phaser.Math.Angle.ShortestBetween(currentRotation, angle) *
        (Math.PI / 180); // Convert to radians

      // Apply rotation based on delta time for smooth movement
      const rotationAmount = this.navigationSpeed * (delta / 16); // Normalize for 60fps

      // Determine if we need to rotate and by how much
      if (Math.abs(angleDiff) > 0.001) {
        // Threshold to prevent jittering
        // Move a step toward the target angle
        const step =
          Math.sign(angleDiff) * Math.min(rotationAmount, Math.abs(angleDiff));
        this.gun.rotation = Phaser.Math.Angle.Wrap(this.gun.rotation + step);
      } else {
        // Close enough, snap to exact angle
        this.gun.rotation = angle;
        // Fire the gun with recoil animation
        this.triggerRecoil();
        // You can add other firing effects here (sound, bullets, etc.)
        this.fireBullet(_time);
      }
    } else {
      this.gun.rotation += this.patrolSpeed;
    }
  }
}
