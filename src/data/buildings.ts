import { BuildingConfig } from '../types';

export const BUILDINGS: BuildingConfig[] = [
  {
    id: 'pet_house',
    name: '宠物窝',
    emoji: '🏠',
    description: '放置展示已收集的宠物',
    maxLevel: 3,
    effects: [
      { level: 1, type: 'pet_slots', value: 2 },
      { level: 2, type: 'pet_slots', value: 3 },
      { level: 3, type: 'pet_slots', value: 4 },
    ],
    unlockCondition: 'initial',
    upgradeCosts: [0, 300, 800],
  },
  {
    id: 'restaurant',
    name: '美食餐厅',
    emoji: '🍖',
    description: '提升初始血量',
    maxLevel: 3,
    effects: [
      { level: 1, type: 'hp_bonus', value: 0.1 },
      { level: 2, type: 'hp_bonus', value: 0.2 },
      { level: 3, type: 'hp_bonus', value: 0.35 },
    ],
    unlockCondition: 'initial',
    upgradeCosts: [0, 200, 500, 1000],
  },
  {
    id: 'training_ground',
    name: '训练场',
    emoji: '⚔️',
    description: '提升初始攻击力',
    maxLevel: 3,
    effects: [
      { level: 1, type: 'attack_bonus', value: 0.1 },
      { level: 2, type: 'attack_bonus', value: 0.2 },
      { level: 3, type: 'attack_bonus', value: 0.35 },
    ],
    unlockCondition: 'clear_1-3',
    upgradeCosts: [200, 500, 1000],
  },
  {
    id: 'gacha_machine',
    name: '扭蛋机',
    emoji: '🎰',
    description: '消耗宠物碎片抽取新宠物',
    maxLevel: 3,
    effects: [
      { level: 1, type: 'rare_chance', value: 0 },
      { level: 2, type: 'rare_chance', value: 0.05 },
      { level: 3, type: 'rare_chance', value: 0.1 },
    ],
    unlockCondition: 'clear_1-5',
    upgradeCosts: [300, 800, 1500],
  },
  {
    id: 'library',
    name: '智慧图书馆',
    emoji: '📚',
    description: '解锁更多技能进入技能池',
    maxLevel: 3,
    effects: [
      { level: 1, type: 'skill_pool', value: 10 },
      { level: 2, type: 'skill_pool', value: 15 },
      { level: 3, type: 'skill_pool', value: 20 },
    ],
    unlockCondition: 'clear_2-1',
    upgradeCosts: [400, 1000, 2000],
  },
  {
    id: 'decoration_shop',
    name: '装饰商店',
    emoji: '🎨',
    description: '购买家园装饰物',
    maxLevel: 3,
    effects: [
      { level: 1, type: 'decoration_slots', value: 3 },
      { level: 2, type: 'decoration_slots', value: 6 },
      { level: 3, type: 'decoration_slots', value: 10 },
    ],
    unlockCondition: 'coins_1000',
    upgradeCosts: [500, 1200, 2500],
  },
  {
    id: 'fortune_house',
    name: '占卜屋',
    emoji: '🔮',
    description: '每日免费获得一个增益',
    maxLevel: 3,
    effects: [
      { level: 1, type: 'daily_buff', value: 1 },
      { level: 2, type: 'daily_buff', value: 1.5 },
      { level: 3, type: 'daily_buff', value: 2 },
    ],
    unlockCondition: 'clear_2-5',
    upgradeCosts: [600, 1500, 3000],
  },
  {
    id: 'hall_of_fame',
    name: '荣誉殿堂',
    emoji: '🏆',
    description: '展示成就和收集进度',
    maxLevel: 3,
    effects: [
      { level: 1, type: 'achievement_bonus', value: 0.1 },
      { level: 2, type: 'achievement_bonus', value: 0.2 },
      { level: 3, type: 'achievement_bonus', value: 0.3 },
    ],
    unlockCondition: 'clear_3-1',
    upgradeCosts: [800, 2000, 4000],
  },
];

export function getBuildingConfig(id: string): BuildingConfig | undefined {
  return BUILDINGS.find((b) => b.id === id);
}
