import Phaser from 'phaser';
import { Hole } from '../objects/Hole';
import { Enemy } from '../objects/Enemy';
import { getLevelConfig } from '../data/levels';
import { getEnemyConfig } from '../data/enemies';
import { LevelConfig, WaveConfig } from '../types';

interface WaveCallbacks {
  onWaveComplete: () => void;
  onAllWavesComplete: () => void;
  onEnemyEscape: (damage: number) => void;
  onEnemyKilled: (score: number, coins: number, source: 'player' | 'pet') => void;
}

export class WaveSystem {
  private scene: Phaser.Scene;
  private holes: Hole[];
  private levelConfig: LevelConfig;
  private callbacks: WaveCallbacks;

  private currentWaveIndex: number = -1;
  private currentWave: WaveConfig | null = null;
  private enemyQueue: string[] = [];
  private activeEnemies: Enemy[] = [];
  private spawnTimer: number = 0;
  private waveInProgress: boolean = false;
  private bossSpawned: boolean = false;

  constructor(
    scene: Phaser.Scene,
    holes: Hole[],
    levelId: string,
    callbacks: WaveCallbacks
  ) {
    this.scene = scene;
    this.holes = holes;
    this.callbacks = callbacks;

    const config = getLevelConfig(levelId);
    if (!config) {
      throw new Error(`Level not found: ${levelId}`);
    }
    this.levelConfig = config;
  }

  public startWave(): void {
    this.currentWaveIndex++;
    console.log('[WaveSystem] startWave called, currentWaveIndex:', this.currentWaveIndex);

    // 检查是否还有波次
    if (this.currentWaveIndex >= this.levelConfig.waves.length) {
      console.log('[WaveSystem] No more regular waves, checking for boss...');
      // 检查是否有BOSS
      if (this.levelConfig.bossId && !this.bossSpawned) {
        this.spawnBoss();
        return;
      }
      // 所有波次完成
      this.callbacks.onAllWavesComplete();
      return;
    }

    this.currentWave = this.levelConfig.waves[this.currentWaveIndex];
    this.enemyQueue = [...this.currentWave.enemies];
    this.waveInProgress = true;
    this.spawnTimer = 0;
    console.log('[WaveSystem] Wave started, enemies in queue:', this.enemyQueue.length, 'waveInProgress:', this.waveInProgress);

    // 显示波次提示
    this.showWaveText();
  }

  private showWaveText(): void {
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;

    const waveText = this.scene.add.text(
      width / 2,
      height / 2,
      `第 ${this.currentWaveIndex + 1} 波`,
      {
        fontSize: '48px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
      }
    ).setOrigin(0.5);

    this.scene.tweens.add({
      targets: waveText,
      alpha: 0,
      y: waveText.y - 50,
      duration: 1000,
      delay: 500,
      onComplete: () => {
        waveText.destroy();
      },
    });
  }

  public update(_time: number, delta: number): void {
    if (!this.waveInProgress || !this.currentWave) {
      // 仅打印一次警告
      return;
    }

    // 生成敌人
    this.spawnTimer += delta;
    if (this.spawnTimer >= this.currentWave.spawnInterval) {
      this.spawnTimer = 0;
      console.log('[WaveSystem] Trying to spawn enemy, queue size:', this.enemyQueue.length);
      this.trySpawnEnemy();
    }

    // 清理已死亡的敌人
    this.activeEnemies = this.activeEnemies.filter((e) => e.isAliveState());

    // 检查波次是否完成
    if (
      this.enemyQueue.length === 0 &&
      this.activeEnemies.length === 0 &&
      this.waveInProgress
    ) {
      this.waveInProgress = false;
      this.callbacks.onWaveComplete();
    }
  }

