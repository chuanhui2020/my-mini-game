import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // 创建加载进度条
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // 标题
    this.add.text(width / 2, height / 2 - 100, '喵汪大作战', {
      fontSize: '48px',
      color: '#ffffff',
      fontFamily: 'Arial',
    }).setOrigin(0.5);

    // 加载进度条背景
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    // 加载进度条
    const progressBar = this.add.graphics();

    // 加载文字
    const loadingText = this.add.text(width / 2, height / 2 + 50, '加载中...', {
      fontSize: '20px',
      color: '#ffffff',
    }).setOrigin(0.5);

    // 监听加载进度
    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0x00ff88, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });

    // 这里可以加载资源，目前使用占位符，跳过资源加载
    // Note: assets are served from the Vite `public/` folder so they are
    // available in both dev and production builds.
    this.load.setPath('images');

    // Backgrounds
    this.load.image('bg_home', 'bg_home.png');
    this.load.image('bg_battle_garden', 'bg_battle_garden.png');
    this.load.image('bg_battle_beach', 'bg_battle_beach.png');
    this.load.image('bg_battle_snow', 'bg_battle_snow.png');
    this.load.image('bg_battle_volcano', 'bg_battle_volcano.png');

    // Buildings
    this.load.image('building_pet_house', 'building_pet_house.png');
    this.load.image('building_restaurant', 'building_restaurant.png');
    this.load.image('building_gym', 'building_gym.png');
    this.load.image('building_gacha', 'building_gacha.png');
    this.load.image('building_library', 'building_library.png');
    this.load.image('building_shop', 'building_shop.png');

    // Pets
    this.load.image('pet_cat', 'pet_cat.png');
    this.load.image('pet_dog', 'pet_dog.png');
    this.load.image('pet_rabbit', 'pet_rabbit.png');

    // Enemies - 普通怪物
    this.load.image('enemy_thief', 'enemy_thief.png');
    this.load.image('enemy_troublemaker', 'enemy_troublemaker.png');
    this.load.image('enemy_stinky_sock', 'enemy_stinky_sock.png');
    this.load.image('enemy_prankster', 'enemy_prankster.png');
    this.load.image('enemy_invisible', 'enemy_invisible.png');
    
    // Enemies - 精英怪物
    this.load.image('enemy_iron_head', 'enemy_iron_head.png');
    this.load.image('enemy_splitter', 'enemy_splitter.png');
    this.load.image('enemy_bomber', 'enemy_bomber.png');
    
    // Enemies - BOSS
    this.load.image('boss_rat_king', 'boss_rat_king.png');
    this.load.image('boss_crab_general', 'boss_crab_general.png');
    this.load.image('boss_snowman', 'boss_snowman.png');
    this.load.image('boss_flame_lord', 'boss_flame_lord.png');

    // Objects
    this.load.image('hole_normal', 'hole_normal.png');
  }

  create(): void {
    // 初始化游戏管理器
    this.time.delayedCall(500, () => {
      this.scene.start('MenuScene');
    });
  }
}
