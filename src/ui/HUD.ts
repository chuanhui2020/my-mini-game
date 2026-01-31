import Phaser from 'phaser';
import { BattleState } from '../types';

export class HUD extends Phaser.GameObjects.Container {
  private battleState: BattleState;

  private hpBar!: Phaser.GameObjects.Graphics;
  private hpText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;
  private coinText!: Phaser.GameObjects.Text;
  private waveText!: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, battleState: BattleState) {
    super(scene, 0, 0);
    this.battleState = battleState;

    this.createUI();
    scene.add.existing(this);
  }

  private createUI(): void {
    const width = this.scene.cameras.main.width;

    // 顶部透明渐变遮罩 (不再是实心黑)
    const topBar = this.scene.add.graphics();
    topBar.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.6, 0.6, 0, 0);
    topBar.fillRect(0, 0, width, 100);
    this.add(topBar);

    // 血量区域 - 左上角 (胶囊样式)
    const hpContainer = this.scene.add.container(20, 20);

    // 背景
    const hpBg = this.scene.add.graphics();
    hpBg.fillStyle(0x000000, 0.5);
    hpBg.fillRoundedRect(0, 0, 320, 44, 22);
    hpContainer.add(hpBg);

    // 心形图标
    const hpIcon = this.scene.add.text(25, 22, '❤️', { fontSize: '24px' }).setOrigin(0.5);
    hpContainer.add(hpIcon);

    // 血量条槽
    const barBg = this.scene.add.graphics();
    barBg.fillStyle(0x333333, 1);
    barBg.fillRoundedRect(50, 12, 250, 20, 10);
    hpContainer.add(barBg);

    // 实际血量条 (动态)
    this.hpBar = this.scene.add.graphics();
    hpContainer.add(this.hpBar);

    // 血量数字 (浮在血条上)
    this.hpText = this.scene.add.text(175, 22, '', {
      fontSize: '14px',
      color: '#ffffff',
      fontStyle: 'bold',
      shadow: { blur: 2, color: '#000000', fill: true }
    }).setOrigin(0.5);
    hpContainer.add(this.hpText);

    this.add(hpContainer);


    // 右上角资源区 (紧凑排列)
    const rscX = width - 20;

    // 金币胶囊
    this.createResourcePill(rscX, 20, '💰', 'coins');
    // 分数胶囊 (在金币下方)
    this.createResourcePill(rscX, 70, '⭐', 'score');

    // 波次信息 - 放在血条下方
    this.waveText = this.scene.add.text(60, 80, '', {
      fontSize: '18px',
      color: '#ffffff',
      fontStyle: 'bold',
      shadow: { blur: 2, color: '#000000', fill: true }
    }).setOrigin(0, 0.5);
    this.add(this.waveText);

    // 初始更新
    this.update();
  }

  private createResourcePill(x: number, y: number, icon: string, type: 'coins' | 'score'): void {
    const container = this.scene.add.container(x, y);

    const w = 140;
    const h = 40;

    // 背景
    const bg = this.scene.add.graphics();
    bg.fillStyle(0x000000, 0.4);
    bg.fillRoundedRect(-w, 0, w, h, 20);
    bg.lineStyle(1, 0xffffff, 0.2);
    bg.strokeRoundedRect(-w, 0, w, h, 20);
    container.add(bg);

    // 图标
    const iconText = this.scene.add.text(-25, h / 2, icon, { fontSize: '22px' }).setOrigin(0.5);
    container.add(iconText);

    // 数值文本
    const textObj = this.scene.add.text(-w + 20, h / 2, '0', {
      fontSize: '20px',
      color: '#ffcc00',
      fontStyle: 'bold'
    }).setOrigin(0, 0.5);
    container.add(textObj);

    if (type === 'coins') this.coinText = textObj;
    if (type === 'score') this.scoreText = textObj;

    this.add(container);
  }

  public update(): void {
    // 更新血量条
    this.updateHpBar();

    // 更新血量文字
    this.hpText.setText(`${this.battleState.hp}/${this.battleState.maxHp}`);

    // 更新分数
    this.scoreText.setText(this.battleState.score.toString());

    // 更新金币
    this.coinText.setText(this.battleState.coins.toString());
  }

  private updateHpBar(): void {
    this.hpBar.clear();

    const hpPercent = this.battleState.hp / this.battleState.maxHp;
    const barWidth = 250;
    const barHeight = 20;
    // 相对于 container 的位置 (参考 createUI)
    // container(20, 20) -> barBg(50, 12)
    const x = 50;
    const y = 12;

    // 血量颜色根据百分比变化
    let color = 0x44ff44; // 绿色
    if (hpPercent < 0.3) {
      color = 0xff4444; // 红色
    } else if (hpPercent < 0.6) {
      color = 0xffaa00; // 橙色
    }

    this.hpBar.fillStyle(color, 1);
    this.hpBar.fillRoundedRect(x, y, barWidth * hpPercent, barHeight, 10);

    // 添加高光 (上层反光)
    this.hpBar.fillStyle(0xffffff, 0.2);
    this.hpBar.fillRoundedRect(x, y, barWidth * hpPercent, barHeight * 0.5, { tl: 10, tr: 10, bl: 0, br: 0 });
  }

  public updateWaveInfo(current: number, total: number): void {
    this.waveText.setText(`波次: ${current + 1}/${total}`);
  }

  public showDamageEffect(): void {
    // 屏幕边缘红色闪烁效果
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;

    const flash = this.scene.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0xff0000,
      0.3
    );

    this.scene.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 200,
      onComplete: () => {
        flash.destroy();
      },
    });
  }
}
