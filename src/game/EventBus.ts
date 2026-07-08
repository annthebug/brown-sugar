import Phaser from 'phaser';

/**
 * React 與 Phaser 之間的事件匯流排（見 docs/11_TechnicalArchitecture.md）。
 * 例：Phaser 解鎖回憶 → emit('memory:unlocked', id) → React 顯示回憶動畫。
 */
export const EventBus = new Phaser.Events.EventEmitter();

// 集中管理事件名稱，避免字串散落。
export const GameEvents = {
  SceneReady: 'scene:ready',
  MemoryUnlocked: 'memory:unlocked',
  ShardsChanged: 'shards:changed',
  ChapterChanged: 'chapter:changed',
  MbtiAnswered: 'mbti:answered',
} as const;

export type GameEvent = (typeof GameEvents)[keyof typeof GameEvents];
