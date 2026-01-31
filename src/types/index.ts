// ==================== 基础类型 ====================

export interface Position {
  x: number;
  y: number;
}

// ==================== 宠物相关 ====================

export interface PetConfig {
  id: string;
  name: string;
  emoji: string;
  rarity: number; // 1-4星
  description: string;
  skill: SkillConfig;
  passive: PassiveConfig;
  baseAttack: number;
  attackSpeed: number; // 攻击间隔(ms)
}

export interface PetState {
  id: string;
  level: number;
  exp: number;
}

// ==================== 技能相关 ====================

export type SkillType = 'attack' | 'survival' | 'effect' | 'pet';

export interface SkillConfig {
  id: string;
  name: string;
  description: string;
  type: SkillType;
  icon: string;
  cooldown?: number; // 主动技能冷却时间(ms)
  effect: SkillEffect;
}

export interface SkillEffect {
  type: string;
  value: number;
  duration?: number;
}

export interface PassiveConfig {
  id: string;
  name: string;
  description: string;
  effect: SkillEffect;
}

// ==================== 敌人相关 ====================

export type EnemyType = 'normal' | 'elite' | 'boss';

export interface EnemyConfig {
  id: string;
  name: string;
  emoji: string;
  type: EnemyType;
  hp: number;
  score: number;
  coins: number;
  appearTime: number; // 冒头时间(ms)
  damage: number; // 逃跑造成的伤害
  special?: string; // 特殊行为
}

// ==================== 关卡相关 ====================

export interface WaveConfig {
  enemies: string[]; // 敌人ID列表
  spawnInterval: number; // 生成间隔(ms)
  maxConcurrent: number; // 最大同时存在数
}

export interface LevelConfig {
  id: string;
  name: string;
  area: number; // 区域编号 1-4
  stage: number; // 关卡编号 1-5
  waves: WaveConfig[];
  bossId?: string;
  rewards: {
    coins: number;
    fragments: number;
    exp: number;
  };
}

// ==================== 建筑相关 ====================

export interface BuildingConfig {
  id: string;
  name: string;
  emoji: string;
  description: string;
  maxLevel: number;
  effects: BuildingEffect[];
  unlockCondition: string;
  upgradeCosts: number[];
}

export interface BuildingEffect {
  level: number;
  type: string;
  value: number;
}

// ==================== 存档相关 ====================

export interface SaveData {
  version: number;
  coins: number;
  fragments: number;
  unlockedPets: string[];
  petStates: Record<string, PetState>;
  selectedPets: string[];
  buildings: Record<string, number>; // 建筑ID -> 等级
  clearedLevels: string[];
  currentLevel: string;
  statistics: GameStatistics;
  createdAt: number;
  updatedAt: number;
}

export interface GameStatistics {
  totalPlayTime: number;
  totalKills: number;
  maxCombo: number;
  totalCoins: number;
  gamesPlayed: number;
}

// ==================== 战斗状态 ====================

export interface BattleState {
  levelId: string;
  currentWave: number;
  score: number;
  coins: number;
  hp: number;
  maxHp: number;
  combo: number;
  maxCombo: number;
  skills: string[]; // 本局获得的技能
  isPaused: boolean;
  isOver: boolean;
  isVictory: boolean;
}

// ==================== 事件相关 ====================

export type GameEventType =
  | 'treasure'
  | 'coin_rain'
  | 'elite_attack'
  | 'merchant'
  | 'berserk'
  | 'fortune_wheel';

export interface GameEvent {
  type: GameEventType;
  name: string;
  description: string;
  emoji: string;
}
