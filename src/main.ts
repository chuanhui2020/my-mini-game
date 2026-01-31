import Phaser from 'phaser';
import { gameConfig } from './config/gameConfig';

// 创建游戏实例
const game = new Phaser.Game(gameConfig);

// 导出游戏实例供调试使用
(window as any).game = game;
