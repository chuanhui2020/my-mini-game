import Phaser from 'phaser';
import { GameManager } from '../managers/GameManager';

export class HomeScene extends Phaser.Scene {
  private gameManager!: GameManager;
  private uiScale = 1;
  private headerHeight = 0;
  private footerHeight = 0;

  constructor() {
    super({ key: 'HomeScene' });
  }

  create(): void {
    this.gameManager = GameManager.getInstance();

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // 基于设计分辨率的全局缩放，保证不同屏幕下的布局与字号一致
    const designWidth = 1280;
    const designHeight = 720;
    this.uiScale = Phaser.Math.Clamp(Math.min(width / designWidth, height / designHeight), 0.7, 1.25);
    this.headerHeight = this.scaleUi(120);
    this.footerHeight = this.scaleUi(140);

    // 背景 - 优化显示方式，保持图片完整性
    const bg = this.add.image(width / 2, height / 2, 'bg_home');

    // 计算缩放比例以覆盖整个画面，同时保持宽高比
    const scaleX = width / bg.width;
    const scaleY = height / bg.height;
    const scale = Math.max(scaleX, scaleY);
    bg.setScale(scale);
    bg.setScrollFactor(0);

    // 标题栏
    this.createHeader();

    // 家园区域
    this.createHomeArea();

    // 底部按钮
    this.createBottomButtons();
  }

  private scaleUi(value: number): number {
    return value * this.uiScale;
  }

  private font(size: number): string {
    return `${Math.round(size * this.uiScale)}px`;
  }

  private createHeader(): void {
    const width = this.cameras.main.width;
    const overlayHeight = this.headerHeight + this.scaleUi(16);

    // 顶部遮罩 - 渐变加强
    const headerOverlay = this.add.graphics();
    headerOverlay.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.5, 0.5, 0, 0);
    headerOverlay.fillRect(0, 0, width, overlayHeight);

    // 资源显示区 - 左上角胶囊样式
    const rscStartX = this.scaleUi(22);
    const resourceYStart = this.headerHeight * 0.35;
    const resourceGap = this.scaleUi(54);
    this.createResourcePill(rscStartX, resourceYStart, 'coin', this.gameManager.getCoins(), 0xffcc00);
    this.createResourcePill(rscStartX, resourceYStart + resourceGap, 'gem', this.gameManager.getFragments(), 0xaa88ff);

    // 标题背景装饰板
    const titleBgWidth = this.scaleUi(320);
    const titleBgHeight = this.scaleUi(64);
    const titleBg = this.add.graphics();
    titleBg.fillStyle(0xffffff, 0.12);
    titleBg.fillRoundedRect(width / 2 - titleBgWidth / 2, (overlayHeight - titleBgHeight) / 2, titleBgWidth, titleBgHeight, this.scaleUi(30));
    titleBg.lineStyle(this.scaleUi(2), 0xffd700, 0.4);
    titleBg.strokeRoundedRect(width / 2 - titleBgWidth / 2, (overlayHeight - titleBgHeight) / 2, titleBgWidth, titleBgHeight, this.scaleUi(30));

    // 标题图标
    this.add.text(width / 2 - this.scaleUi(90), overlayHeight / 2, '🏠', {
      fontSize: this.font(36)
    }).setOrigin(0.5);

    // 标题文字 - 增强视觉效果
    this.add.text(width / 2 + this.scaleUi(20), overlayHeight / 2, '我的家园', {
      fontSize: this.font(34),
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#2a2a2a',
      strokeThickness: Math.max(1, Math.round(this.scaleUi(5))),
      shadow: { offsetX: this.scaleUi(2), offsetY: this.scaleUi(2), color: '#000000', blur: this.scaleUi(5), stroke: true, fill: true }
    }).setOrigin(0.5);

    // 装饰星星
    const starOffset = this.scaleUi(140);
    const star1 = this.add.text(width / 2 - starOffset, overlayHeight / 2, '✨', { fontSize: this.font(20) }).setOrigin(0.5);
    const star2 = this.add.text(width / 2 + starOffset, overlayHeight / 2, '✨', { fontSize: this.font(20) }).setOrigin(0.5);

