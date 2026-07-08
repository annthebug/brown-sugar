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

    this.add
      .text(width / 2, height / 2 + 60, '（Phaser 場景骨架就緒，尚未實作玩法）', {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#8fbf5a',
      })
      .setOrigin(0.5);

    // 通知 React 層場景已就緒（示範 EventBus 溝通）。
    EventBus.emit(GameEvents.SceneReady, 'MainMenu');
  }
}
