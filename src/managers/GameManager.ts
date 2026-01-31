import { SaveData, PetConfig, PetState } from '../types';
import { PETS } from '../data/pets';
import { SaveSystem } from '../systems/SaveSystem';

export class GameManager {
  private static instance: GameManager;
  private saveData!: SaveData;
  private saveSystem: SaveSystem;

  private constructor() {
    this.saveSystem = new SaveSystem();
    this.loadGame();
  }

  public static getInstance(): GameManager {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }
    return GameManager.instance;
  }

  private loadGame(): void {
    const saved = this.saveSystem.load();
    if (saved) {
      this.saveData = saved;
    } else {
      this.initNewGame();
    }
  }

  private initNewGame(): void {
    this.saveData = {
      version: 1,
      coins: 100,
      fragments: 10,
      unlockedPets: ['cat_panghu', 'dog_wangcai'],
      petStates: {
        cat_panghu: { id: 'cat_panghu', level: 1, exp: 0 },
        dog_wangcai: { id: 'dog_wangcai', level: 1, exp: 0 },
      },
      selectedPets: ['cat_panghu'],
      buildings: {
        pet_house: 1,
        restaurant: 1,
        training_ground: 0,
        gacha_machine: 0,
        library: 0,
        decoration_shop: 0,
      },
      clearedLevels: [],
      currentLevel: '1-1',
      statistics: {
        totalPlayTime: 0,
        totalKills: 0,
        maxCombo: 0,
        totalCoins: 0,
        gamesPlayed: 0,
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.saveGame();
  }

  public saveGame(): void {
    this.saveData.updatedAt = Date.now();
    this.saveSystem.save(this.saveData);
  }

  // ===== 金币和碎片 =====

  public getCoins(): number {
    return this.saveData.coins;
  }

  public addCoins(amount: number): void {
    this.saveData.coins += amount;
    this.saveData.statistics.totalCoins += amount;
  }

  public spendCoins(amount: number): boolean {
    if (this.saveData.coins >= amount) {
      this.saveData.coins -= amount;
      return true;
    }
    return false;
  }

  public getFragments(): number {
    return this.saveData.fragments;
  }

  public addFragments(amount: number): void {
    this.saveData.fragments += amount;
  }

  public spendFragments(amount: number): boolean {
    if (this.saveData.fragments >= amount) {
      this.saveData.fragments -= amount;
      return true;
    }
    return false;
  }

  // ===== 宠物 =====

  public getUnlockedPets(): string[] {
    return this.saveData.unlockedPets;
  }

  public getSelectedPets(): string[] {
    return this.saveData.selectedPets;
  }

  public setSelectedPets(petIds: string[]): void {
    this.saveData.selectedPets = petIds;
  }

  public getPetConfigs(petIds: string[]): PetConfig[] {
    return petIds
      .map((id) => PETS.find((p) => p.id === id))
      .filter((p): p is PetConfig => p !== undefined);
  }

  public getPetState(petId: string): PetState | undefined {
    return this.saveData.petStates[petId];
  }

  public unlockPet(petId: string): void {
    if (!this.saveData.unlockedPets.includes(petId)) {
      this.saveData.unlockedPets.push(petId);
      this.saveData.petStates[petId] = { id: petId, level: 1, exp: 0 };
    }
  }

  // ===== 建筑 =====

  public getBuildingLevel(buildingId: string): number {
    return this.saveData.buildings[buildingId] || 0;
  }

  public upgradeBuiding(buildingId: string): boolean {
    const currentLevel = this.getBuildingLevel(buildingId);
    // 简化升级逻辑，实际应检查升级条件和扣除费用
    this.saveData.buildings[buildingId] = currentLevel + 1;
    return true;
  }

  public getBuildingBonuses(): { hpBonus: number; attackBonus: number } {
    const restaurantLevel = this.getBuildingLevel('restaurant');
    const trainingLevel = this.getBuildingLevel('training_ground');

    // 每级10%加成
    return {
      hpBonus: restaurantLevel * 0.1,
      attackBonus: trainingLevel * 0.1,
    };
  }

  // ===== 关卡 =====

  public getClearedLevels(): string[] {
    return this.saveData.clearedLevels;
  }

  public isLevelCleared(levelId: string): boolean {
    return this.saveData.clearedLevels.includes(levelId);
  }

  public markLevelCleared(levelId: string): void {
    if (!this.saveData.clearedLevels.includes(levelId)) {
      this.saveData.clearedLevels.push(levelId);
    }
  }

  public getCurrentLevel(): string {
    return this.saveData.currentLevel;
  }

  public setCurrentLevel(levelId: string): void {
    this.saveData.currentLevel = levelId;
  }

  // ===== 统计 =====

  public updateMaxCombo(combo: number): void {
    if (combo > this.saveData.statistics.maxCombo) {
      this.saveData.statistics.maxCombo = combo;
    }
  }

  public addKills(count: number): void {
    this.saveData.statistics.totalKills += count;
  }

  public incrementGamesPlayed(): void {
    this.saveData.statistics.gamesPlayed += 1;
  }

  public getStatistics() {
    return this.saveData.statistics;
  }

  // ===== 重置 =====

  public resetGame(): void {
    this.saveSystem.clear();
    this.initNewGame();
  }
}
