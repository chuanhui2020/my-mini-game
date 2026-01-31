import Phaser from 'phaser';
import { PetConfig } from '../types';

export class Pet extends Phaser.GameObjects.Container {
  private config: PetConfig;
  private attackTimer: number = 0;
  private skillCooldown: number = 0;
  private skillReady: boolean = true;
  private maskGraphic: Phaser.GameObjects.Graphics | null = null;

  private bodyGraphic!: Phaser.GameObjects.Graphics;
  // private emojiText!: Phaser.GameObjects.Text;
  private skillIndicator!: Phaser.GameObjects.Arc;

  constructor(scene: Phaser.Scene, x: number, y: number, config: PetConfig) {
    super(scene, x, y);
    this.config = config;

    this.createVisuals();
    scene.add.existing(this);
  }

  private createVisuals(): void {
    // 简单的映射
    const petImages: { [key: string]: string } = {
      '🐱': 'pet_cat',
      '🐕': 'pet_dog',
      '🐰': 'pet_rabbit'
    };

    const key = petImages[this.config.emoji] || 'pet_cat';

    // 宠物底座圆形背景
    const baseBg = this.scene.add.circle(0, 0, 52, 0xffffff);
    baseBg.setStrokeStyle(4, 0xffaa00);
    this.add(baseBg);

    // 宠物图片
    const sprite = this.scene.add.sprite(0, 0, key);
    sprite.setDisplaySize(95, 95);
    this.bodyGraphic = sprite as any;
    this.add(this.bodyGraphic);

    // 使用圆形裁剪 - 创建一个圆形遮罩
    const maskShape = this.scene.make.graphics({});
    maskShape.fillStyle(0xffffff);
    maskShape.fillCircle(0, 0, 50);

    const mask = maskShape.createGeometryMask();
    sprite.setMask(mask);

    // 将遮罩图形添加到容器中，这样它会跟随容器移动
    this.add(maskShape);
    maskShape.setVisible(false); // 遮罩本身不可见
    this.maskGraphic = maskShape;

    // 宠物名称
    const nameText = this.scene.add.text(0, 65, this.config.name, {
      fontSize: '16px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);
    this.add(nameText);

    // 技能冷却指示器
    this.skillIndicator = this.scene.add.arc(0, -60, 18, 0, 360, false, 0x44ff44);
    this.skillIndicator.setStrokeStyle(3, 0xffffff);
    this.add(this.skillIndicator);

    // 技能提示文字
    const skillHint = this.scene.add.text(0, -60, '💫', {
      fontSize: '16px',
    }).setOrigin(0.5);
    this.add(skillHint);
  }

  public update(_time: number, delta: number): void {
    // 更新遮罩位置 - 使其跟随容器
    if (this.maskGraphic) {
      const worldPos = this.getWorldTransformMatrix();
      this.maskGraphic.x = worldPos.tx;
      this.maskGraphic.y = worldPos.ty;
    }

    // 检查游戏是否暂停
    const battleScene = this.scene as any;
    const battleState = battleScene.getBattleState ? battleScene.getBattleState() : null;
    if (battleState && battleState.isPaused) {
      return; // 游戏暂停时不更新
    }

    // 自动攻击计时
    this.attackTimer += delta;
    if (this.attackTimer >= this.config.attackSpeed) {
      this.attackTimer = 0;
      this.autoAttack();
    }

    // 技能冷却
    if (!this.skillReady) {
      this.skillCooldown -= delta;
      if (this.skillCooldown <= 0) {
        this.skillReady = true;
        this.skillIndicator.setFillStyle(0x44ff44);
        // 技能就绪，自动释放
        this.useSkill();
      } else {
        // 更新冷却指示器 - 灰色表示冷却中
        this.skillIndicator.setFillStyle(0x666666);
      }
    }
  }

  private autoAttack(): void {
    // 获取战斗场景引用
    const battleScene = this.scene as any;
    if (battleScene.attackRandomEnemy) {
      const damage = this.getAttackDamage();
      battleScene.attackRandomEnemy(damage);
    }

    // 攻击动画
    this.scene.tweens.add({
      targets: this,
      y: this.y - 10,
      duration: 100,
      yoyo: true,
      ease: 'Quad.easeOut',
    });

    // 攻击特效
    this.showAttackEffect();
  }

  // 计算宠物攻击力
  private getAttackDamage(): number {
    return this.config.baseAttack;
  }

  private showAttackEffect(): void {
    const effect = this.scene.add.circle(this.x, this.y - 20, 10, 0xffff00, 0.8);
    this.scene.tweens.add({
      targets: effect,
      y: effect.y - 100,
      x: effect.x + Phaser.Math.Between(-50, 50),
      alpha: 0,
      scale: 0.5,
      duration: 300,
      onComplete: () => {
        effect.destroy();
      },
    });
  }

  private useSkill(): void {
    if (!this.skillReady) return;

    this.skillReady = false;
    this.skillCooldown = this.config.skill.cooldown || 10000;

    // 技能效果（简化版）
    this.executeSkill();

    // 技能动画
    this.scene.tweens.add({
      targets: this,
      scaleX: 1.3,
      scaleY: 1.3,
      duration: 200,
      yoyo: true,
    });

    // 显示技能名称
    const skillText = this.scene.add.text(
      this.x,
      this.y - 100,
      `${this.config.skill.icon} ${this.config.skill.name}`,
      {
        fontSize: '20px',
        color: '#ffcc00',
        stroke: '#000000',
        strokeThickness: 2,
      }
    ).setOrigin(0.5);

    this.scene.tweens.add({
      targets: skillText,
      y: skillText.y - 40,
      alpha: 0,
      duration: 1000,
      onComplete: () => {
        skillText.destroy();
      },
    });
  }

  private executeSkill(): void {
    const battleScene = this.scene as any;
    const effect = this.config.skill.effect;
    const damage = this.getAttackDamage();

    switch (effect.type) {
      case 'multi_attack':
        // 连续攻击
        for (let i = 0; i < effect.value; i++) {
          this.scene.time.delayedCall(i * 200, () => {
            if (battleScene.attackRandomEnemy) {
              battleScene.attackRandomEnemy(Math.floor(damage * 1.5));
            }
          });
        }
        break;

      case 'aoe_attack':
        // 全屏攻击
        const waveSystem = battleScene.getWaveSystem?.();
        if (waveSystem) {
          waveSystem.attackAllEnemies(damage);
        }
        break;

      case 'freeze_all':
        // 冰冻全部敌人
        const waveSystem2 = battleScene.getWaveSystem?.();
        if (waveSystem2) {
          waveSystem2.freezeAllEnemies(effect.value);
        }
        break;

      default:
        // 默认强力攻击
        if (battleScene.attackRandomEnemy) {
          battleScene.attackRandomEnemy(Math.floor(damage * 3));
        }
    }
  }

  public onPlayerHit(): void {
    // 玩家命中敌人时的反应
    this.scene.tweens.add({
      targets: this.bodyGraphic,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 50,
      yoyo: true,
    });
  }

  public getConfig(): PetConfig {
    return this.config;
  }

  // 清理资源
  destroy(fromScene?: boolean): void {
    // 清理遮罩图形
    if (this.maskGraphic) {
      this.maskGraphic.destroy();
      this.maskGraphic = null;
    }
    
    super.destroy(fromScene);
  }
}
