# 🐱🐕 喵汪大作战 (Pet Whack-a-Mole)

一款可爱的打地鼠风格休闲游戏，使用 Phaser 3 + TypeScript + Vite 构建。

![Game Preview](public/images/bg_home.png)

## ✨ 游戏特性

- 🎮 **经典打地鼠玩法** - 点击冒出的怪物来消灭它们
- 🐾 **宠物系统** - 可爱的猫咪和狗狗作为你的助手
- 🏠 **建筑系统** - 升级建筑获得各种加成
- ⚔️ **多关卡挑战** - 4个区域，每区5个关卡
- 👹 **多种敌人类型** - 普通怪、精英怪和 BOSS
- 🎯 **技能选择** - 每波结束后选择强化技能
- 💫 **连击系统** - 连续击杀获得更高分数

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 🎯 游戏玩法

1. 从主界面选择关卡进入战斗
2. 点击从洞穴冒出的怪物来消灭它们
3. 每波结束后选择一个技能强化
4. 击败所有波次和 BOSS 即可通关
5. 获得金币和碎片用于升级建筑和宠物

## 🛠️ 技术栈

- [Phaser 3](https://phaser.io/) - 游戏框架
- [TypeScript](https://www.typescriptlang.org/) - 类型安全
- [Vite](https://vitejs.dev/) - 构建工具

## 📁 项目结构

```
src/
├── scenes/          # 游戏场景
│   ├── BootScene.ts     # 启动加载
│   ├── MenuScene.ts     # 菜单
│   ├── HomeScene.ts     # 主界面
│   ├── BattleScene.ts   # 战斗场景
│   └── ResultScene.ts   # 结算界面
├── objects/         # 游戏对象
├── systems/         # 游戏系统
├── managers/        # 管理器
├── ui/              # UI组件
├── data/            # 配置数据
└── types/           # TypeScript类型
```

## 📜 License

MIT License
