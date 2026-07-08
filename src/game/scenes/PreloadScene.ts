import Phaser from 'phaser';

/**
 * 預載場景：顯示載入畫面並預載資源。
 * 目前無實際資源可載入，直接進入主選單（資源預載於 Task 004 實作）。
 */
export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('Preload');
  }

  preload(): void {
    const { width, height } = this.scale;
    const label = this.add
      .text(width / 2, height / 2, 'Loading…', {
        fontFamily: 'monospace',
        fontSize: '20px',
        color: '#f7ecd9',
      })
      .setOrigin(0.5);

    // 顯示載入進度（目前無資源，會立即完成）。
    this.load.on('progress', (value: number) => {
      label.setText(`Loading… ${Math.round(value * 100)}%`);
    });
  }

  create(): void {
    this.scene.start('MainMenu');
  }
}
