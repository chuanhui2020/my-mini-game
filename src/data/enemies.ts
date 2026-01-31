import { EnemyConfig } from '../types';

export const ENEMIES: EnemyConfig[] = [
  // 普通怪物
  {
    id: 'thief',
    name: '偷吃怪',
    emoji: '👾',
    type: 'normal',
    hp: 1,
    score: 10,
    coins: 5,
    appearTime: 2000,
    damage: 5,
  },
  {
    id: 'troublemaker',
    name: '捣蛋精',
    emoji: '👻',
    type: 'normal',
    hp: 1,
    score: 15,
    coins: 8,
    appearTime: 1500,
    damage: 8,
  },
  {
    id: 'stinky_sock',
    name: '臭袜子怪',
    emoji: '🧦',
    type: 'normal',
    hp: 1,
    score: 20,
    coins: 10,
    appearTime: 1000,
    damage: 10,
  },
  {
    id: 'prankster',
    name: '调皮鬼',
    emoji: '😈',
    type: 'normal',
    hp: 1,
    score: 25,
    coins: 12,
    appearTime: 1200,
    damage: 10,
    special: 'fake_retreat', // 假装缩回
  },
  {
    id: 'invisible',
    name: '隐身怪',
    emoji: '👤',
    type: 'normal',
    hp: 1,
    score: 30,
    coins: 15,
    appearTime: 1800,
    damage: 12,
    special: 'semi_invisible', // 半透明
  },

  // 精英怪物
  {
    id: 'iron_head',
    name: '铁头怪',
    emoji: '🤖',
    type: 'elite',
    hp: 3,
    score: 50,
    coins: 30,
    appearTime: 3000,
    damage: 15,
    special: 'armor', // 需要多次点击
  },
  {
    id: 'splitter',
    name: '分裂怪',
    emoji: '🦠',
    type: 'elite',
    hp: 1,
    score: 40,
    coins: 25,
    appearTime: 2000,
    damage: 10,
    special: 'split', // 分裂成小怪
  },
  {
    id: 'bomber',
    name: '炸弹怪',
    emoji: '💣',
    type: 'elite',
    hp: 1,
    score: 60,
    coins: 40,
    appearTime: 2500,
    damage: 25,
    special: 'explode', // 倒计时爆炸
  },

  // BOSS
  {
    id: 'boss_rat_king',
    name: '鼠王大盗',
    emoji: '🐀',
    type: 'boss',
    hp: 20,
    score: 200,
    coins: 100,
    appearTime: 5000,
    damage: 20,
    special: 'summon_minions', // 召唤小老鼠
  },
  {
    id: 'boss_crab_general',
    name: '螃蟹将军',
    emoji: '🦀',
    type: 'boss',
    hp: 25,
    score: 250,
    coins: 120,
    appearTime: 5000,
    damage: 15,
    special: 'shell_phase', // 硬壳阶段
  },
  {
    id: 'boss_snowman',
    name: '雪人巨怪',
    emoji: '⛄',
    type: 'boss',
    hp: 30,
    score: 300,
    coins: 150,
    appearTime: 5000,
    damage: 18,
    special: 'freeze_holes', // 冰冻洞穴
  },
  {
    id: 'boss_flame_lord',
    name: '火焰魔王',
    emoji: '🔥',
    type: 'boss',
    hp: 50,
    score: 500,
    coins: 200,
    appearTime: 5000,
    damage: 25,
    special: 'multi_phase', // 多阶段
  },
];

export function getEnemyConfig(id: string): EnemyConfig | undefined {
  return ENEMIES.find((e) => e.id === id);
}
