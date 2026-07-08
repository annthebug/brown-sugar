import Phaser from 'phaser';

/**
 * 第一章 Boss：巨大罐罐（見 docs/05_Characters.md）。
 * 非暴力設計：玩家從上方踩三次即可讓它「打開」，釋放回憶碎片。
 */

const MAX_HP = 3;
const HIT_INVULN = 600; // ms

export class GiantCanBoss extends Phaser.Physics.Arcade.Sprite {
  public active = false;
  private hp = MAX_HP;
  private invulnTimer = 0;
  private defeated = false;
  private hopTimer = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'boss-can');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    body.setSize(60, 78).setOffset(8, 14);
    this.setDepth(4);
  }

  get remainingHp(): number {
    return this.hp;
  }

  isDefeated(): boolean {
    return this.defeated;
  }

  canBeHit(): boolean {
    return this.active && !this.defeated && this.invulnTimer <= 0;
  }

  activate(): void {
    this.active = true;
  }

  /** 被踩一次；回傳是否因此被擊敗。 */
  hit(): boolean {
    if (!this.canBeHit()) return false;
    this.hp -= 1;
    this.invulnTimer = HIT_INVULN;

    this.scene.tweens.add({
      targets: this,
      alpha: 0.4,
      yoyo: true,
      repeat: 2,
      duration: 90,
    });

    if (this.hp <= 0) {
      this.defeated = true;
      this.active = false;
      return true;
    }
    return false;
  }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    if (this.invulnTimer > 0) this.invulnTimer -= delta;
    if (!this.active || this.defeated) return;

    const body = this.body as Phaser.Physics.Arcade.Body;
    this.hopTimer -= delta;
    if (this.hopTimer <= 0 && (body.blocked.down || body.onFloor())) {
      body.setVelocityY(-220);
      this.hopTimer = 1400;
    }
  }
}
