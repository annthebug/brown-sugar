import Phaser from 'phaser';

/**
 * 啟動場景：進行最小初始化，隨後切換至預載場景。
 * 尚未載入任何遊戲資源（見 Task 004）。
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create(): void {
    this.scene.start('Preload');
  }
}