    // 星星闪烁动画
    this.tweens.add({
      targets: [star1, star2],
      alpha: 0.4,
      scale: 0.8,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // 装饰线
    const lineGraphics = this.add.graphics();
    lineGraphics.lineStyle(this.scaleUi(2), 0xffd700, 0.3);
    lineGraphics.beginPath();
    lineGraphics.moveTo(width / 2 - this.scaleUi(140), overlayHeight / 2 + this.scaleUi(30));
    lineGraphics.lineTo(width / 2 + this.scaleUi(140), overlayHeight / 2 + this.scaleUi(30));
    lineGraphics.strokePath();

    // 右上角设置按钮
    this.createSettingsButton(width - this.scaleUi(65), overlayHeight / 2);
  }

  private createResourcePill(x: number, y: number, iconKey: string, value: number, color: number): void {
    const pillW = this.scaleUi(168);
    const pillH = this.scaleUi(48);
    const container = this.add.container(x, y);

    // 外发光效果
    const glow = this.add.graphics();
    glow.fillStyle(color, 0.22);
    glow.fillRoundedRect(-this.scaleUi(4), -pillH / 2 - this.scaleUi(4), pillW + this.scaleUi(8), pillH + this.scaleUi(8), this.scaleUi(24));
    container.add(glow);

    // 背景胶囊 - 更强的对比度
    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 0.7);
    bg.fillRoundedRect(0, -pillH / 2, pillW, pillH, this.scaleUi(22));
    bg.lineStyle(this.scaleUi(3), color, 0.8);
    bg.strokeRoundedRect(0, -pillH / 2, pillW, pillH, this.scaleUi(22));
    container.add(bg);

    // 图标背景 - 渐变效果
    const iconBg = this.add.graphics();
    iconBg.fillGradientStyle(color, color, color * 0.7, color * 0.7, 1, 1, 0.9, 0.9);
    iconBg.fillCircle(this.scaleUi(26), 0, this.scaleUi(18));
    iconBg.lineStyle(this.scaleUi(2), 0xffffff, 0.9);
    iconBg.strokeCircle(this.scaleUi(26), 0, this.scaleUi(18));
    container.add(iconBg);

    // 图标文字
    const iconStr = iconKey === 'coin' ? '💰' : '💎';
    const icon = this.add.text(this.scaleUi(26), 0, iconStr, { fontSize: this.font(20) }).setOrigin(0.5);
    container.add(icon);

    // 数值 - 增强对比度和阴影
    const text = this.add.text(56, 0, `${value}`, {
      fontSize: this.font(24),
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: Math.max(1, Math.round(this.scaleUi(3))),
      shadow: { offsetX: this.scaleUi(2), offsetY: this.scaleUi(2), color: '#000000', blur: this.scaleUi(4), fill: true }
    }).setOrigin(0, 0.5);
    text.setX(this.scaleUi(56));
    container.add(text);

    // 微光闪烁动画
    this.tweens.add({
      targets: glow,
      alpha: 0.4,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  private createHomeArea(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const contentTop = this.headerHeight + this.scaleUi(16);
    const contentBottom = height - this.footerHeight - this.scaleUi(24);
    const availableHeight = Math.max(this.scaleUi(240), contentBottom - contentTop);

    // 建筑物展示区域 - 玻璃拟态面板 (Glassmorphism)
    const panelCols = 3;
    const panelRows = 2;
    const cardWidth = this.scaleUi(148);
    const cardHeight = this.scaleUi(176);
    const gapX = this.scaleUi(28);
    const gapY = this.scaleUi(26);

    const contentWidth = panelCols * cardWidth + (panelCols - 1) * gapX;
    const contentHeight = panelRows * cardHeight + (panelRows - 1) * gapY;

    const panelPaddingX = this.scaleUi(44);
    const panelPaddingY = this.scaleUi(32);
    const panelWidth = contentWidth + panelPaddingX * 2;
    const panelHeight = contentHeight + panelPaddingY * 2;

    const panelX = width / 2;
    const panelY = contentTop + availableHeight * 0.45; // 稍微靠上

    // 玻璃面板背景
    const glassPanel = this.add.graphics();
    glassPanel.fillStyle(0xffffff, 0.15); // 非常淡的白色
    glassPanel.fillRoundedRect(panelX - panelWidth / 2, panelY - panelHeight / 2, panelWidth, panelHeight, this.scaleUi(30));
    glassPanel.lineStyle(this.scaleUi(2), 0xffffff, 0.3); // 淡淡的白色描边
    glassPanel.strokeRoundedRect(panelX - panelWidth / 2, panelY - panelHeight / 2, panelWidth, panelHeight, this.scaleUi(30));

    // 计算起始位置 (基于面板中心)
    const startX = panelX - contentWidth / 2 + cardWidth / 2;
    const startY = panelY - contentHeight / 2 + cardHeight / 2;

    const buildings = [
      { key: 'building_pet_house', name: '宠物窝', row: 0, col: 0 },
      { key: 'building_restaurant', name: '餐厅', row: 0, col: 1 },
      { key: 'building_gym', name: '训练场', row: 0, col: 2 },
      { key: 'building_gacha', name: '扭蛋机', row: 1, col: 0 },
      { key: 'building_library', name: '图书馆', row: 1, col: 1 },
      { key: 'building_shop', name: '装饰店', row: 1, col: 2 },
    ];

    buildings.forEach((building) => {
      const x = startX + building.col * (cardWidth + gapX);
      const y = startY + building.row * (cardHeight + gapY);
      this.createBuildingSlot(x, y, building.key, building.name);
    });

    // 当前宠物展示区域 (移至左侧，优化视觉效果)
    const petAreaY = contentBottom - this.scaleUi(14);
    const petAreaX = Math.max(width * 0.16, this.scaleUi(140));

    // 宠物展示台背景
    const petPlatform = this.add.graphics();
    petPlatform.fillStyle(0xffffff, 0.15);
    petPlatform.fillRoundedRect(petAreaX - this.scaleUi(85), petAreaY - this.scaleUi(90), this.scaleUi(170), this.scaleUi(140), this.scaleUi(20));
    petPlatform.lineStyle(this.scaleUi(2), 0xffd700, 0.4);
    petPlatform.strokeRoundedRect(petAreaX - this.scaleUi(85), petAreaY - this.scaleUi(90), this.scaleUi(170), this.scaleUi(140), this.scaleUi(20));

    // 宠物脚底光晕
    const petGlow = this.add.ellipse(petAreaX, petAreaY + this.scaleUi(35), this.scaleUi(110), this.scaleUi(25), 0xffee88, 0.3);
    this.tweens.add({
      targets: petGlow,
      alpha: 0.5,
      scaleX: 1.15,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // 宠物脚底阴影
    this.add.ellipse(petAreaX, petAreaY + this.scaleUi(40), this.scaleUi(100), this.scaleUi(20), 0x000000, 0.4);

    // 标题气泡 - 优化样式
    const titleBubble = this.add.container(petAreaX, petAreaY - this.scaleUi(80));
    const bubbleBg = this.add.graphics();
    // 渐变背景
    bubbleBg.fillGradientStyle(0xffffff, 0xffffff, 0xf5f5f5, 0xf5f5f5, 0.95, 0.95, 0.9, 0.9);
    bubbleBg.fillRoundedRect(-this.scaleUi(65), -this.scaleUi(22), this.scaleUi(130), this.scaleUi(44), this.scaleUi(22));
    // 金色边框
    bubbleBg.lineStyle(this.scaleUi(2), 0xffd700, 0.6);
    bubbleBg.strokeRoundedRect(-this.scaleUi(65), -this.scaleUi(22), this.scaleUi(130), this.scaleUi(44), this.scaleUi(22));
    // 内发光
    bubbleBg.lineStyle(this.scaleUi(1), 0xffffff, 0.7);
    bubbleBg.strokeRoundedRect(-this.scaleUi(64), -this.scaleUi(21), this.scaleUi(128), this.scaleUi(42), this.scaleUi(21));

    const bubbleText = this.add.text(0, 0, 'Ready!', {
      fontSize: this.font(22),
      color: '#ff6b35',
      fontStyle: 'bold',
      stroke: '#ffffff',
      strokeThickness: Math.max(1, Math.round(this.scaleUi(2))),
      shadow: { offsetX: this.scaleUi(1), offsetY: this.scaleUi(1), color: '#000000', blur: this.scaleUi(2), fill: true }
    }).setOrigin(0.5);
    titleBubble.add([bubbleBg, bubbleText]);

    // 气泡动画
    this.tweens.add({
      targets: titleBubble,
      y: titleBubble.y - 10,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // 宠物只显示选中的第一个 (Leader)
    const selectedPetIds = this.gameManager.getSelectedPets();
    const petImages: { [key: string]: string } = {
      'pet_1': 'pet_cat',
      'pet_2': 'pet_dog',
      'default': 'pet_cat'
    };
    const leaderId = selectedPetIds.length > 0 ? selectedPetIds[0] : 'pet_1';
    const petImageKey = petImages[leaderId] || petImages['default'];

    // 宠物精灵 - 移除遮罩，保持完整显示
    const petSprite = this.add.image(petAreaX, petAreaY, petImageKey);
    petSprite.setDisplaySize(this.scaleUi(110), this.scaleUi(110));

    // 宠物轻柔浮动动画 - 只改变位置，不改变大小避免变形感
    this.tweens.add({
      targets: petSprite,
      y: petAreaY - 5,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  private createBuildingSlot(x: number, y: number, key: string, name: string): void {
    const container = this.add.container(x, y);

    const w = this.scaleUi(140);
    const h = this.scaleUi(170);

    // 1. 外层光晕背景（悬浮时更明显）
    const outerGlow = this.add.graphics();
    outerGlow.fillStyle(0xffdd88, 0.3);
    outerGlow.fillCircle(0, -this.scaleUi(10), w / 1.8);
    outerGlow.setAlpha(0);
    container.add(outerGlow);

    // 2. 卡片阴影
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.3);
    shadow.fillRoundedRect(-w / 2 + this.scaleUi(4), -h / 2 + this.scaleUi(4), w, h, this.scaleUi(20));
    container.add(shadow);

    // 3. 卡片主体 - 渐变背景
    const cardBg = this.add.graphics();
    cardBg.fillGradientStyle(0xffffff, 0xffffff, 0xf0f0f0, 0xf0f0f0, 0.95, 0.95, 0.85, 0.85);
    cardBg.fillRoundedRect(-w / 2, -h / 2, w, h, this.scaleUi(20));

    // 金色边框
    cardBg.lineStyle(this.scaleUi(3), 0xffd700, 0.6);
    cardBg.strokeRoundedRect(-w / 2, -h / 2, w, h, this.scaleUi(20));

    // 内发光
    cardBg.lineStyle(this.scaleUi(1), 0xffffff, 0.8);
    cardBg.strokeRoundedRect(-w / 2 + this.scaleUi(2), -h / 2 + this.scaleUi(2), w - this.scaleUi(4), h - this.scaleUi(4), this.scaleUi(18));
    container.add(cardBg);

    // 4. 装饰线条（顶部）
    const decorLine = this.add.graphics();
    decorLine.lineStyle(this.scaleUi(2), 0xffd700, 0.4);
    decorLine.beginPath();
    decorLine.moveTo(-w / 4, -h / 2 + this.scaleUi(12));
    decorLine.lineTo(w / 4, -h / 2 + this.scaleUi(12));
    decorLine.strokePath();
    container.add(decorLine);

    // 5. 交互体
    const hitArea = this.add.rectangle(0, 0, w, h, 0x000000, 0);
    hitArea.setInteractive({ useHandCursor: true });
    container.add(hitArea);

    // 6. 图标背景光晕
    const iconGlow = this.add.circle(0, -this.scaleUi(20), this.scaleUi(56), 0xffee88, 0.2);
    container.add(iconGlow);

    // 7. 图标
    const icon = this.add.image(0, -this.scaleUi(20), key);
    icon.setDisplaySize(this.scaleUi(100), this.scaleUi(100));
    container.add(icon);

    // 8. 标签背景（木质路牌风格）
    const nameBg = this.add.graphics();
    // 主体
    nameBg.fillGradientStyle(0x6b4423, 0x6b4423, 0x5a3d2b, 0x5a3d2b, 1, 1, 0.95, 0.95);
    nameBg.fillRoundedRect(-w / 2 + this.scaleUi(12), h / 2 - this.scaleUi(42), w - this.scaleUi(24), this.scaleUi(34), this.scaleUi(17));
    // 金色边框
    nameBg.lineStyle(this.scaleUi(2), 0xd4a76a, 0.8);
    nameBg.strokeRoundedRect(-w / 2 + this.scaleUi(12), h / 2 - this.scaleUi(42), w - this.scaleUi(24), this.scaleUi(34), this.scaleUi(17));
    // 高光
    nameBg.lineStyle(this.scaleUi(1), 0xffffff, 0.3);
    nameBg.strokeRoundedRect(-w / 2 + this.scaleUi(13), h / 2 - this.scaleUi(41), w - this.scaleUi(26), this.scaleUi(32), this.scaleUi(16));
    container.add(nameBg);

    // 9. 标签文字
    const label = this.add.text(0, h / 2 - this.scaleUi(25), name, {
      fontSize: this.font(17),
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#2a1810',
      strokeThickness: Math.max(1, Math.round(this.scaleUi(3))),
      shadow: { offsetX: this.scaleUi(1), offsetY: this.scaleUi(1), color: '#000000', blur: this.scaleUi(2), fill: true }
    }).setOrigin(0.5);
    container.add(label);

    // 交互逻辑
    hitArea.on('pointerdown', () => {
      this.showBuildingInfo(name, key);
      this.tweens.add({
        targets: container,
        scaleX: 0.92,
        scaleY: 0.92,
        duration: 80,
        yoyo: true,
        ease: 'Quad.easeOut'
      });
    });

    hitArea.on('pointerover', () => {
      this.tweens.add({
        targets: container,
        y: y - this.scaleUi(12),
        scaleX: 1.08,
        scaleY: 1.08,
        duration: 200,
        ease: 'Back.easeOut'
      });
      this.tweens.add({
        targets: outerGlow,
        alpha: 1,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 200
      });
      this.tweens.add({
        targets: iconGlow,
        alpha: 0.5,
        scaleX: 1.3,
        scaleY: 1.3,
        duration: 200
      });
    });

    hitArea.on('pointerout', () => {
      this.tweens.add({
        targets: container,
        y: y,
        scaleX: 1,
        scaleY: 1,
        duration: 200,
        ease: 'Back.easeIn'
      });
      this.tweens.add({
        targets: outerGlow,
        alpha: 0,
        scaleX: 1,
        scaleY: 1,
        duration: 200
      });
      this.tweens.add({
        targets: iconGlow,
        alpha: 0.2,
        scaleX: 1,
        scaleY: 1,
        duration: 200
      });
    });

    // 随机浮动动画
    this.tweens.add({
      targets: container,
      y: y - this.scaleUi(4),
      duration: 2500 + Math.random() * 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // 图标脉冲动画
    this.tweens.add({
      targets: iconGlow,
      scaleX: 1.1,
      scaleY: 1.1,
      alpha: 0.35,
      duration: 2000 + Math.random() * 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  private showBuildingInfo(name: string, emoji: string): void {
    // 简单提示，后续可以扩展为详细弹窗
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const popupW = this.scaleUi(400);
    const popupH = this.scaleUi(300);

    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.5);
    overlay.setInteractive();

    const popup = this.add.container(width / 2, height / 2);
    const popupBg = this.add.rectangle(0, 0, popupW, popupH, 0xffffff);
    popupBg.setStrokeStyle(this.scaleUi(3), 0x333333);

    const title = this.add.text(0, -this.scaleUi(100), `${emoji} ${name}`, {
      fontSize: this.font(32),
      color: '#333333',
    }).setOrigin(0.5);

    const desc = this.add.text(0, 0, '点击升级建筑\n提升属性加成', {
      fontSize: this.font(20),
      color: '#666666',
      align: 'center',
    }).setOrigin(0.5);

    const closeBtn = this.add.rectangle(0, this.scaleUi(100), this.scaleUi(140), this.scaleUi(46), 0x44aa44);
    closeBtn.setInteractive({ useHandCursor: true });
    const closeText = this.add.text(0, this.scaleUi(100), '关闭', {
      fontSize: this.font(20),
      color: '#ffffff',
    }).setOrigin(0.5);

    popup.add([popupBg, title, desc, closeBtn, closeText]);

    closeBtn.on('pointerdown', () => {
      overlay.destroy();
      popup.destroy();
    });

    overlay.on('pointerdown', () => {
      overlay.destroy();
      popup.destroy();
    });
  }

  private createBottomButtons(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const footerTop = height - this.footerHeight;

    // 底部黑色渐变，保证文字清晰
    const bottomGradient = this.add.graphics();
    bottomGradient.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0, 0, 0.75, 0.75);
    bottomGradient.fillRect(0, footerTop, width, this.footerHeight);

    // 关卡信息 - 左侧展示（优化的胶囊设计）
    const levelContainer = this.add.container(this.scaleUi(44), footerTop + this.footerHeight / 2);

    // 关卡外发光
    const levelGlow = this.add.graphics();
    levelGlow.fillStyle(0x88ee88, 0.2);
    levelGlow.fillRoundedRect(-this.scaleUi(4), -this.scaleUi(4), this.scaleUi(208), this.scaleUi(58), this.scaleUi(29));
    levelContainer.add(levelGlow);

    // 关卡背景
    const levelBg = this.add.graphics();
    levelBg.fillGradientStyle(0x2d5016, 0x2d5016, 0x1a3010, 0x1a3010, 0.85, 0.85, 0.9, 0.9);
    levelBg.fillRoundedRect(0, 0, this.scaleUi(200), this.scaleUi(50), this.scaleUi(25));
    // 金绿色边框
    levelBg.lineStyle(this.scaleUi(2), 0x88dd88, 0.6);
    levelBg.strokeRoundedRect(0, 0, this.scaleUi(200), this.scaleUi(50), this.scaleUi(25));
    // 内发光
    levelBg.lineStyle(this.scaleUi(1), 0xffffff, 0.3);
    levelBg.strokeRoundedRect(this.scaleUi(1), this.scaleUi(1), this.scaleUi(198), this.scaleUi(48), this.scaleUi(24));
    levelContainer.add(levelBg);

    const levelText = this.add.text(this.scaleUi(100), this.scaleUi(25), '1-1 后花园', {
      fontSize: this.font(20),
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#1a3010',
      strokeThickness: Math.max(1, Math.round(this.scaleUi(3))),
      shadow: { offsetX: this.scaleUi(1), offsetY: this.scaleUi(1), color: '#000000', blur: this.scaleUi(2), fill: true }
    }).setOrigin(0.5);

    const levelIcon = this.add.text(this.scaleUi(25), this.scaleUi(25), '🌿', { fontSize: this.font(26) }).setOrigin(0.5);
    levelContainer.add([levelIcon, levelText]);

    // 微光动画
    this.tweens.add({
      targets: levelGlow,
      alpha: 0.4,
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // 开始战斗按钮 - 优化设计
    const battleBtn = this.add.container(width - this.scaleUi(170), footerTop + this.footerHeight / 2);

    // 按钮外发光（三层渐进）
    const glowOuter = this.add.ellipse(0, this.scaleUi(5), this.scaleUi(280), this.scaleUi(100), 0xff3311, 0.15);
    const glowMid = this.add.ellipse(0, this.scaleUi(5), this.scaleUi(250), this.scaleUi(88), 0xff4422, 0.25);
    const glowInner = this.add.ellipse(0, this.scaleUi(5), this.scaleUi(220), this.scaleUi(76), 0xff5533, 0.35);

    // 按钮主体背景
    const btnBg = this.add.graphics();
    // 渐变填充
    btnBg.fillGradientStyle(0xff7755, 0xff5533, 0xdd3311, 0xcc2200, 1, 1, 0.95, 0.95);
    btnBg.fillRoundedRect(-this.scaleUi(110), -this.scaleUi(35), this.scaleUi(220), this.scaleUi(70), this.scaleUi(35));

    // 金色边框
    btnBg.lineStyle(this.scaleUi(3), 0xffdd88, 0.8);
    btnBg.strokeRoundedRect(-this.scaleUi(110), -this.scaleUi(35), this.scaleUi(220), this.scaleUi(70), this.scaleUi(35));

    // 内高光
    btnBg.lineStyle(this.scaleUi(2), 0xffaa88, 0.5);
    btnBg.strokeRoundedRect(-this.scaleUi(108), -this.scaleUi(33), this.scaleUi(216), this.scaleUi(66), this.scaleUi(33));

    // 装饰线（顶部高光）
    btnBg.lineStyle(this.scaleUi(2), 0xffffff, 0.4);
    btnBg.beginPath();
    btnBg.arc(0, -this.scaleUi(35), this.scaleUi(70), Math.PI * 1.2, Math.PI * 1.8);
    btnBg.strokePath();

    battleBtn.add([glowOuter, glowMid, glowInner, btnBg]);

    // 按钮文字
    const btnText = this.add.text(0, 0, '⚔️ 战斗', {
      fontSize: this.font(34),
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#660000',
      strokeThickness: Math.max(1, Math.round(this.scaleUi(4))),
      shadow: { offsetX: this.scaleUi(2), offsetY: this.scaleUi(2), color: '#000000', blur: this.scaleUi(4), fill: true }
    }).setOrigin(0.5);
    battleBtn.add(btnText);

    // 交互
    const hitArea = this.add.rectangle(0, 0, this.scaleUi(220), this.scaleUi(70), 0x000000, 0);
    hitArea.setInteractive({ useHandCursor: true });
    battleBtn.add(hitArea);

    hitArea.on('pointerdown', () => {
      this.tweens.add({
        targets: battleBtn,
        scaleX: 0.92,
        scaleY: 0.92,
        duration: 50,
        yoyo: true,
        onComplete: () => {
          this.scene.start('BattleScene', { levelId: '1-1' });
        }
      });
    });

    hitArea.on('pointerover', () => {
      this.tweens.add({
        targets: battleBtn,
        scaleX: 1.08,
        scaleY: 1.08,
        duration: 150,
        ease: 'Back.easeOut'
      });
      this.tweens.add({
        targets: [glowOuter, glowMid, glowInner],
        alpha: { from: [0.15, 0.25, 0.35], to: [0.3, 0.5, 0.7] },
        duration: 150
      });
    });

    hitArea.on('pointerout', () => {
      this.tweens.add({
        targets: battleBtn,
        scaleX: 1,
        scaleY: 1,
        duration: 150,
        ease: 'Back.easeIn'
      });
      this.tweens.add({
        targets: [glowOuter, glowMid, glowInner],
        alpha: { from: [0.3, 0.5, 0.7], to: [0.15, 0.25, 0.35] },
        duration: 150
      });
    });

    // 按钮呼吸动画
    this.tweens.add({
      targets: [glowInner, glowMid, glowOuter],
      scaleX: 1.15,
      scaleY: 1.15,
      alpha: '+=0.2',
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // 文字轻微脉冲
    this.tweens.add({
      targets: btnText,
      scaleX: 1.03,
      scaleY: 1.03,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  private createSettingsButton(x: number, y: number): void {
    const container = this.add.container(x, y);
    const radius = this.scaleUi(26);

    // 按钮背景
    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 0.6);
    bg.fillCircle(0, 0, radius);
    bg.lineStyle(this.scaleUi(2), 0xffd700, 0.6);
    bg.strokeCircle(0, 0, radius);
    container.add(bg);

    // 齿轮图标
    const icon = this.add.text(0, 0, '⚙️', {
      fontSize: this.font(28)
    }).setOrigin(0.5);
    container.add(icon);

    // 交互区域
    const hitArea = this.add.circle(0, 0, radius, 0x000000, 0);
    hitArea.setInteractive({ useHandCursor: true });
    container.add(hitArea);

    // 交互效果
    hitArea.on('pointerover', () => {
      this.tweens.add({
        targets: container,
        scale: 1.1,
        duration: 150,
        ease: 'Back.easeOut'
      });
      this.tweens.add({
        targets: icon,
        angle: 30,
        duration: 300
      });
    });

    hitArea.on('pointerout', () => {
      this.tweens.add({
        targets: container,
        scale: 1,
        duration: 150,
        ease: 'Back.easeIn'
      });
      this.tweens.add({
        targets: icon,
        angle: 0,
        duration: 300
      });
    });

    hitArea.on('pointerdown', () => {
      this.tweens.add({
        targets: container,
        scale: 0.9,
        duration: 80,
        yoyo: true,
        onComplete: () => {
          this.showClearDataConfirm();
        }
      });
    });
  }

  private showClearDataConfirm(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const popupWidth = this.scaleUi(400);
    const popupHeight = this.scaleUi(300);

    // 遮罩层
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);
    overlay.setInteractive();

    const popup = this.add.container(width / 2, height / 2);

    // 弹窗背景
    const popupBg = this.add.graphics();
    popupBg.fillGradientStyle(0xffffff, 0xffffff, 0xf5f5f5, 0xf5f5f5, 0.98, 0.98, 0.95, 0.95);
    popupBg.fillRoundedRect(-popupWidth / 2, -popupHeight / 2, popupWidth, popupHeight, this.scaleUi(20));
    popupBg.lineStyle(this.scaleUi(3), 0xff4444, 0.8);
    popupBg.strokeRoundedRect(-popupWidth / 2, -popupHeight / 2, popupWidth, popupHeight, this.scaleUi(20));
    popup.add(popupBg);

    // 警告图标
    const warningIcon = this.add.text(0, -this.scaleUi(90), '⚠️', {
      fontSize: this.font(48)
    }).setOrigin(0.5);
    popup.add(warningIcon);

    // 标题
    const title = this.add.text(0, -this.scaleUi(30), '清除历史数据', {
      fontSize: this.font(28),
      color: '#ff4444',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    popup.add(title);

    // 说明文字
    const desc = this.add.text(0, this.scaleUi(20), '此操作将清除所有游戏进度\n包括金币、宠物、建筑等数据\n\n确定要清除吗？', {
      fontSize: this.font(18),
      color: '#666666',
      align: 'center',
      lineSpacing: this.scaleUi(8)
    }).setOrigin(0.5);
    popup.add(desc);

    // 确认按钮
    const confirmBtn = this.add.container(this.scaleUi(70), this.scaleUi(110));
    const confirmBg = this.add.graphics();
    confirmBg.fillGradientStyle(0xff5555, 0xff5555, 0xdd3333, 0xdd3333, 1, 1, 0.95, 0.95);
    confirmBg.fillRoundedRect(-this.scaleUi(60), -this.scaleUi(20), this.scaleUi(120), this.scaleUi(40), this.scaleUi(20));
    confirmBg.lineStyle(this.scaleUi(2), 0xffffff, 0.5);
    confirmBg.strokeRoundedRect(-this.scaleUi(60), -this.scaleUi(20), this.scaleUi(120), this.scaleUi(40), this.scaleUi(20));
    const confirmText = this.add.text(0, 0, '确认清除', {
      fontSize: this.font(18),
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    const confirmHit = this.add.rectangle(0, 0, this.scaleUi(120), this.scaleUi(40), 0x000000, 0);
    confirmHit.setInteractive({ useHandCursor: true });
    confirmBtn.add([confirmBg, confirmText, confirmHit]);
    popup.add(confirmBtn);

    // 取消按钮
    const cancelBtn = this.add.container(-this.scaleUi(70), this.scaleUi(110));
    const cancelBg = this.add.graphics();
    cancelBg.fillGradientStyle(0x888888, 0x888888, 0x666666, 0x666666, 1, 1, 0.95, 0.95);
    cancelBg.fillRoundedRect(-this.scaleUi(60), -this.scaleUi(20), this.scaleUi(120), this.scaleUi(40), this.scaleUi(20));
    cancelBg.lineStyle(this.scaleUi(2), 0xffffff, 0.5);
    cancelBg.strokeRoundedRect(-this.scaleUi(60), -this.scaleUi(20), this.scaleUi(120), this.scaleUi(40), this.scaleUi(20));
    const cancelText = this.add.text(0, 0, '取消', {
      fontSize: this.font(18),
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    const cancelHit = this.add.rectangle(0, 0, this.scaleUi(120), this.scaleUi(40), 0x000000, 0);
    cancelHit.setInteractive({ useHandCursor: true });
    cancelBtn.add([cancelBg, cancelText, cancelHit]);
    popup.add(cancelBtn);

    // 确认按钮交互
    confirmHit.on('pointerover', () => {
      this.tweens.add({ targets: confirmBtn, scale: 1.05, duration: 100 });
    });
    confirmHit.on('pointerout', () => {
      this.tweens.add({ targets: confirmBtn, scale: 1, duration: 100 });
    });
    confirmHit.on('pointerdown', () => {
      this.tweens.add({
        targets: confirmBtn,
        scale: 0.95,
        duration: 50,
        yoyo: true,
        onComplete: () => {
          // 清除数据
          this.gameManager.resetGame();
          overlay.destroy();
          popup.destroy();
          // 重新加载场景
          this.scene.restart();
        }
      });
    });

    // 取消按钮交互
    cancelHit.on('pointerover', () => {
      this.tweens.add({ targets: cancelBtn, scale: 1.05, duration: 100 });
    });
    cancelHit.on('pointerout', () => {
      this.tweens.add({ targets: cancelBtn, scale: 1, duration: 100 });
    });
    cancelHit.on('pointerdown', () => {
      this.tweens.add({
        targets: cancelBtn,
        scale: 0.95,
        duration: 50,
        yoyo: true,
        onComplete: () => {
          overlay.destroy();
          popup.destroy();
        }
      });
    });

    // 点击遮罩关闭
    overlay.on('pointerdown', () => {
      overlay.destroy();
      popup.destroy();
    });
  }
}
