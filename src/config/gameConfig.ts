import Phaser from 'phaser';
import { BootScene } from '../scenes/BootScene';
import { MenuScene } from '../scenes/MenuScene';
import { HomeScene } from '../scenes/HomeScene';
import { BattleScene } from '../scenes/BattleScene';
import { ResultScene } from '../scenes/ResultScene';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 720,
  height: 1280,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 720,
    height: 1280,
  },
  backgroundColor: '#2d2d44',
  scene: [BootScene, MenuScene, HomeScene, BattleScene, ResultScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  input: {
    activePointers: 3,
  },
};