  private trySpawnEnemy(): void {
    if (this.enemyQueue.length === 0) {
      console.log('[WaveSystem] trySpawnEnemy: queue is empty');
      return;
    }
    if (!this.currentWave) {
      console.log('[WaveSystem] trySpawnEnemy: no current wave');
      return;
    }

    // 检查是否超过最大并发数
    if (this.activeEnemies.length >= this.currentWave.maxConcurrent) {
      console.log('[WaveSystem] trySpawnEnemy: max concurrent reached', this.activeEnemies.length);
      return;
    }

    // 找一个空闲的洞穴
    const availableHoles = this.holes.filter((h) => h.isAvailable());
    console.log('[WaveSystem] Available holes:', availableHoles.length, 'Total holes:', this.holes.length);
    if (availableHoles.length === 0) {
      console.log('[WaveSystem] No available holes!');
      return;
    }

    const hole = Phaser.Utils.Array.GetRandom(availableHoles);
    const enemyId = this.enemyQueue.shift()!;
    console.log('[WaveSystem] Spawning enemy:', enemyId);
    const config = getEnemyConfig(enemyId);

    if (!config) {
      console.warn(`Enemy config not found: ${enemyId}`);
      return;
    }

    const enemy = new Enemy(
      this.scene,
      config,
      (score, coins, source) => this.callbacks.onEnemyKilled(score, coins, source),
      (damage) => this.callbacks.onEnemyEscape(damage)
    );

    this.activeEnemies.push(enemy);
    hole.spawnEnemy(enemy);
  }

  private spawnBoss(): void {
    this.bossSpawned = true;
    this.waveInProgress = true;

    const bossConfig = getEnemyConfig(this.levelConfig.bossId!);
    if (!bossConfig) {
      console.warn(`Boss config not found: ${this.levelConfig.bossId}`);
      this.callbacks.onAllWavesComplete();
      return;
    }

    // 显示BOSS警告
    this.showBossWarning(() => {
      // 在中间的洞穴生成BOSS
      const centerHole = this.holes[4]; // 3x3网格的中心

      const boss = new Enemy(
        this.scene,
        bossConfig,
        (score, coins, source) => {
          this.callbacks.onEnemyKilled(score, coins, source);
          // BOSS死亡后完成关卡
          this.scene.time.delayedCall(500, () => {
            this.callbacks.onAllWavesComplete();
          });
        },
        (damage) => this.callbacks.onEnemyEscape(damage)
      );

      this.activeEnemies.push(boss);
      centerHole.spawnEnemy(boss);
    });
  }

  private showBossWarning(callback: () => void): void {
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;

    // 屏幕变暗
    const overlay = this.scene.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x000000,
      0.5
    );

    // 警告文字
    const warningText = this.scene.add.text(
      width / 2,
      height / 2,
      '⚠️ BOSS 来袭!',
      {
        fontSize: '56px',
        color: '#ff4444',
        stroke: '#000000',
        strokeThickness: 6,
      }
    ).setOrigin(0.5);

    // 震动效果
    this.scene.cameras.main.shake(500, 0.02);

    // 闪烁动画
    this.scene.tweens.add({
      targets: warningText,
      alpha: 0.5,
      duration: 200,
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        overlay.destroy();
        warningText.destroy();
        callback();
      },
    });
  }

  public attackRandomEnemy(damage: number): void {
    const aliveEnemies = this.activeEnemies.filter((e) => e.isAliveState());
    if (aliveEnemies.length === 0) return;

    const target = Phaser.Utils.Array.GetRandom(aliveEnemies);
    target.takeDamage(damage);
  }

  public attackAllEnemies(damage: number): void {
    this.activeEnemies.forEach((enemy) => {
      if (enemy.isAliveState()) {
        enemy.takeDamage(damage);
      }
    });
  }

  public freezeAllEnemies(duration: number): void {
    this.activeEnemies.forEach((enemy) => {
      if (enemy.isAliveState()) {
        enemy.freeze(duration);
      }
    });
  }

  public getCurrentWaveIndex(): number {
    return this.currentWaveIndex;
  }

  public getTotalWaves(): number {
    return this.levelConfig.waves.length + (this.levelConfig.bossId ? 1 : 0);
  }

  // 检查是否还有更多波次（包括BOSS）
  public hasMoreWaves(): boolean {
    const nextWaveIndex = this.currentWaveIndex + 1;

    // 还有普通波次
    if (nextWaveIndex < this.levelConfig.waves.length) {
      return true;
    }

    // 有BOSS且还没打
    if (this.levelConfig.bossId && !this.bossSpawned) {
      return true;
    }

    return false;
  }
}
