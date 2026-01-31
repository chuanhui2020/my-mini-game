import Phaser from 'phaser';
import { GameManager } from '../managers/GameManager';
import { Hole } from '../objects/Hole';
import { Pet } from '../objects/Pet';
import { ComboSystem } from '../systems/ComboSystem';
import { WaveSystem } from '../systems/WaveSystem';
import { SkillSystem } from '../systems/SkillSystem';
import { HUD } from '../ui/HUD';
import { SkillSelectUI } from '../ui/SkillSelectUI';
import { BattleState } from '../types';

export class BattleScene extends Phaser.Scene {
  private gameManager!: GameManager;
  private holes: Hole[] = [];
  private pets: Pet[] = [];
  private comboSystem!: ComboSystem;
  private waveSystem!: WaveSystem;
  private skillSystem!: SkillSystem;
  private hud!: HUD;
  private skillSelectUI!: SkillSelectUI;

  private battleState!: BattleState;
  private levelId: string = '1-1';

  constructor() {
    super({ key: 'BattleScene' });
  }

  init(data: { levelId?: string }): void {
    this.levelId = data.levelId || '1-1';

    // 重置所有数组和引用
    this.holes = [];
    this.pets = [];
  }

  create(): void {
    // 清理之前可能残留的事件监听
    this.events.removeAllListeners();
    this.gameManager = GameManager.getInstance();

    // 初始化战斗状态
    this.initBattleState();

    // 创建背景
    this.createBackground();

    // 创建洞穴网格 (3x3)
    this.createHoles();

    // 创建宠物
    this.createPets();

    // 初始化系统
    this.initSystems();

    // 创建HUD
    this.hud = new HUD(this, this.battleState);

    // 创建技能选择UI (初始隐藏)
    this.skillSelectUI = new SkillSelectUI(this, (skillId) => {
      this.onSkillSelected(skillId);
    });
    this.skillSelectUI.reset(); // 重置已获得技能

    // 开始第一波
    this.time.delayedCall(1000, () => {
      console.log('[BattleScene] Starting first wave...');
      this.waveSystem.startWave();
    });
  }

  private initBattleState(): void {
    const bonuses = this.gameManager.getBuildingBonuses();

    this.battleState = {
      levelId: this.levelId,
      currentWave: 0,
      score: 0,
      coins: 0,
      hp: Math.floor(100 * (1 + bonuses.hpBonus)),
      maxHp: Math.floor(100 * (1 + bonuses.hpBonus)),
      combo: 0,
      maxCombo: 0,
      skills: [],
      isPaused: false,
      isOver: false,
      isVictory: false,
    };
  }

  private createBackground(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // 根据关卡选择背景
    let bgKey = 'bg_battle_garden';
    if (this.levelId.startsWith('1-')) bgKey = 'bg_battle_garden';
    else if (this.levelId.startsWith('2-')) bgKey = 'bg_battle_beach';
    else if (this.levelId.startsWith('3-')) bgKey = 'bg_battle_snow';
    else if (this.levelId.startsWith('4-')) bgKey = 'bg_battle_volcano';

    const bg = this.add.image(width / 2, height / 2, bgKey);
    bg.setDisplaySize(width, height);

    // 关卡信息 - 顶部居中 (Glassmorphism Pill)
    const levelBg = this.add.graphics();
    // 半透明黑底
    levelBg.fillStyle(0x000000, 0.4);
    levelBg.fillRoundedRect(width / 2 - 120, 100, 240, 44, 22);
    // 淡淡的描边
    levelBg.lineStyle(1, 0xffffff, 0.3);
    levelBg.strokeRoundedRect(width / 2 - 120, 100, 240, 44, 22);

    this.add.text(width / 2, 122, `关卡 ${this.levelId}`, {
      fontSize: '22px',
      color: '#ffffff',
      fontStyle: 'bold',
      shadow: { blur: 2, color: '#000000', fill: true }
    }).setOrigin(0.5);
  }

