import Phaser from 'phaser';
import { EventBus, GameEvents } from '@/game/EventBus';

/**
 * 主選單場景（佔位）：僅呈現標題與提示文字，確認 Phaser 層運作正常。
 * 尚未實作玩法（角色、關卡、Boss 皆於後續任務加入）。
 */
export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenu');
  }

  create(): void {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor('#2b1d14');

    this.add
      .text(width / 2, height / 2 - 40, 'Quest for the Perfect Bowl', {
        fontFamily: 'monospace',
        fontSize: '28px',
        color: '#f6b352',
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 + 10, '黑糖的冒險即將展開…', {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#d8c3a5',
      })
      .setOrigin(0.5);

    const start = this.add
      .text(width / 2, height / 2 + 70, '▶ 開始冒險（第一章：森林）', {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#2b1d14',
        backgroundColor: '#f6b352',
        padding: { x: 16, y: 8 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    start.on('pointerover', () => start.setScale(1.05));
    start.on('pointerout', () => start.setScale(1));
    start.on('pointerdown', () => this.scene.start('Forest'));

    // 通知 React 層場景已就緒（示範 EventBus 溝通）。
    EventBus.emit(GameEvents.SceneReady, 'MainMenu');
  }
}
