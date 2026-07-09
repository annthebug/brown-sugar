import Phaser from 'phaser'
import { BootScene } from './scenes/BootScene'
import { CityScene } from './scenes/CityScene'
import { ForestScene } from './scenes/ForestScene'
import { GameScene } from './scenes/GameScene'
import { PreloadScene } from './scenes/PreloadScene'

export const GAME_WIDTH = 960
export const GAME_HEIGHT = 540

export function createGameConfig(parent: HTMLElement): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: '#d8edf4',
    pixelArt: true,
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
    scene: [BootScene, PreloadScene, ForestScene, CityScene, GameScene],
  }
}