  private createHoles(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // 3x3网格，居中布局
    const holeSize = 140;
    const gapX = 30;
    const gapY = 35;
    const totalWidth = holeSize * 3 + gapX * 2;
    const totalHeight = holeSize * 3 + gapY * 2;

    const startX = (width - totalWidth) / 2 + holeSize / 2;
    const startY = (height - totalHeight) / 2 + 50; // 稍微偏下

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const x = startX + col * (holeSize + gapX);
        const y = startY + row * (holeSize + gapY);
        const hole = new Hole(this, x, y, row * 3 + col);
        this.holes.push(hole);
      }
    }
  }

  private createPets(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // 创建出战宠物 - 底部居中排列
    const selectedPets = this.gameManager.getSelectedPets();
    const petConfigs = this.gameManager.getPetConfigs(selectedPets);

    const petSpacing = 160;
    const totalWidth = petSpacing * (petConfigs.length - 1);
    const startX = width / 2 - totalWidth / 2;
    const petY = height - 150;

    petConfigs.forEach((config, index) => {
      const x = startX + index * petSpacing;

      // 宠物脚底底座 (光圈)
      this.add.ellipse(x, petY + 35, 100, 25, 0x000000, 0.4);

      const pet = new Pet(this, x, petY, config);
      this.pets.push(pet);
    });
  }

  private initSystems(): void {
    // 连击系统
    this.comboSystem = new ComboSystem(this, this.battleState);

    // 波次系统
    this.waveSystem = new WaveSystem(this, this.holes, this.levelId, {
      onWaveComplete: () => this.onWaveComplete(),
      onAllWavesComplete: () => this.onVictory(),
      onEnemyEscape: (damage) => this.onEnemyEscape(damage),
      onEnemyKilled: (score, coins, source) => this.onEnemyKilled(score, coins, source),
    });

    // 技能系统
    this.skillSystem = new SkillSystem(this, this.battleState);
  }

  private onEnemyKilled(score: number, coins: number, source: 'player' | 'pet'): void {
    // 只有玩家击杀才触发连击
    let multiplier = 1;
    if (source === 'player') {
      multiplier = this.comboSystem.hit();
    }

    const finalScore = Math.floor(score * multiplier);
    const finalCoins = Math.floor(coins * multiplier * this.skillSystem.getCoinMultiplier());

    this.battleState.score += finalScore;
    this.battleState.coins += finalCoins;

    // 更新HUD
    this.hud.update();

    // 宠物攻击效果
    if (source === 'player') {
      this.pets.forEach((pet) => pet.onPlayerHit());
    }
  }

  private onEnemyEscape(damage: number): void {
    // 重置连击
    this.comboSystem.reset();

    // 扣血
    const actualDamage = Math.floor(damage * (1 - this.skillSystem.getDamageReduction()));
    this.battleState.hp -= actualDamage;
    this.hud.update();

    // 屏幕震动
    this.cameras.main.shake(200, 0.01);

    // 检查死亡
    if (this.battleState.hp <= 0) {
      this.battleState.hp = 0;
      this.onDefeat();
    }
  }

  private onWaveComplete(): void {
    // 检查是否还有下一波（包括BOSS）
    const hasMoreWaves = this.waveSystem.hasMoreWaves();

    if (!hasMoreWaves) {
      // 没有更多波次了，直接开始下一波（会触发BOSS或胜利）
      this.time.delayedCall(500, () => {
        this.waveSystem.startWave();
      });
      return;
    }

    // 还有波次，暂停游戏并显示技能选择
    this.battleState.isPaused = true;

    this.time.delayedCall(500, () => {
      this.skillSelectUI.show();
    });
  }

  private onSkillSelected(skillId: string): void {
    // 处理跳过的情况（技能用尽时）
    if (skillId && skillId !== '') {
      // 添加技能
      this.skillSystem.addSkill(skillId);
      this.battleState.skills.push(skillId);
    }

    // 继续游戏
    this.battleState.isPaused = false;

    // 开始下一波
    this.time.delayedCall(500, () => {
      this.waveSystem.startWave();
    });
  }

  private onVictory(): void {
    this.battleState.isOver = true;
    this.battleState.isVictory = true;

    // 保存进度
    this.gameManager.addCoins(this.battleState.coins);
    this.gameManager.addFragments(Math.floor(Math.random() * 3) + 1);
    this.gameManager.markLevelCleared(this.levelId);
    this.gameManager.saveGame();

    // 跳转到结算场景
    this.time.delayedCall(1000, () => {
      this.scene.start('ResultScene', {
        victory: true,
        score: this.battleState.score,
        coins: this.battleState.coins,
        maxCombo: this.battleState.maxCombo,
      });
    });
  }

  private onDefeat(): void {
    this.battleState.isOver = true;
    this.battleState.isVictory = false;

    // 保存部分奖励
    this.gameManager.addCoins(Math.floor(this.battleState.coins * 0.5));
    this.gameManager.saveGame();

    // 跳转到结算场景
    this.time.delayedCall(1000, () => {
      this.scene.start('ResultScene', {
        victory: false,
        score: this.battleState.score,
        coins: Math.floor(this.battleState.coins * 0.5),
        maxCombo: this.battleState.maxCombo,
      });
    });
  }

  update(time: number, delta: number): void {
    if (this.battleState.isPaused || this.battleState.isOver) {
      return;
    }

    // 更新连击系统
    this.comboSystem.update(delta);

    // 更新宠物
    this.pets.forEach((pet) => pet.update(time, delta));

    // 更新波次系统
    this.waveSystem.update(time, delta);
  }

  // 供宠物调用，攻击随机敌人
  public attackRandomEnemy(damage: number): void {
    this.waveSystem.attackRandomEnemy(damage);
  }

  // 暴露WaveSystem给宠物使用
  public getWaveSystem() {
    return this.waveSystem;
  }

  public getBattleState(): BattleState {
    return this.battleState;
  }

  // 获取玩家攻击力（基础+建筑加成+技能加成）
  public getPlayerDamage(): number {
    const baseDamage = 1; // 基础攻击力
    const bonuses = this.gameManager.getBuildingBonuses();
    const skillMultiplier = this.skillSystem.getAttackMultiplier();

    return Math.floor(baseDamage * (1 + bonuses.attackBonus) * skillMultiplier);
  }

  // 场景关闭时清理资源
  shutdown(): void {
    // 停止所有定时器
    this.time.removeAllEvents();

    // 停止所有 tweens
    this.tweens.killAll();

    // 清理宠物
    this.pets.forEach(pet => {
      if (pet && pet.destroy) {
        pet.destroy();
      }
    });
    this.pets = [];

    // 清理洞穴
    this.holes.forEach(hole => {
      if (hole && hole.destroy) {
        hole.destroy();
      }
    });
    this.holes = [];
  }
}
