import Phaser from 'phaser';
import { BuildingConfig } from '../types';

export class Building extends Phaser.GameObjects.Container {
  private config: BuildingConfig;
  private level: number;
  private isUnlocked: boolean;

  private bgGraphic!: Phaser.GameObjects.Rectangle;
  private iconText!: Phaser.GameObjects.Text;
  private nameText!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    config: BuildingConfig,
    level: number,
    isUnlocked: boolean
  ) {
    super(scene, x, y);
    this.config = config;
    this.level = level;
    this.isUnlocked = isUnlocked;

    this.createVisuals();
    scene.add.existing(this);
  }

  private createVisuals(): void {
    // 背景
    this.bgGraphic = this.scene.add.rectangle(0, 0, 140, 160, 0xffffff, 0.9);
    this.bgGraphic.setStrokeStyle(3, this.isUnlocked ? 0x666666 : 0xaaaaaa);
    this.bgGraphic.setInteractive({ useHandCursor: true });
    this.add(this.bgGraphic);

    if (!this.isUnlocked) {
      // 未解锁状态
      this.bgGraphic.setFillStyle(0x888888, 0.5);

      const lockIcon = this.scene.add.text(0, -20, '🔒', {
        fontSize: '48px',
      }).setOrigin(0.5);
      this.add(lockIcon);

      const lockText = this.scene.add.text(0, 40, '未解锁', {
        fontSize: '16px',
        color: '#666666',
      }).setOrigin(0.5);
      this.add(lockText);
    } else {
      // 已解锁状态
      // 建筑图标
      this.iconText = this.scene.add.text(0, -30, this.config.emoji, {
        fontSize: '56px',
      }).setOrigin(0.5);
      this.add(this.iconText);

      // 建筑名称
      this.nameText = this.scene.add.text(0, 30, this.config.name, {
        fontSize: '18px',
        color: '#333333',
      }).setOrigin(0.5);
      this.add(this.nameText);

      // 等级显示
      if (this.level > 0) {
        this.levelText = this.scene.add.text(0, 55, `Lv.${this.level}`, {
          fontSize: '14px',
          color: '#666666',
        }).setOrigin(0.5);
        this.add(this.levelText);
      }
    }

    // 点击事件
    this.bgGraphic.on('pointerdown', () => {
      this.onClick();
    });

    this.bgGraphic.on('pointerover', () => {
      if (this.isUnlocked) {
        this.bgGraphic.setScale(1.05);
      }
    });

    this.bgGraphic.on('pointerout', () => {
      this.bgGraphic.setScale(1);
    });
  }

  private onClick(): void {
    if (!this.isUnlocked) {
      this.showLockedMessage();
      return;
    }

    this.showUpgradePanel();
  }

  private showLockedMessage(): void {
    const width = this.scene.cameras.main.width;

    const text = this.scene.add.text(
      width / 2,
      200,
      `${this.config.name} 尚未解锁\n条件: ${this.config.unlockCondition}`,
      {
        fontSize: '20px',
        color: '#ff6666',
        align: 'center',
      }
    ).setOrigin(0.5);

    this.scene.tweens.add({
      targets: text,
      alpha: 0,
      y: text.y - 30,
      duration: 1500,
      onComplete: () => text.destroy(),
    });
  }

  private showUpgradePanel(): void {
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;

    // 遮罩
    const overlay = this.scene.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x000000,
      0.6
    );
    overlay.setInteractive();

    // 面板
    const panel = this.scene.add.container(width / 2, height / 2);

    const bg = this.scene.add.rectangle(0, 0, 400, 350, 0xffffff);
    bg.setStrokeStyle(3, 0x333333);
    panel.add(bg);

    // 标题
    const title = this.scene.add.text(
      0,
      -130,
      `${this.config.emoji} ${this.config.name}`,
      {
        fontSize: '32px',
        color: '#333333',
      }
    ).setOrigin(0.5);
    panel.add(title);

    // 当前等级
    const levelInfo = this.scene.add.text(0, -80, `当前等级: ${this.level}`, {
      fontSize: '20px',
      color: '#666666',
    }).setOrigin(0.5);
    panel.add(levelInfo);

    // 效果描述
    const effectText = this.scene.add.text(0, -30, this.config.description, {
      fontSize: '18px',
      color: '#333333',
      align: 'center',
    }).setOrigin(0.5);
    panel.add(effectText);

    // 当前效果
    if (this.level > 0 && this.config.effects[this.level - 1]) {
      const currentEffect = this.config.effects[this.level - 1];
      const effectInfo = this.scene.add.text(
        0,
        20,
        `当前效果: +${(currentEffect.value * 100).toFixed(0)}%`,
        {
          fontSize: '16px',
          color: '#44aa44',
        }
      ).setOrigin(0.5);
      panel.add(effectInfo);
    }

    // 升级按钮
    if (this.level < this.config.maxLevel) {
      const upgradeCost = this.config.upgradeCosts[this.level] || 999999;
      const upgradeBtn = this.scene.add.rectangle(0, 80, 200, 50, 0x44aa44);
      upgradeBtn.setStrokeStyle(2, 0xffffff);
      upgradeBtn.setInteractive({ useHandCursor: true });
      panel.add(upgradeBtn);

      const upgradeText = this.scene.add.text(0, 80, `升级 (${upgradeCost}💰)`, {
        fontSize: '20px',
        color: '#ffffff',
      }).setOrigin(0.5);
      panel.add(upgradeText);

      upgradeBtn.on('pointerdown', () => {
        // TODO: 实现升级逻辑
        console.log('Upgrade building:', this.config.id);
      });
    } else {
      const maxText = this.scene.add.text(0, 80, '已满级', {
        fontSize: '20px',
        color: '#888888',
      }).setOrigin(0.5);
      panel.add(maxText);
    }

    // 关闭按钮
    const closeBtn = this.scene.add.rectangle(0, 140, 120, 40, 0xaa4444);
    closeBtn.setInteractive({ useHandCursor: true });
    panel.add(closeBtn);

    const closeText = this.scene.add.text(0, 140, '关闭', {
      fontSize: '18px',
      color: '#ffffff',
    }).setOrigin(0.5);
    panel.add(closeText);

    closeBtn.on('pointerdown', () => {
      overlay.destroy();
      panel.destroy();
    });

    overlay.on('pointerdown', () => {
      overlay.destroy();
      panel.destroy();
    });
  }

  public getConfig(): BuildingConfig {
    return this.config;
  }

  public getLevel(): number {
    return this.level;
  }

  public setLevel(level: number): void {
    this.level = level;
    if (this.levelText) {
      this.levelText.setText(`Lv.${level}`);
    }
  }
}
