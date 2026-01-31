import Phaser from 'phaser';
import { EnemyConfig } from '../types';
import { Hole } from './Hole';

export class Enemy extends Phaser.GameObjects.Container {
  private config: EnemyConfig;
  private hole: Hole | null = null;
  private currentHp: number;
  private isAlive: boolean = true;
  private appearTimer: Phaser.Time.TimerEvent | null = null;

  private bodyGraphic!: Phaser.GameObjects.Graphics;
  // private emojiText!: Phaser.GameObjects.Text;
  private hpBar!: Phaser.GameObjects.Graphics;
  private maskGraphic: Phaser.GameObjects.Graphics | null = null;

  private onKilled: (score: number, coins: number, source: 'player' | 'pet') => void;
  private onEscaped: (damage: number) => void;

  constructor(
    scene: Phaser.Scene,
    config: EnemyConfig,
    onKilled: (score: number, coins: number, source: 'player' | 'pet') => void,
    onEscaped: (damage: number) => void
  ) {
    super(scene, 0, 0);
    this.config = config;
    this.currentHp = config.hp;
    this.onKilled = onKilled;
    this.onEscaped = onEscaped;

    this.createVisuals();
    this.setVisible(false);
    scene.add.existing(this);
  }

  private createVisuals(): void {
    // 根据敌人ID选择对应的图片资源
    let key = 'enemy_thief'; // 默认
    
    // 普通怪物
    if (this.config.id === 'thief') key = 'enemy_thief';
    else if (this.config.id === 'troublemaker') key = 'enemy_troublemaker';
    else if (this.config.id === 'stinky_sock') key = 'enemy_stinky_sock';
    else if (this.config.id === 'prankster') key = 'enemy_prankster';
    else if (this.config.id === 'invisible') key = 'enemy_invisible';
    
    // 精英怪物
    else if (this.config.id === 'iron_head') key = 'enemy_iron_head';
    else if (this.config.id === 'splitter') key = 'enemy_splitter';
    else if (this.config.id === 'bomber') key = 'enemy_bomber';
    
    // BOSS
    else if (this.config.id === 'boss_rat_king') key = 'boss_rat_king';
    else if (this.config.id === 'boss_crab_general') key = 'boss_crab_general';
    else if (this.config.id === 'boss_snowman') key = 'boss_snowman';
    else if (this.config.id === 'boss_flame_lord') key = 'boss_flame_lord';

    // 怪物身体
    const sprite = this.scene.add.sprite(0, 0, key);
    
    // 根据类型设置大小
    let size = 80;
    if (this.config.type === 'elite') size = 90;
    else if (this.config.type === 'boss') size = 120;
    
    sprite.setDisplaySize(size, size);
    sprite.setInteractive();
    this.bodyGraphic = sprite as any;
    this.add(this.bodyGraphic);

    // 圆形遮罩
    const maskRadius = size / 2;
    const mask = this.scene.make.graphics({});
    mask.fillCircle(0, 0, maskRadius);
    const geomMask = mask.createGeometryMask();
    sprite.setMask(geomMask);
    this.maskGraphic = mask;

    // 血条（仅精英和BOSS显示）
    if (this.config.hp > 1) {
      this.hpBar = this.scene.add.graphics();
      this.updateHpBar();
      this.add(this.hpBar);
    }

    // 点击事件 - 玩家直接点击攻击
    this.bodyGraphic.on('pointerdown', () => {
      this.takeDamage(1, 'player');
    });
  }

  // private getColorByType(): number {
  //   switch (this.config.type) {
  //     case 'elite':
  //       return 0xaa44aa;
  //     case 'boss':
  //       return 0xaa2222;
  //     default:
  //       return 0x66aa66;
  //   }
  // }

  private updateHpBar(): void {
    if (!this.hpBar) return;

    this.hpBar.clear();

    const barWidth = 60;
    const barHeight = 8;
    const hpPercent = this.currentHp / this.config.hp;

    // 背景
    this.hpBar.fillStyle(0x333333, 1);
    this.hpBar.fillRect(-barWidth / 2, -55, barWidth, barHeight);

    // 血量
    this.hpBar.fillStyle(0x44ff44, 1);
    this.hpBar.fillRect(-barWidth / 2, -55, barWidth * hpPercent, barHeight);
  }

