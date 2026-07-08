import Phaser from 'phaser';

/**
 * 森林小怪（毛線球 / 紙箱 / 小魚乾）。
 * 依 docs（不暴力）設計為溫和生物：被踩到會化為碎片消失，側面接觸僅輕推玩家，不造成傷害。
 */

export type CritterKind = 'yarn' | 'box' | 'fish';

const TEXTURE: Record<CritterKind, string> = {
  yarn: 'critter-yarn',
  box: 'critter-box',
  fish: 'critter-fish',
};

export class Critter extends Phaser.Physics.Arcade.Sprite {
  public readonly shardValue = 5;
  private patrolMinX: number;
  private patrolMaxX: number;
  private speed: number;
  private defeated = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    kind: CritterKind,
    patrolRange = 60,
  ) {
    super(scene, x, y, TEXTURE[kind]);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.patrolMinX = x - patrolRange;
    this.patrolMaxX = x + patrolRange;
    this.speed = kind === 'fish' ? 55 : 40;

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    body.setVelocityX(this.speed);
    this.setDepth(4);
  }

  isDefeated(): boolean {
    return this.defeated;
  }

  /** 被踩到：化為碎片並消失。回傳是否成功（避免重複觸發）。 */
  defeat(): boolean {
    if (this.defeated) return false;
    this.defeated = true;

    const burst = this.scene.add.particles(this.x, this.y, 'spark', {
      speed: { min: 40, max: 120 },
      lifespan: 400,
      quantity: 8,
      scale: { start: 1, end: 0 },
    });
    this.scene.time.delayedCall(420, () => burst.destroy());

    this.destroy();
    return true;
  }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    if (this.defeated) return;

    const body = this.body as Phaser.Physics.Arcade.Body;
    if (this.x <= this.patrolMinX && body.velocity.x < 0) {
      body.setVelocityX(this.speed);
      this.setFlipX(true);
    } else if (this.x >= this.patrolMaxX && body.velocity.x > 0) {
      body.setVelocityX(-this.speed);
      this.setFlipX(false);
    }
  }
}
