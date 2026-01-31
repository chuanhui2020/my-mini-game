import Phaser from 'phaser';

interface ResultData {
  victory: boolean;
  score: number;
  coins: number;
  maxCombo: number;
}

export class ResultScene extends Phaser.Scene {
  private resultData!: ResultData;

  constructor() {
    super({ key: 'ResultScene' });
  }

  init(data: ResultData): void {
    this.resultData = data;
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // 背景渐变
    const bgColor = this.resultData.victory ? 0x2d5a27 : 0x5a2727;
    this.add.rectangle(width / 2, height / 2, width, height, bgColor);

    // 添加背景图案
    const bgPattern = this.add.graphics();
    bgPattern.lineStyle(2, 0xffffff, 0.05);
    for (let i = 0; i < 20; i++) {
      bgPattern.strokeCircle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        Phaser.Math.Between(50, 150)
      );
    }

    // 结果面板背景
    const panelBg = this.add.graphics();
    panelBg.fillStyle(0x000000, 0.5);
    panelBg.fillRoundedRect(60, height / 4 - 50, width - 120, height / 2 + 100, 20);
    panelBg.lineStyle(5, 0xffffff, 0.3);
    panelBg.strokeRoundedRect(60, height / 4 - 50, width - 120, height / 2 + 100, 20);

    // 结果标题
    const titleText = this.resultData.victory ? '🎉 胜利!' : '💀 失败...';
    const titleColor = this.resultData.victory ? '#ffcc00' : '#ff6666';

    this.add.text(width / 2, height / 4 + 20, titleText, {
      fontSize: '72px',
      color: titleColor,
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 6,
    }).setOrigin(0.5);

    // 副标题
    const subTitle = this.resultData.victory ? '干得漂亮！' : '再接再厉！';
    this.add.text(width / 2, height / 4 + 90, subTitle, {
      fontSize: '24px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    // 统计数据
    const stats = [
      { label: '得分', value: this.resultData.score.toString(), emoji: '⭐' },
      { label: '金币', value: this.resultData.coins.toString(), emoji: '💰' },
      { label: '最高连击', value: this.resultData.maxCombo.toString(), emoji: '🔥' },
    ];

    const statsStartY = height / 2 - 20;
    stats.forEach((stat, index) => {
      const y = statsStartY + index * 90;

      // 统计项背景
      const statBg = this.add.graphics();
      statBg.fillStyle(0xffffff, 0.1);
      statBg.fillRoundedRect(100, y - 30, width - 200, 60, 10);

      this.add.text(140, y, `${stat.emoji} ${stat.label}`, {
        fontSize: '28px',
        color: '#ffffff',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 3
      }).setOrigin(0, 0.5);

      this.add.text(width - 140, y, stat.value, {
        fontSize: '36px',
        color: '#ffcc00',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 3
      }).setOrigin(1, 0.5);
    });

    // 按钮
    const btnY = height * 0.8;

    // 返回家园按钮
    const homeBtn = this.createButton(width / 2 - 140, btnY, '🏠 返回', 0x4477aa);
    homeBtn.on('pointerdown', () => {
      this.scene.start('HomeScene');
    });

    // 再来一次按钮 (仅失败时显示)
    if (!this.resultData.victory) {
      const retryBtn = this.createButton(width / 2 + 140, btnY, '🔄 重试', 0xaa7744);
      retryBtn.on('pointerdown', () => {
        this.scene.start('BattleScene', { levelId: '1-1' });
      });
    } else {
      // 下一关按钮 (胜利时显示)
      const nextBtn = this.createButton(width / 2 + 140, btnY, '➡️ 下一关', 0x44aa44);
      nextBtn.on('pointerdown', () => {
        // TODO: 实现关卡进度系统
        this.scene.start('BattleScene', { levelId: '1-2' });
      });
    }
  }

  private createButton(x: number, y: number, text: string, color: number): Phaser.GameObjects.Rectangle {
    const bg = this.add.rectangle(x, y, 220, 70, color);
    bg.setStrokeStyle(4, 0xffffff);
    bg.setInteractive({ useHandCursor: true });

    this.add.text(x, y, text, {
      fontSize: '26px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);

    bg.on('pointerover', () => {
      this.tweens.add({
        targets: bg,
        scaleX: 1.08,
        scaleY: 1.08,
        duration: 150,
        ease: 'Back.easeOut'
      });
    });

    bg.on('pointerout', () => {
      this.tweens.add({
        targets: bg,
        scaleX: 1,
        scaleY: 1,
        duration: 150,
        ease: 'Back.easeIn'
      });
    });

    return bg;
  }
}
