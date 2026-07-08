import Phaser from 'phaser';

/**
 * 以程式化方式產生 Pixel 風格紋理（暖色系）。
 * 專案尚無美術資源，先用生成紋理讓第一章可實際遊玩；日後由 Task 004/009 換成正式 sprite。
 */
export function generateTextures(scene: Phaser.Scene): void {
  const make = (key: string, w: number, h: number, draw: (g: Phaser.GameObjects.Graphics) => void) => {
    if (scene.textures.exists(key)) return;
    const g = scene.add.graphics();
    draw(g);
    g.generateTexture(key, w, h);
    g.destroy();
  };

  // 黑糖（貓）
  make('player', 24, 24, (g) => {
    g.fillStyle(0x6b4a2f);
    g.fillTriangle(4, 8, 10, 8, 5, 1);
    g.fillTriangle(20, 8, 14, 8, 19, 1);
    g.fillRoundedRect(3, 6, 18, 16, 5);
    g.fillStyle(0xcaa06e);
    g.fillRoundedRect(6, 11, 12, 9, 3);
    g.fillStyle(0x2b1d14);
    g.fillRect(9, 13, 2, 2);
    g.fillRect(15, 13, 2, 2);
    g.fillStyle(0xe08a8a);
    g.fillRect(12, 16, 2, 2);
  });

  // 地面 / 平台磚
  make('ground', 32, 32, (g) => {
    g.fillStyle(0x7a5433);
    g.fillRect(0, 0, 32, 32);
    g.fillStyle(0x6a9e3f);
    g.fillRect(0, 0, 32, 8);
    g.fillStyle(0x5c8a35);
    g.fillRect(0, 8, 32, 3);
    g.fillStyle(0x6b4a2c);
    g.fillRect(4, 16, 4, 4);
    g.fillRect(20, 22, 4, 4);
    g.fillRect(13, 12, 3, 3);
  });

  // 回憶碎片
  make('shard', 16, 16, (g) => {
    g.fillStyle(0x8fd6ea);
    g.fillPoints(
      [
        { x: 8, y: 0 },
        { x: 16, y: 8 },
        { x: 8, y: 16 },
        { x: 0, y: 8 },
      ],
      true,
    );
    g.fillStyle(0xdff4fb);
    g.fillPoints(
      [
        { x: 8, y: 3 },
        { x: 12, y: 8 },
        { x: 8, y: 13 },
        { x: 4, y: 8 },
      ],
      true,
    );
  });

  // 森林老人 NPC
  make('npc-elder', 26, 36, (g) => {
    g.fillStyle(0x4f6f3c);
    g.fillRoundedRect(4, 12, 18, 22, 5);
    g.fillStyle(0xe0c39a);
    g.fillCircle(13, 8, 6);
    g.fillStyle(0xf0efe4);
    g.fillRect(8, 11, 10, 8);
    g.fillStyle(0x8a5a32);
    g.fillRect(22, 2, 2, 32);
  });

  // 怪物：毛線球
  make('critter-yarn', 20, 20, (g) => {
    g.fillStyle(0xe79bb0);
    g.fillCircle(10, 10, 9);
    g.lineStyle(1, 0xc9748d);
    g.strokeCircle(10, 10, 6);
    g.strokeCircle(10, 10, 3);
  });

  // 怪物：紙箱
  make('critter-box', 22, 22, (g) => {
    g.fillStyle(0xb07b46);
    g.fillRect(1, 3, 20, 18);
    g.fillStyle(0x8a5f34);
    g.fillRect(1, 3, 20, 4);
    g.lineStyle(1, 0x6f4a26);
    g.strokeRect(1, 3, 20, 18);
    g.lineBetween(11, 7, 11, 21);
  });

  // 怪物：小魚乾
  make('critter-fish', 24, 14, (g) => {
    g.fillStyle(0xe0913f);
    g.fillEllipse(9, 7, 16, 10);
    g.fillTriangle(17, 7, 23, 2, 23, 12);
    g.fillStyle(0x2b1d14);
    g.fillCircle(6, 6, 1.5);
  });

  // Boss：巨大罐罐
  make('boss-can', 76, 96, (g) => {
    g.fillStyle(0xb8bcc8);
    g.fillRoundedRect(6, 12, 64, 78, 8);
    g.fillStyle(0xd6dae4);
    g.fillEllipse(38, 14, 64, 16);
    g.fillStyle(0xe8952f);
    g.fillRect(6, 40, 64, 24);
    g.fillStyle(0xf6b352);
    g.fillRect(6, 46, 64, 4);
    g.fillStyle(0x2b1d14);
    g.fillCircle(26, 30, 3);
    g.fillCircle(50, 30, 3);
  });

  // 背景樹（視差裝飾）
  make('tree', 64, 128, (g) => {
    g.fillStyle(0x5a3d24);
    g.fillRect(28, 70, 10, 58);
    g.fillStyle(0x3f6a2e);
    g.fillCircle(32, 44, 26);
    g.fillStyle(0x4f8038);
    g.fillCircle(20, 54, 18);
    g.fillCircle(46, 52, 18);
  });

  // 通用粒子
  make('spark', 8, 8, (g) => {
    g.fillStyle(0xf6e2b0);
    g.fillCircle(4, 4, 4);
  });
}
