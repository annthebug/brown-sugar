import Phaser from 'phaser';
import { BootScene } from '@/game/scenes/BootScene';
import { PreloadScene } from '@/game/scenes/PreloadScene';
import { MainMenuScene } from '@/game/scenes/MainMenuScene';

// 目標設計解析度（16:9）。實際顯示由 Scale.FIT 自適應。
export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 540;

/** 建立 Phaser 遊戲設定。掛載節點由呼叫端提供。 */
export function createGameConfig(parent: HTMLElement): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: '#2b1d14',
    pixelArt: true,
    roundPixels: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 900 },
        debug: false,
      },
    },
    scene: [BootScene, PreloadScene, MainMenuScene],
  };
}
