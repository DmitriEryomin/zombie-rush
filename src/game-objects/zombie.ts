import Phaser from 'phaser';

export class Zombie extends Phaser.Physics.Arcade.Sprite {
  private path: Phaser.Curves.Path;
  private pathPosition: number = 0;
  private speed: number;
  private health = 100;
  private readonly baseSpeed = 1 / 30000;

  constructor(scene: Phaser.Scene, path: Phaser.Curves.Path) {
    // Initialize at the start of the path
    const startPoint = path.getStartPoint();
    super(scene, startPoint.x, startPoint.y, 'zombie', 0);
    this.setDisplaySize(83, 90);

    // Add to scene and physics
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Configure physics body for collision
    if (this.body) {
      // Set the body size to be smaller than the sprite
      this.setBodySize(this.width * 0.5, this.height * 0.5);
    }

    // Store path
    this.path = path;

    // Calculate speed based on path length to maintain consistent movement speed
    const pathLength = path.getLength();
    this.speed = this.baseSpeed * (1000 / pathLength);

    // Setup zombie
    this.play('zombie-walk');
    this.scene.events.on('update', this.update, this);
  }

  update(_time: number, delta: number) {
    if (this.health <= 0) {
      // If health is 0 or less, destroy the zombie
      this.destroy();
      return;
    }
    // Store the previous position before updating
    const prevX = this.x;
    const prevY = this.y;

    // Update position on path
    this.pathPosition += this.speed * delta;
    const newPos = this.path.getPoint(this.pathPosition);

    if (newPos) {
      // Set the new position
      this.setPosition(newPos.x, newPos.y);

      // Calculate rotation based on previous and new positions
      if (
        Math.abs(newPos.x - prevX) > 0.1 ||
        Math.abs(newPos.y - prevY) > 0.1
      ) {
        const rotation = Phaser.Math.Angle.Between(
          prevX,
          prevY,
          newPos.x,
          newPos.y
        );
        this.setRotation(rotation);
      }
    }
  }

  attack() {
    // If already attacking, do nothing
    if (
      this.anims.isPlaying &&
      this.anims.currentAnim?.key === 'zombie-attack'
    ) {
      return;
    }
    // Play attack animation
    this.play('zombie-attack');

    // Logic for attacking the base can be added here
    // For example, you could deal damage to the base or trigger an event
    console.log('Zombie is attacking!');
    // trigger event
    this.scene.events.emit('zombie-attacking', this);
  }

  takeDamage(amount: number) {
    // Logic for taking damage can be added here
    console.log(`Zombie took ${amount} damage!`);

    // Random offset from zombie position
    const offsetX = Phaser.Math.Between(-22, 22);
    const offsetY = Phaser.Math.Between(-22, 22);

    // Create blood splash with random position and scale
    const bloodSplash = this.scene.add.sprite(
      this.x + offsetX,
      this.y + offsetY,
      'blood-splash'
    );

    bloodSplash.setOrigin(0.5, 0.5);

    // Random scale for variety
    const scale = Phaser.Math.FloatBetween(0.1, 0.2);
    bloodSplash.setScale(scale);

    // Random rotation
    bloodSplash.setRotation(Phaser.Math.FloatBetween(0, Math.PI * 2));

    bloodSplash.play('blood-splash');

    // Remove the blood splash sprite once the animation completes
    bloodSplash.once('animationcomplete', () => {
      bloodSplash.destroy();
    });

    // Reduce health
    this.health -= amount;
  }

  static createMoveAnimation(scene: Phaser.Scene) {
    scene.anims.create({
      key: 'zombie-walk',
      frames: scene.anims.generateFrameNumbers('zombie', {
        start: 0,
        end: 16, // Adjust based on your spritesheet frame count
      }),
      frameRate: 16,
      repeat: -1, // -1 means loop infinitely
    });
    scene.anims.create({
      key: 'zombie-attack',
      frames: scene.anims.generateFrameNumbers('zombie-attack', {
        start: 0,
        end: 8, // Adjust based on your spritesheet frame count
      }),
      frameRate: 6,
      repeat: -1, // -1 means loop infinitely
    });
    scene.anims.create({
      key: 'blood-splash',
      frames: scene.anims.generateFrameNumbers('blood-splash', {
        start: 0,
        end: 15, // Adjust based on your spritesheet frame count
      }),
      frameRate: 16,
      repeat: 0, // Play once
    });
  }
}
