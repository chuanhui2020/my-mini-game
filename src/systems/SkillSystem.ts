import Phaser from 'phaser';
import { BattleState, SkillConfig } from '../types';
import { BATTLE_SKILLS } from '../data/skills';

export class SkillSystem {
  private scene: Phaser.Scene;
  private battleState: BattleState;
  private acquiredSkills: Map<string, SkillConfig> = new Map();

  // 技能效果累加值
  private attackBonus: number = 0;
  private critChance: number = 0;
  private damageReduction: number = 0;
  private coinBonus: number = 0;
  private healOnKill: number = 0;
  private hasRevive: boolean = false;
  private shieldCount: number = 0;

  constructor(scene: Phaser.Scene, battleState: BattleState) {
    this.scene = scene;
    this.battleState = battleState;
  }

  public addSkill(skillId: string): void {
    const skill = BATTLE_SKILLS.find((s) => s.id === skillId);
    if (!skill) {
      console.warn(`Skill not found: ${skillId}`);
      return;
    }

    this.acquiredSkills.set(skillId, skill);
    this.applySkillEffect(skill);

    // 显示获得技能提示
    this.showSkillAcquired(skill);
  }

  private applySkillEffect(skill: SkillConfig): void {
    const effect = skill.effect;

    switch (effect.type) {
      case 'attack_boost':
        this.attackBonus += effect.value;
        break;

      case 'crit_chance':
        this.critChance += effect.value;
        break;

      case 'combo_bonus':
        // 需要通知 ComboSystem
        const battleScene = this.scene as any;
        if (battleScene.comboSystem) {
          battleScene.comboSystem.addBonusMultiplier(effect.value);
        }
        break;

      case 'instant_heal':
        const healAmount = Math.floor(this.battleState.maxHp * effect.value);
        this.battleState.hp = Math.min(
          this.battleState.hp + healAmount,
          this.battleState.maxHp
        );
        this.showHealEffect(healAmount);
        break;

      case 'shield':
        this.shieldCount += effect.value;
        break;

      case 'heal_on_kill':
        this.healOnKill += effect.value;
        break;

      case 'damage_reduction':
        this.damageReduction += effect.value;
        break;

      case 'revive':
        this.hasRevive = true;
        break;

      case 'coin_bonus':
        this.coinBonus += effect.value;
        break;

      case 'pet_attack_speed':
        // TODO: 通知宠物系统
        break;

      case 'pet_cooldown':
        // TODO: 通知宠物系统
        break;

      default:
        console.log(`Unhandled skill effect: ${effect.type}`);
    }
  }

  private showSkillAcquired(skill: SkillConfig): void {
    const width = this.scene.cameras.main.width;

    const text = this.scene.add.text(
      width / 2,
      150,
      `${skill.icon} 获得: ${skill.name}`,
      {
        fontSize: '24px',
        color: '#44ff44',
        stroke: '#000000',
        strokeThickness: 2,
      }
    ).setOrigin(0.5);

    this.scene.tweens.add({
      targets: text,
      y: text.y - 30,
      alpha: 0,
      duration: 1500,
      onComplete: () => {
        text.destroy();
      },
    });
  }

  private showHealEffect(amount: number): void {
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;

    const text = this.scene.add.text(
      width / 2,
      height / 2,
      `+${amount} ❤️`,
      {
        fontSize: '48px',
        color: '#44ff44',
        stroke: '#000000',
        strokeThickness: 4,
      }
    ).setOrigin(0.5);

    this.scene.tweens.add({
      targets: text,
      y: text.y - 50,
      alpha: 0,
      duration: 1000,
      onComplete: () => {
        text.destroy();
      },
    });
  }

  // ===== 对外接口 =====

  public getAttackMultiplier(): number {
    return 1 + this.attackBonus;
  }

  public getCritChance(): number {
    return this.critChance;
  }

  public getDamageReduction(): number {
    return Math.min(this.damageReduction, 0.8); // 最多减伤80%
  }

  public getCoinMultiplier(): number {
    return 1 + this.coinBonus;
  }

  public getHealOnKill(): number {
    return this.healOnKill;
  }

  public hasShield(): boolean {
    return this.shieldCount > 0;
  }

  public consumeShield(): boolean {
    if (this.shieldCount > 0) {
      this.shieldCount--;
      return true;
    }
    return false;
  }

  public canRevive(): boolean {
    return this.hasRevive;
  }

  public consumeRevive(): boolean {
    if (this.hasRevive) {
      this.hasRevive = false;
      return true;
    }
    return false;
  }

  public getRandomSkillChoices(count: number = 2): SkillConfig[] {
    // 获取未获得的技能
    const availableSkills = BATTLE_SKILLS.filter(
      (s) => !this.acquiredSkills.has(s.id)
    );

    // 随机选择
    const choices: SkillConfig[] = [];
    const shuffled = Phaser.Utils.Array.Shuffle([...availableSkills]);

    for (let i = 0; i < count && i < shuffled.length; i++) {
      choices.push(shuffled[i]);
    }

    return choices;
  }

  public getAcquiredSkills(): SkillConfig[] {
    return Array.from(this.acquiredSkills.values());
  }
}
