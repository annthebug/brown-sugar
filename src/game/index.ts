import Phaser from 'phaser';
import { createGameConfig } from '@/game/config';

/** 於指定 DOM 節點建立 Phaser 遊戲實例。 */
export function createGame(parent: HTMLElement): Phaser.Game {
  return new Phaser.Game(createGameConfig(parent));
}

export { EventBus, GameEvents } from '@/game/EventBus';
