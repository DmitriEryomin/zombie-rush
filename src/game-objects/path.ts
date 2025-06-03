export type PathPoint = { x: number; y: number };

export class Path extends Phaser.Curves.Path {
  constructor(scene: Phaser.Scene, points: PathPoint[]) {
    const [start, ...rest] = points;
    super(start.x, start.y);
    rest.forEach((point) => this.lineTo(point.x, point.y));

    // Visualize path (for debugging)
    // const graphics = scene.add.graphics();
    // graphics.lineStyle(3, 0x000000, 1);
    // this.draw(graphics);
  }
}
