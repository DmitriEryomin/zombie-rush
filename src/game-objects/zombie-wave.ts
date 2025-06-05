import { Path, type PathPoint } from './path';
import { Zombie } from './zombie';

export class ZombieWave {
  private zombies: Phaser.GameObjects.Group;
  private path: Path;
  private infinite = false;
  private nextEnemy: number = 0;
  private scene: Phaser.Scene;
  private zombieCount: number;
  private createdZombies = 0;

  constructor(
    scene: Phaser.Scene,
    pathCoordinates: PathPoint[],
    zombieCount = 3,
    infinite = false
  ) {
    this.scene = scene;
    this.zombies = scene.add.group();
    this.path = new Path(scene, pathCoordinates);
    this.zombieCount = zombieCount;
    this.infinite = infinite;

    this.scene.events.on('update', this.update, this);
  }

  update(time: number, _delta: number) {
    if (time > this.nextEnemy) {
      if (this.infinite && this.zombies.countActive(true) < this.zombieCount) {
        this.addZombie();
      } else if (!this.infinite && this.createdZombies < this.zombieCount) {
        this.addZombie();
        this.createdZombies++;
      }
      this.nextEnemy = time + 3000; // 3 seconds between enemies
    }
  }

  private addZombie() {
    const zombie = new Zombie(this.scene, this.path);
    this.zombies.add(zombie);
  }
}
