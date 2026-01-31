import Phaser from 'phaser';
import { Enemy } from './Enemy';

export class Hole extends Phaser.GameObjects.Container {
  // private holeGraphic!: Phaser.GameObjects.Ellipse;
  private holeIndex: number;
  private currentEnemy: Enemy | null = null;
  private isFrozen: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number, index: number) {
    super(scene, x, y);
    this.holeIndex = index;

    this.createVisuals();
    scene.add.existing(this);
  }

  private createVisuals(): void {
    // 洞穴阴影 - 更大更柔和
    const shadow = this.scene.add.ellipse(0, 25, 135, 45, 0x000000, 0.35);
    this.add(shadow);

    // 洞穴图片
    const holeImage = this.scene.add.image(0, 0, 'hole_normal');
    holeImage.setDisplaySize(130, 110);
    this.add(holeImage);
  }

  public spawnEnemy(enemy: Enemy): void {
    if (this.currentEnemy || this.isFrozen) {
      return;
    }

    this.currentEnemy = enemy;
    enemy.setPosition(this.x, this.y - 30);
    enemy.spawn(this);
  }

  public onEnemyRemoved(): void {
    this.currentEnemy = null;
  }

  public hasEnemy(): boolean {
    return this.currentEnemy !== null;
  }

  public getEnemy(): Enemy | null {
    return this.currentEnemy;
  }

  public getIndex(): number {
    return this.holeIndex;
  }

  public freeze(duration: number): void {
    this.isFrozen = true;

    // 显示冰冻效果
    const ice = this.scene.add.ellipse(0, 0, 130, 55, 0x88ccff, 0.5);
    this.add(ice);

    this.scene.time.delayedCall(duration, () => {
      this.isFrozen = false;
      ice.destroy();
    });
  }

  public isAvailable(): boolean {
    return !this.hasEnemy() && !this.isFrozen;
  }
}
