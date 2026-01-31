import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // 背景
    this.add.rectangle(width / 2, height / 2, width, height, 0x2d2d44);

    // 游戏标题
    this.add.text(width / 2, height / 3, '喵汪大作战', {
      fontSize: '56px',
      color: '#ffcc00',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 6,
    }).setOrigin(0.5);

    // 副标题
    this.add.text(width / 2, height / 3 + 70, '萌宠保卫家园', {
      fontSize: '28px',
      color: '#ffffff',
      fontFamily: 'Arial',
    }).setOrigin(0.5);

    // 装饰性宠物表情
    this.add.text(width / 2 - 100, height / 2 - 50, '🐱', {
      fontSize: '64px',
    }).setOrigin(0.5);

    this.add.text(width / 2 + 100, height / 2 - 50, '🐕', {
      fontSize: '64px',
    }).setOrigin(0.5);

    // 开始按钮
    this.createButton(
      width / 2,
      height / 2 + 100,
      '开始游戏',
      0x44aa44,
      () => {
        this.scene.start('HomeScene');
      }
    );

    // 版本信息
    this.add.text(width / 2, height - 50, 'v1.0.0 - AI Game Jam', {
      fontSize: '16px',
      color: '#888888',
    }).setOrigin(0.5);
  }

  private createButton(
    x: number,
    y: number,
    text: string,
    color: number,
    onClick: () => void
  ): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    const bg = this.add.rectangle(0, 0, 240, 60, color, 1);
    bg.setStrokeStyle(3, 0xffffff);
    bg.setInteractive({ useHandCursor: true });

    const label = this.add.text(0, 0, text, {
      fontSize: '28px',
      color: '#ffffff',
      fontFamily: 'Arial',
    }).setOrigin(0.5);

    container.add([bg, label]);

    // 交互效果
    bg.on('pointerover', () => {
      bg.setScale(1.05);
    });
    bg.on('pointerout', () => {
      bg.setScale(1);
    });
    bg.on('pointerdown', onClick);

    return container;
  }
}
