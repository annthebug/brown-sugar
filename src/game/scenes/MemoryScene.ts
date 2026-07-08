import Phaser from 'phaser';

interface MemorySceneData {
  caption: string;
  date: string;
}

/**
 * 回憶解鎖動畫（見 docs/06_GameMechanics.md）：
 * Pixel（碎片聚合）→ Fade → 照片（佔位）→ 一句文字 → Continue。
 * 尚無真實照片，以佔位框呈現；照片由擁有者後續放入 Firebase Storage。
 */
export class MemoryScene extends Phaser.Scene {
  private caption = '';
  private date = '';

  constructor() {
    super('Memory');
  }

  init(data: MemorySceneData): void {
    this.caption = data.caption;
    this.date = data.date;
  }

  create(): void {
    const { width, height } = this.scale;

    const veil = this.add.rectangle(0, 0, width, height, 0x120b07, 0).setOrigin(0, 0);
    this.tweens.add({ targets: veil, fillAlpha: 0.92, duration: 500 });

    const shards = this.add.particles(width / 2, height / 2, 'shard', {
      speed: { min: 30, max: 90 },
      lifespan: 700,
      quantity: 2,
      frequency: 40,
      scale: { start: 0.8, end: 0 },
      emitting: true,
    });

    const status = this.add
      .text(width / 2, height / 2, '回憶碎片，正重新拼合…', {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#8fd6ea',
      })
      .setOrigin(0.5)
      .setAlpha(0);
    this.tweens.add({ targets: status, alpha: 1, duration: 500 });

    // 拼合完成 → 顯示照片與文字
    this.time.delayedCall(1600, () => {
      shards.emitting = false;
      status.destroy();
      this.revealPhoto();
    });
  }

  private revealPhoto(): void {
    const { width, height } = this.scale;

    const frameW = 320;
    const frameH = 200;
    const frame = this.add
      .rectangle(width / 2, height / 2 - 20, frameW, frameH, 0xf7ecd9, 1)
      .setAlpha(0);
    frame.setStrokeStyle(4, 0xf6b352);

    const placeholder = this.add
      .text(width / 2, height / 2 - 40, '📷 照片（待放入）', {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#7a5433',
      })
      .setOrigin(0.5)
      .setAlpha(0);

    const dateText = this.add
      .text(width / 2, height / 2 + 24, this.date, {
        fontFamily: 'monospace',
        fontSize: '13px',
        color: '#9c6b3f',
      })
      .setOrigin(0.5)
      .setAlpha(0);

    const caption = this.add
      .text(width / 2, height / 2 + 108, this.caption, {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#f7ecd9',
      })
      .setOrigin(0.5)
      .setAlpha(0);

    const cont = this.add
      .text(width / 2, height - 48, '▶ 按 Space / 點擊繼續', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#d8c3a5',
      })
      .setOrigin(0.5)
      .setAlpha(0);

    this.tweens.add({
      targets: [frame, placeholder, dateText],
      alpha: 1,
      duration: 700,
    });
    this.tweens.add({ targets: caption, alpha: 1, delay: 500, duration: 700 });
    this.tweens.add({
      targets: cont,
      alpha: 1,
      delay: 1000,
      duration: 500,
      onComplete: () => this.armContinue(),
    });
  }

  private armContinue(): void {
    const finish = () => {
      this.scene.stop();
      const forest = this.scene.get('Forest');
      forest.scene.resume();
      forest.events.emit('memory-closed');
    };
    this.input.once('pointerdown', finish);
    this.input.keyboard?.once('keydown-SPACE', finish);
    this.input.keyboard?.once('keydown-ENTER', finish);
  }
}
