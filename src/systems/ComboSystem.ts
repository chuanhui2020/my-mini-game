import Phaser from 'phaser';
import { BattleState } from '../types';

export class ComboSystem {
  private scene: Phaser.Scene;
  private battleState: BattleState;
  private comboTimer: number = 0;
  private readonly comboTimeout: number = 2000; // 2秒超时重置连击
  private comboText: Phaser.GameObjects.Text | null = null;
  private bonusMultiplier: number = 0; // 额外连击倍率加成

  constructor(scene: Phaser.Scene, battleState: BattleState) {
    this.scene = scene;
    this.battleState = battleState;
  }

  public hit(): number {
    this.battleState.combo++;
    this.comboTimer = 0;

    // 更新最高连击
    if (this.battleState.combo > this.battleState.maxCombo) {
      this.battleState.maxCombo = this.battleState.combo;
    }

    // 显示连击数
    this.showComboText();

    // 触发连击效果
    this.triggerComboEffects();

    return this.getMultiplier();
  }

  public reset(): void {
    this.battleState.combo = 0;
    this.comboTimer = 0;
    this.hideComboText();
  }

  public update(delta: number): void {
    if (this.battleState.combo > 0) {
      this.comboTimer += delta;
      if (this.comboTimer >= this.comboTimeout) {
        this.reset();
      }
    }
  }

  public getMultiplier(): number {
    const combo = this.battleState.combo;
    let multiplier = 1.0;

    if (combo >= 50) {
      multiplier = 3.0;
    } else if (combo >= 30) {
      multiplier = 2.0;
    } else if (combo >= 10) {
      multiplier = 1.5;
    }

    return multiplier + this.bonusMultiplier;
  }

  public addBonusMultiplier(value: number): void {
    this.bonusMultiplier += value;
  }

  private showComboText(): void {
    const width = this.scene.cameras.main.width;
    const combo = this.battleState.combo;

    // 创建或更新连击文字
    if (!this.comboText) {
      this.comboText = this.scene.add.text(width - 50, 200, '', {
        fontSize: '48px',
        color: '#ffcc00',
        stroke: '#000000',
        strokeThickness: 4,
        fontStyle: 'bold',
      }).setOrigin(1, 0.5);
    }

    this.comboText.setText(`${combo}连击!`);

    // 根据连击数改变颜色
    if (combo >= 50) {
      this.comboText.setColor('#ff00ff'); // 彩虹色（简化为紫色）
    } else if (combo >= 30) {
      this.comboText.setColor('#ffcc00'); // 金色
    } else if (combo >= 10) {
      this.comboText.setColor('#ff8800'); // 橙色
    } else {
      this.comboText.setColor('#ffffff'); // 白色
    }

    // 弹跳动画
    this.scene.tweens.add({
      targets: this.comboText,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 100,
      yoyo: true,
    });
  }

  private hideComboText(): void {
    if (this.comboText) {
      this.comboText.destroy();
      this.comboText = null;
    }
  }

  private triggerComboEffects(): void {
    const combo = this.battleState.combo;

    // 里程碑效果
    if (combo === 10 || combo === 30 || combo === 50 || combo === 100) {
      // 屏幕震动
      this.scene.cameras.main.shake(200, 0.01 + combo * 0.0001);

      // 显示里程碑提示
      this.showMilestoneText(combo);
    }
  }

  private showMilestoneText(combo: number): void {
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;

    let text = '';
    let color = '#ffffff';

    if (combo >= 100) {
      text = '🔥 无敌连击!';
      color = '#ff00ff';
    } else if (combo >= 50) {
      text = '⚡ 超级连击!';
      color = '#ffcc00';
    } else if (combo >= 30) {
      text = '💥 连击狂热!';
      color = '#ff8800';
    } else if (combo >= 10) {
      text = '✨ 连击开始!';
      color = '#88ff88';
    }

    const milestoneText = this.scene.add.text(width / 2, height / 2, text, {
      fontSize: '56px',
      color: color,
      stroke: '#000000',
      strokeThickness: 6,
    }).setOrigin(0.5);

    this.scene.tweens.add({
      targets: milestoneText,
      scaleX: 1.5,
      scaleY: 1.5,
      alpha: 0,
      duration: 1000,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        milestoneText.destroy();
      },
    });
  }

  public getCombo(): number {
    return this.battleState.combo;
  }
}
