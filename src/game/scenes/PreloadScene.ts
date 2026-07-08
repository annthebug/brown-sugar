import Phaser from 'phaser';
import { generateTextures } from '@/game/textures';

/**
 * 預載場景：顯示載入畫面並準備資源。
 * 目前以程式化紋理取代美術資源（見 src/game/textures.ts）。
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

    this.load.on('progress', (value: number) => {
      label.setText(`Loading… ${Math.round(value * 100)}%`);
    });
  }

  create(): void {
    generateTextures(this);
    this.scene.start('MainMenu');
  }
}