  public spawn(hole: Hole): void {
    this.hole = hole;
    this.isAlive = true;
    this.currentHp = this.config.hp;
    this.setVisible(true);

    // 冒头动画
    this.setScale(0.1);
    this.scene.tweens.add({
      targets: this,
      scaleX: 1,
      scaleY: 1,
      y: this.y - 40,
      duration: 200,
      ease: 'Back.easeOut',
      onUpdate: () => this.updateMask()
    });

    // 设置消失计时器
    this.appearTimer = this.scene.time.delayedCall(
      this.config.appearTime,
      () => {
        this.escape();
      }
    );

    // 特殊行为处理
    this.handleSpecialBehavior();
  }

  private handleSpecialBehavior(): void {
    if (this.config.special === 'semi_invisible') {
      // 半透明效果
      this.setAlpha(0.4);
    } else if (this.config.special === 'fake_retreat') {
      // 假装缩回
      this.scene.time.delayedCall(this.config.appearTime * 0.4, () => {
        if (!this.isAlive) return;
        this.scene.tweens.add({
          targets: this,
          y: this.y + 30,
          duration: 150,
          yoyo: true,
        });
      });
    }
  }

  private updateMask(): void {
    if (this.maskGraphic) {
      this.maskGraphic.setPosition(this.x, this.y);
    }
  }

  public takeDamage(amount: number, source: 'player' | 'pet' = 'pet'): void {
    if (!this.isAlive) return;

    this.currentHp -= amount;
    this.updateHpBar();

    // 受击效果
    this.scene.tweens.add({
      targets: this,
      scaleX: 1.2,
      scaleY: 0.8,
      duration: 50,
      yoyo: true,
    });

    // 闪烁效果
    this.scene.tweens.add({
      targets: this,
      alpha: 0.5,
      duration: 50,
      yoyo: true,
    });

    if (this.currentHp <= 0) {
      this.die(source);
    }
  }

  private die(source: 'player' | 'pet' = 'pet'): void {
    if (!this.isAlive) return;
    this.isAlive = false;

    // 取消消失计时器
    if (this.appearTimer) {
      this.appearTimer.destroy();
    }

    // 通知回调 - 传递击杀来源
    this.onKilled(this.config.score, this.config.coins, source);

    // 死亡动画
    this.scene.tweens.add({
      targets: this,
      scaleX: 1.5,
      scaleY: 0.3,
      alpha: 0,
      duration: 200,
      onComplete: () => {
        this.cleanup();
      },
    });

    // 显示得分飘字
    this.showScoreText();
  }

  private escape(): void {
    if (!this.isAlive) return;
    this.isAlive = false;

    // 通知回调
    this.onEscaped(this.config.damage);

    // 逃跑动画
    this.scene.tweens.add({
      targets: this,
      y: this.y + 60,
      scaleY: 0.1,
      duration: 200,
      onUpdate: () => this.updateMask(),
      onComplete: () => {
        this.cleanup();
      },
    });
  }

  private cleanup(): void {
    if (this.hole) {
      this.hole.onEnemyRemoved();
      this.hole = null;
    }
    
    // 清理遮罩
    if (this.maskGraphic) {
      this.maskGraphic.destroy();
      this.maskGraphic = null;
    }
    
    // 清理定时器
    if (this.appearTimer) {
      this.appearTimer.destroy();
      this.appearTimer = null;
    }
    
    this.destroy();
  }

  private showScoreText(): void {
    const scoreText = this.scene.add.text(
      this.x,
      this.y - 60,
      `+${this.config.score}`,
      {
        fontSize: '24px',
        color: '#ffff00',
        stroke: '#000000',
        strokeThickness: 2,
      }
    ).setOrigin(0.5);

    this.scene.tweens.add({
      targets: scoreText,
      y: scoreText.y - 50,
      alpha: 0,
      duration: 800,
      onComplete: () => {
        scoreText.destroy();
      },
    });
  }

  public getConfig(): EnemyConfig {
    return this.config;
  }

  public isAliveState(): boolean {
    return this.isAlive;
  }

  public freeze(duration: number): void {
    if (!this.isAlive) return;

    // 暂停消失计时器
    if (this.appearTimer) {
      this.appearTimer.paused = true;
    }

    // 冰冻效果 - 使用覆盖层代替 tint
    const freezeOverlay = this.scene.add.circle(0, 0, 45, 0x88ccff, 0.5);
    this.add(freezeOverlay);

    this.scene.time.delayedCall(duration, () => {
      if (!this.isAlive) return;
      freezeOverlay.destroy();
      if (this.appearTimer) {
        this.appearTimer.paused = false;
      }
    });
  }
}
