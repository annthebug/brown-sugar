import Phaser from 'phaser';

/**
 * NPC（森林老人）。承載隱藏式 MBTI 對話（見 docs/05_Characters.md、docs/07_MBTISystem.md）。
 * 本物件只負責呈現與「靠近提示」；對話流程由場景搭配 DialogueBox 觸發。
 */
export class Npc extends Phaser.Physics.Arcade.Sprite {
  public readonly npcName: string;
  private hint: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, name: string) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this, true); // 靜態
    this.npcName = name;
    this.setDepth(4);

    this.hint = scene.add
      .text(x, y - 30, '按 E 對話', {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#f7ecd9',
        backgroundColor: '#00000066',
        padding: { x: 4, y: 2 },
      })
      .setOrigin(0.5)
      .setDepth(20)
      .setVisible(false);
  }

  showHint(visible: boolean): void {
    this.hint.setVisible(visible);
  }

  destroy(fromScene?: boolean): void {
    this.hint.destroy();
    super.destroy(fromScene);
  }
}
