import Phaser from 'phaser';

export class Zombie extends Phaser.Physics.Arcade.Sprite {
  private path: Phaser.Curves.Path;
  private pathPosition: number = 0;
  private speed: number;
  private readonly baseSpeed = 1 / 30000;

  constructor(scene: Phaser.Scene, path: Phaser.Curves.Path) {
    // Initialize at the start of the path
    const startPoint = path.getStartPoint();
    super(scene, startPoint.x, startPoint.y, 'zombie');

    // Add to scene and physics
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Store path
    this.path = path;

    // Calculate speed based on path length to maintain consistent movement speed
    const pathLength = path.getLength();
    this.speed = this.baseSpeed * (1000 / pathLength);

    // Setup zombie
    this.setDisplaySize(8, 8);
    this.play('zombie-walk');
  }

  update(_time: number, delta: number) {
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
        this.setRotation(
          Phaser.Math.Angle.Between(prevX, prevY, newPos.x, newPos.y)
        );
      }
    } else {
      // Enemy reached the end
      this.destroy();
    }
  }

  static createMoveAnimation(scene: Phaser.Scene) {
    const frameNames = Array.from({ length: 16 }, (_, i) => ({
      key: `skeleton-move_${i}`,
    }));
    scene.anims.create({
      key: 'zombie-walk',
      frames: frameNames,
      frameRate: 12,
      repeat: -1,
    });
  }
}
