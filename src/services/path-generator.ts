import type { Base } from '../game-objects/base';
import type { PathPoint } from '../game-objects/path';

export class PathGenerator {
  static generatePathToBase(
    scene: Phaser.Scene,
    base: Base,
    entryPoint: 'left' | 'right' | 'top' | 'down'
  ): PathPoint[] {
    // Implement pathfinding logic here
    const path: PathPoint[] = [];
    const sceneWidth = scene.cameras.main.width;
    const sceneHeight = scene.cameras.main.height;

    switch (entryPoint) {
      case 'top':
        path.push(
          { x: 0, y: sceneHeight * 0.1 },
          {
            x: sceneWidth * 0.3,
            y: sceneHeight * 0.1,
          },
          { x: base.x + base.width * 0.2, y: sceneHeight * 0.25 },
          { x: base.x + base.width * 0.2, y: base.y }
        );
        break;
      case 'left':
        path.push(
          { x: 0, y: sceneHeight * 0.8 },
          { x: sceneWidth * 0.2, y: sceneHeight * 0.8 },
          { x: sceneWidth * 0.2, y: sceneHeight * 0.65 },
          { x: sceneWidth * 0.3, y: base.y + base.height * 0.4 },
          { x: base.x, y: base.y + base.height * 0.4 }
        );
        break;
      case 'down':
        path.push(
          { x: sceneWidth * 0.45, y: sceneHeight },
          { x: sceneWidth * 0.45, y: sceneHeight * 0.8 },
          { x: base.x + base.width * 0.7, y: sceneHeight * 0.65 },
          { x: base.x + base.width * 0.7, y: base.y + base.height }
        );
        break;
      case 'right':
        path.push(
          { x: sceneWidth * 0.85, y: 0 },
          { x: sceneWidth * 0.85, y: sceneHeight * 0.3 },
          { x: base.x + base.width, y: sceneHeight * 0.5 }
        );
        break;
    }
    return path;
  }
}
