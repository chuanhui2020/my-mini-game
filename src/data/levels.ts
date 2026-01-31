import { LevelConfig } from '../types';

export const LEVELS: LevelConfig[] = [
  // ===== 第1区：后花园 =====
  {
    id: '1-1',
    name: '后花园入口',
    area: 1,
    stage: 1,
    waves: [
      { enemies: ['thief', 'thief', 'thief', 'thief', 'thief'], spawnInterval: 2000, maxConcurrent: 2 },
      { enemies: ['thief', 'thief', 'thief', 'thief', 'thief', 'thief'], spawnInterval: 1800, maxConcurrent: 2 },
      { enemies: ['thief', 'thief', 'thief', 'thief', 'thief', 'thief', 'thief'], spawnInterval: 1600, maxConcurrent: 3 },
    ],
    rewards: { coins: 50, fragments: 1, exp: 10 },
  },
  {
    id: '1-2',
    name: '花丛小径',
    area: 1,
    stage: 2,
    waves: [
      { enemies: ['thief', 'thief', 'thief', 'troublemaker', 'troublemaker'], spawnInterval: 1800, maxConcurrent: 2 },
      { enemies: ['thief', 'troublemaker', 'troublemaker', 'troublemaker', 'thief'], spawnInterval: 1600, maxConcurrent: 3 },
      { enemies: ['troublemaker', 'troublemaker', 'troublemaker', 'troublemaker', 'troublemaker'], spawnInterval: 1500, maxConcurrent: 3 },
      { enemies: ['thief', 'thief', 'troublemaker', 'troublemaker', 'troublemaker', 'troublemaker'], spawnInterval: 1400, maxConcurrent: 3 },
    ],
    rewards: { coins: 60, fragments: 1, exp: 15 },
  },
  {
    id: '1-3',
    name: '草坪广场',
    area: 1,
    stage: 3,
    waves: [
      { enemies: ['thief', 'troublemaker', 'stinky_sock', 'thief', 'troublemaker'], spawnInterval: 1600, maxConcurrent: 3 },
      { enemies: ['troublemaker', 'stinky_sock', 'stinky_sock', 'troublemaker', 'thief'], spawnInterval: 1500, maxConcurrent: 3 },
      { enemies: ['stinky_sock', 'stinky_sock', 'troublemaker', 'troublemaker', 'stinky_sock'], spawnInterval: 1400, maxConcurrent: 3 },
      { enemies: ['thief', 'troublemaker', 'stinky_sock', 'stinky_sock', 'stinky_sock', 'troublemaker'], spawnInterval: 1300, maxConcurrent: 4 },
    ],
    rewards: { coins: 75, fragments: 1, exp: 20 },
  },
  {
    id: '1-4',
    name: '花园深处',
    area: 1,
    stage: 4,
    waves: [
      { enemies: ['thief', 'troublemaker', 'stinky_sock', 'prankster', 'thief'], spawnInterval: 1500, maxConcurrent: 3 },
      { enemies: ['troublemaker', 'prankster', 'stinky_sock', 'prankster', 'troublemaker'], spawnInterval: 1400, maxConcurrent: 3 },
      { enemies: ['iron_head', 'thief', 'thief', 'troublemaker', 'troublemaker'], spawnInterval: 1400, maxConcurrent: 3 },
      { enemies: ['prankster', 'prankster', 'stinky_sock', 'iron_head', 'troublemaker'], spawnInterval: 1300, maxConcurrent: 4 },
      { enemies: ['iron_head', 'iron_head', 'prankster', 'prankster', 'stinky_sock', 'stinky_sock'], spawnInterval: 1200, maxConcurrent: 4 },
    ],
    rewards: { coins: 90, fragments: 2, exp: 25 },
  },
  {
    id: '1-5',
    name: '花园守卫战',
    area: 1,
    stage: 5,
    waves: [
      { enemies: ['thief', 'troublemaker', 'stinky_sock', 'prankster', 'thief', 'troublemaker'], spawnInterval: 1400, maxConcurrent: 3 },
      { enemies: ['troublemaker', 'prankster', 'iron_head', 'stinky_sock', 'prankster'], spawnInterval: 1300, maxConcurrent: 4 },
      { enemies: ['iron_head', 'prankster', 'stinky_sock', 'stinky_sock', 'iron_head', 'troublemaker'], spawnInterval: 1200, maxConcurrent: 4 },
      { enemies: ['prankster', 'prankster', 'iron_head', 'iron_head', 'stinky_sock', 'stinky_sock'], spawnInterval: 1100, maxConcurrent: 4 },
    ],
    bossId: 'boss_rat_king',
    rewards: { coins: 150, fragments: 3, exp: 50 },
  },

  // ===== 第2区：阳光沙滩 =====
  {
    id: '2-1',
    name: '沙滩入口',
    area: 2,
    stage: 1,
    waves: [
      { enemies: ['troublemaker', 'stinky_sock', 'troublemaker', 'stinky_sock', 'prankster'], spawnInterval: 1400, maxConcurrent: 3 },
      { enemies: ['prankster', 'stinky_sock', 'invisible', 'troublemaker', 'prankster'], spawnInterval: 1300, maxConcurrent: 3 },
      { enemies: ['invisible', 'prankster', 'stinky_sock', 'invisible', 'prankster', 'troublemaker'], spawnInterval: 1200, maxConcurrent: 4 },
    ],
    rewards: { coins: 80, fragments: 1, exp: 30 },
  },
  {
    id: '2-2',
    name: '贝壳海岸',
    area: 2,
    stage: 2,
    waves: [
      { enemies: ['invisible', 'prankster', 'stinky_sock', 'invisible', 'troublemaker'], spawnInterval: 1300, maxConcurrent: 3 },
      { enemies: ['iron_head', 'invisible', 'prankster', 'iron_head', 'stinky_sock'], spawnInterval: 1200, maxConcurrent: 4 },
      { enemies: ['splitter', 'invisible', 'prankster', 'invisible', 'splitter'], spawnInterval: 1200, maxConcurrent: 4 },
      { enemies: ['iron_head', 'splitter', 'invisible', 'prankster', 'iron_head', 'invisible'], spawnInterval: 1100, maxConcurrent: 4 },
    ],
    rewards: { coins: 100, fragments: 2, exp: 35 },
  },
  {
    id: '2-3',
    name: '椰林小道',
    area: 2,
    stage: 3,
    waves: [
      { enemies: ['invisible', 'splitter', 'prankster', 'invisible', 'iron_head'], spawnInterval: 1200, maxConcurrent: 4 },
      { enemies: ['bomber', 'invisible', 'prankster', 'splitter', 'invisible'], spawnInterval: 1100, maxConcurrent: 4 },
      { enemies: ['iron_head', 'bomber', 'invisible', 'splitter', 'prankster', 'invisible'], spawnInterval: 1100, maxConcurrent: 4 },
      { enemies: ['bomber', 'bomber', 'iron_head', 'splitter', 'invisible', 'prankster'], spawnInterval: 1000, maxConcurrent: 5 },
    ],
    rewards: { coins: 120, fragments: 2, exp: 40 },
  },
  {
    id: '2-4',
    name: '海浪礁石',
    area: 2,
    stage: 4,
    waves: [
      { enemies: ['bomber', 'splitter', 'invisible', 'iron_head', 'prankster', 'bomber'], spawnInterval: 1100, maxConcurrent: 4 },
      { enemies: ['iron_head', 'iron_head', 'bomber', 'splitter', 'invisible', 'bomber'], spawnInterval: 1000, maxConcurrent: 5 },
      { enemies: ['splitter', 'splitter', 'bomber', 'bomber', 'iron_head', 'invisible'], spawnInterval: 1000, maxConcurrent: 5 },
      { enemies: ['bomber', 'bomber', 'bomber', 'iron_head', 'iron_head', 'splitter', 'splitter'], spawnInterval: 900, maxConcurrent: 5 },
      { enemies: ['iron_head', 'iron_head', 'bomber', 'bomber', 'splitter', 'splitter', 'invisible'], spawnInterval: 900, maxConcurrent: 5 },
    ],
    rewards: { coins: 140, fragments: 2, exp: 45 },
  },
  {
    id: '2-5',
    name: '沙滩决战',
    area: 2,
    stage: 5,
    waves: [
      { enemies: ['bomber', 'splitter', 'iron_head', 'invisible', 'bomber', 'prankster'], spawnInterval: 1000, maxConcurrent: 4 },
      { enemies: ['iron_head', 'bomber', 'splitter', 'splitter', 'bomber', 'invisible'], spawnInterval: 900, maxConcurrent: 5 },
      { enemies: ['bomber', 'bomber', 'iron_head', 'iron_head', 'splitter', 'splitter'], spawnInterval: 900, maxConcurrent: 5 },
      { enemies: ['splitter', 'bomber', 'bomber', 'iron_head', 'splitter', 'bomber', 'invisible'], spawnInterval: 800, maxConcurrent: 5 },
    ],
    bossId: 'boss_crab_general',
    rewards: { coins: 200, fragments: 4, exp: 60 },
  },

  // ===== 第3区：冰雪山脉 =====
  {
    id: '3-1',
    name: '雪山脚下',
    area: 3,
    stage: 1,
    waves: [
      { enemies: ['invisible', 'bomber', 'iron_head', 'splitter', 'invisible', 'bomber'], spawnInterval: 1000, maxConcurrent: 4 },
      { enemies: ['iron_head', 'iron_head', 'bomber', 'bomber', 'splitter', 'invisible'], spawnInterval: 900, maxConcurrent: 5 },
      { enemies: ['bomber', 'bomber', 'splitter', 'splitter', 'iron_head', 'iron_head'], spawnInterval: 900, maxConcurrent: 5 },
    ],
    rewards: { coins: 130, fragments: 2, exp: 50 },
  },
  {
    id: '3-2',
    name: '冰晶洞穴',
    area: 3,
    stage: 2,
    waves: [
      { enemies: ['iron_head', 'bomber', 'splitter', 'invisible', 'iron_head', 'bomber'], spawnInterval: 900, maxConcurrent: 5 },
      { enemies: ['bomber', 'bomber', 'iron_head', 'splitter', 'splitter', 'invisible'], spawnInterval: 850, maxConcurrent: 5 },
      { enemies: ['splitter', 'bomber', 'bomber', 'iron_head', 'iron_head', 'splitter'], spawnInterval: 850, maxConcurrent: 5 },
      { enemies: ['iron_head', 'iron_head', 'iron_head', 'bomber', 'bomber', 'splitter', 'splitter'], spawnInterval: 800, maxConcurrent: 6 },
    ],
    rewards: { coins: 150, fragments: 2, exp: 55 },
  },
  {
    id: '3-3',
    name: '暴风雪坡',
    area: 3,
    stage: 3,
    waves: [
      { enemies: ['bomber', 'bomber', 'iron_head', 'iron_head', 'splitter', 'invisible'], spawnInterval: 850, maxConcurrent: 5 },
      { enemies: ['iron_head', 'bomber', 'splitter', 'splitter', 'bomber', 'iron_head'], spawnInterval: 800, maxConcurrent: 5 },
      { enemies: ['splitter', 'splitter', 'bomber', 'bomber', 'iron_head', 'iron_head', 'invisible'], spawnInterval: 800, maxConcurrent: 6 },
      { enemies: ['bomber', 'bomber', 'bomber', 'iron_head', 'iron_head', 'splitter', 'splitter'], spawnInterval: 750, maxConcurrent: 6 },
    ],
    rewards: { coins: 170, fragments: 3, exp: 60 },
  },
  {
    id: '3-4',
    name: '冰封山顶',
    area: 3,
    stage: 4,
    waves: [
      { enemies: ['iron_head', 'iron_head', 'bomber', 'bomber', 'splitter', 'splitter', 'invisible'], spawnInterval: 800, maxConcurrent: 5 },
      { enemies: ['bomber', 'bomber', 'bomber', 'iron_head', 'iron_head', 'splitter', 'splitter'], spawnInterval: 750, maxConcurrent: 6 },
      { enemies: ['splitter', 'splitter', 'splitter', 'bomber', 'bomber', 'iron_head', 'iron_head'], spawnInterval: 750, maxConcurrent: 6 },
      { enemies: ['iron_head', 'iron_head', 'iron_head', 'bomber', 'bomber', 'bomber', 'splitter'], spawnInterval: 700, maxConcurrent: 6 },
      { enemies: ['bomber', 'bomber', 'bomber', 'bomber', 'iron_head', 'iron_head', 'splitter', 'splitter'], spawnInterval: 700, maxConcurrent: 6 },
    ],
    rewards: { coins: 190, fragments: 3, exp: 65 },
  },
  {
    id: '3-5',
    name: '雪山之巅',
    area: 3,
    stage: 5,
    waves: [
      { enemies: ['bomber', 'bomber', 'iron_head', 'iron_head', 'splitter', 'splitter', 'invisible'], spawnInterval: 750, maxConcurrent: 5 },
      { enemies: ['iron_head', 'iron_head', 'iron_head', 'bomber', 'bomber', 'bomber', 'splitter'], spawnInterval: 700, maxConcurrent: 6 },
      { enemies: ['splitter', 'splitter', 'splitter', 'bomber', 'bomber', 'iron_head', 'iron_head', 'invisible'], spawnInterval: 700, maxConcurrent: 6 },
      { enemies: ['bomber', 'bomber', 'bomber', 'bomber', 'iron_head', 'iron_head', 'iron_head', 'splitter'], spawnInterval: 650, maxConcurrent: 6 },
    ],
    bossId: 'boss_snowman',
    rewards: { coins: 250, fragments: 5, exp: 80 },
  },

  // ===== 第4区：火焰火山 =====
  {
    id: '4-1',
    name: '火山入口',
    area: 4,
    stage: 1,
    waves: [
      { enemies: ['iron_head', 'iron_head', 'bomber', 'bomber', 'bomber', 'splitter', 'splitter'], spawnInterval: 700, maxConcurrent: 6 },
      { enemies: ['bomber', 'bomber', 'bomber', 'bomber', 'iron_head', 'iron_head', 'splitter', 'splitter'], spawnInterval: 650, maxConcurrent: 6 },
      { enemies: ['splitter', 'splitter', 'splitter', 'bomber', 'bomber', 'bomber', 'iron_head', 'iron_head'], spawnInterval: 650, maxConcurrent: 6 },
      { enemies: ['iron_head', 'iron_head', 'iron_head', 'iron_head', 'bomber', 'bomber', 'bomber', 'splitter'], spawnInterval: 600, maxConcurrent: 7 },
    ],
    rewards: { coins: 200, fragments: 3, exp: 70 },
  },
  {
    id: '4-2',
    name: '熔岩之路',
    area: 4,
    stage: 2,
    waves: [
      { enemies: ['bomber', 'bomber', 'bomber', 'iron_head', 'iron_head', 'iron_head', 'splitter', 'splitter'], spawnInterval: 650, maxConcurrent: 6 },
      { enemies: ['iron_head', 'iron_head', 'iron_head', 'iron_head', 'bomber', 'bomber', 'bomber', 'bomber'], spawnInterval: 600, maxConcurrent: 7 },
      { enemies: ['splitter', 'splitter', 'splitter', 'splitter', 'bomber', 'bomber', 'iron_head', 'iron_head'], spawnInterval: 600, maxConcurrent: 7 },
      { enemies: ['bomber', 'bomber', 'bomber', 'bomber', 'bomber', 'iron_head', 'iron_head', 'iron_head'], spawnInterval: 550, maxConcurrent: 7 },
      { enemies: ['iron_head', 'iron_head', 'iron_head', 'iron_head', 'iron_head', 'bomber', 'bomber', 'bomber', 'splitter'], spawnInterval: 550, maxConcurrent: 7 },
    ],
    rewards: { coins: 230, fragments: 4, exp: 80 },
  },
  {
    id: '4-3',
    name: '魔王殿堂',
    area: 4,
    stage: 3,
    waves: [
      { enemies: ['iron_head', 'iron_head', 'iron_head', 'bomber', 'bomber', 'bomber', 'bomber', 'splitter', 'splitter'], spawnInterval: 600, maxConcurrent: 7 },
      { enemies: ['bomber', 'bomber', 'bomber', 'bomber', 'bomber', 'iron_head', 'iron_head', 'iron_head', 'splitter'], spawnInterval: 550, maxConcurrent: 7 },
      { enemies: ['splitter', 'splitter', 'splitter', 'splitter', 'bomber', 'bomber', 'bomber', 'iron_head', 'iron_head', 'iron_head'], spawnInterval: 550, maxConcurrent: 8 },
      { enemies: ['iron_head', 'iron_head', 'iron_head', 'iron_head', 'iron_head', 'bomber', 'bomber', 'bomber', 'bomber', 'bomber'], spawnInterval: 500, maxConcurrent: 8 },
    ],
    bossId: 'boss_flame_lord',
    rewards: { coins: 500, fragments: 10, exp: 150 },
  },
];

export function getLevelConfig(id: string): LevelConfig | undefined {
  return LEVELS.find((l) => l.id === id);
}

export function getNextLevelId(currentId: string): string | null {
  const current = getLevelConfig(currentId);
  if (!current) return null;

  // 同区域下一关
  const nextStage = LEVELS.find(
    (l) => l.area === current.area && l.stage === current.stage + 1
  );
  if (nextStage) return nextStage.id;

  // 下一区域第一关
  const nextArea = LEVELS.find(
    (l) => l.area === current.area + 1 && l.stage === 1
  );
  if (nextArea) return nextArea.id;

  return null;
}
