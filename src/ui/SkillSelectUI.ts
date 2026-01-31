import Phaser from 'phaser';
import { SkillConfig } from '../types';
import { BATTLE_SKILLS } from '../data/skills';

export class SkillSelectUI extends Phaser.GameObjects.Container {
  private onSkillSelected: (skillId: string) => void;
  private overlay!: Phaser.GameObjects.Rectangle;
  private panel!: Phaser.GameObjects.Container;
  private isVisible: boolean = false;
  private acquiredSkillIds: Set<string> = new Set();

  constructor(scene: Phaser.Scene, onSkillSelected: (skillId: string) => void) {
    super(scene, 0, 0);
    this.onSkillSelected = onSkillSelected;

    this.createUI();
    this.setVisible(false);
    scene.add.existing(this);
  }

  // 重置已获得技能（新游戏时调用）
  public reset(): void {
    this.acquiredSkillIds.clear();
  }

  private createUI(): void {
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;

    // 半透明遮罩
    this.overlay = this.scene.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x000000,
      0.7
    );
    this.add(this.overlay);

    // 面板容器
    this.panel = this.scene.add.container(width / 2, height / 2);
    this.add(this.panel);
  }

  public show(): void {
    if (this.isVisible) return;

    // 获取随机技能选项
    const choices = this.getRandomSkillChoices(2);

    // 如果没有可用技能，直接跳过
    if (choices.length === 0) {
      this.onSkillSelected('');  // 传入空字符串表示跳过
      return;
    }

    this.isVisible = true;

    // 清空面板
    this.panel.removeAll(true);

    // 标题背景
    const titleBg = this.scene.add.graphics();
    titleBg.fillStyle(0x4a3b8c, 0.9);
    titleBg.fillRoundedRect(-180, -240, 360, 70, 15);
    titleBg.lineStyle(4, 0xffffff, 0.8);
    titleBg.strokeRoundedRect(-180, -240, 360, 70, 15);
    this.panel.add(titleBg);

    // 标题
    const title = this.scene.add.text(0, -205, '✨ 选择一个强化 ✨', {
      fontSize: '32px',
      color: '#ffcc00',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5);
    this.panel.add(title);

    // 技能卡片 - 增加间距
    choices.forEach((skill, index) => {
      const x = index === 0 ? -170 : 170;
      const card = this.createSkillCard(skill, x, 20);
      this.panel.add(card);
    });

    // 显示动画
    this.setVisible(true);
    this.setAlpha(0);
    this.scene.tweens.add({
      targets: this,
      alpha: 1,
      duration: 300,
      ease: 'Quad.easeOut'
    });
  }

  public hide(): void {
    if (!this.isVisible) return;

    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 200,
      onComplete: () => {
        this.isVisible = false;
        this.setVisible(false);
      },
    });
  }

  private createSkillCard(skill: SkillConfig, x: number, y: number): Phaser.GameObjects.Container {
    const card = this.scene.add.container(x, y);

    // 卡片背景 - 渐变效果
    const bgGraphics = this.scene.add.graphics();
    bgGraphics.fillGradientStyle(0x4a4a66, 0x4a4a66, 0x353555, 0x353555, 1);
    bgGraphics.fillRoundedRect(-135, -160, 270, 340, 15);
    bgGraphics.lineStyle(4, 0xffffff, 0.9);
    bgGraphics.strokeRoundedRect(-135, -160, 270, 340, 15);
    card.add(bgGraphics);

    // 创建交互区域
    const hitArea = this.scene.add.rectangle(0, 0, 270, 340, 0x000000, 0);
    hitArea.setInteractive({ useHandCursor: true });
    card.add(hitArea);

    // 技能类型标签
    const typeColors: Record<string, number> = {
      attack: 0xff6644,
      survival: 0x44ff66,
      effect: 0x6644ff,
      pet: 0xffaa44,
    };
    const typeLabel = this.scene.add.rectangle(0, -130, 100, 30, typeColors[skill.type] || 0x666666);
    typeLabel.setStrokeStyle(2, 0xffffff);
    card.add(typeLabel);

    const typeText = this.scene.add.text(0, -130, this.getTypeName(skill.type), {
      fontSize: '16px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);
    card.add(typeText);

    // 技能图标
    const icon = this.scene.add.text(0, -60, skill.icon, {
      fontSize: '72px',
    }).setOrigin(0.5);
    card.add(icon);

    // 技能名称
    const name = this.scene.add.text(0, 30, skill.name, {
      fontSize: '26px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);
    card.add(name);

    // 技能描述
    const desc = this.scene.add.text(0, 100, skill.description, {
      fontSize: '18px',
      color: '#dddddd',
      wordWrap: { width: 240 },
      align: 'center',
    }).setOrigin(0.5);
    card.add(desc);

    // 交互效果
    hitArea.on('pointerover', () => {
      this.scene.tweens.add({
        targets: card,
        scaleX: 1.08,
        scaleY: 1.08,
        duration: 150,
        ease: 'Back.easeOut'
      });
      bgGraphics.clear();
      bgGraphics.fillGradientStyle(0x5a5a88, 0x5a5a88, 0x454577, 0x454577, 1);
      bgGraphics.fillRoundedRect(-135, -160, 270, 340, 15);
      bgGraphics.lineStyle(4, 0xffcc00, 1);
      bgGraphics.strokeRoundedRect(-135, -160, 270, 340, 15);
    });

    hitArea.on('pointerout', () => {
      this.scene.tweens.add({
        targets: card,
        scaleX: 1,
        scaleY: 1,
        duration: 150,
        ease: 'Back.easeIn'
      });
      bgGraphics.clear();
      bgGraphics.fillGradientStyle(0x4a4a66, 0x4a4a66, 0x353555, 0x353555, 1);
      bgGraphics.fillRoundedRect(-135, -160, 270, 340, 15);
      bgGraphics.lineStyle(4, 0xffffff, 0.9);
      bgGraphics.strokeRoundedRect(-135, -160, 270, 340, 15);
    });

    hitArea.on('pointerdown', () => {
      this.scene.tweens.add({
        targets: card,
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 60,
        yoyo: true,
        ease: 'Quad.easeOut',
        onComplete: () => {
          this.selectSkill(skill.id);
        }
      });
    });

    return card;
  }

  private getTypeName(type: string): string {
    const names: Record<string, string> = {
      attack: '攻击',
      survival: '生存',
      effect: '特效',
      pet: '宠物',
    };
    return names[type] || type;
  }

  private getRandomSkillChoices(count: number): SkillConfig[] {
    // 过滤掉已获得的技能
    const available = BATTLE_SKILLS.filter(
      (s) => !this.acquiredSkillIds.has(s.id)
    );

    // 随机选择
    const shuffled = Phaser.Utils.Array.Shuffle([...available]);
    return shuffled.slice(0, count);
  }

  private selectSkill(skillId: string): void {
    this.acquiredSkillIds.add(skillId);
    this.hide();
    this.onSkillSelected(skillId);
  }
}
