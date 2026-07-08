import Phaser from 'phaser';

/**
 * 主角黑糖（見 docs/05_Characters.md、docs/06_GameMechanics.md）。
 * 能力：Jump、Double Jump、Dash、Meow、Collect、Talk（Collect/Talk 由場景偵測觸發）。
 */

const MOVE_SPEED = 200;
const JUMP_VELOCITY = -470;
const DASH_SPEED = 470;
const DASH_DURATION = 170; // ms
const DASH_COOLDOWN = 520; // ms
const MAX_JUMPS = 2;

export class Player extends Phaser.Physics.Arcade.Sprite {
  public controlsEnabled = true;

  private jumpsLeft = MAX_JUMPS;
  private isDashing = false;
  private dashTimer = 0;
  private dashCooldownTimer = 0;
  private facing: 1 | -1 = 1;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(16, 20).setOffset(4, 4);
    body.setCollideWorldBounds(true);
    this.setDepth(5);
  }

  get arcadeBody(): Phaser.Physics.Arcade.Body {
    return this.body as Phaser.Physics.Arcade.Body;
  }

  moveLeft(): void {
    if (!this.controlsEnabled || this.isDashing) return;
    this.arcadeBody.setVelocityX(-MOVE_SPEED);
    this.facing = -1;
    this.setFlipX(true);
  }

  moveRight(): void {
    if (!this.controlsEnabled || this.isDashing) return;
    this.arcadeBody.setVelocityX(MOVE_SPEED);
    this.facing = 1;
    this.setFlipX(false);
  }

  stopHorizontal(): void {
    if (!this.isDashing) this.arcadeBody.setVelocityX(0);
  }

  jump(): boolean {
    if (!this.controlsEnabled) return false;
    if (this.jumpsLeft > 0) {
      this.arcadeBody.setVelocityY(JUMP_VELOCITY);
      this.jumpsLeft -= 1;
      this.squash();
      return true;
    }
    return false;
  }

  dash(): void {
    if (!this.controlsEnabled || this.isDashing || this.dashCooldownTimer > 0) return;
    this.isDashing = true;
    this.dashTimer = DASH_DURATION;
    this.dashCooldownTimer = DASH_COOLDOWN;
    this.arcadeBody.setVelocityX(DASH_SPEED * this.facing);
    this.setTint(0xfff2cc);
  }

  /** 貓叫：顯示「喵~」氣泡（互動由場景處理）。 */
  meow(): void {
    const bubble = this.scene.add
      .text(this.x, this.y - 24, '喵~', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#f6b352',
      })
      .setOrigin(0.5)
      .setDepth(20);
    this.scene.tweens.add({
      targets: bubble,
      y: bubble.y - 18,
      alpha: 0,
      duration: 700,
      onComplete: () => bubble.destroy(),
    });
  }

  private squash(): void {
    this.setScale(1.15, 0.85);
    this.scene.tweens.add({
      targets: this,
      scaleX: 1,
      scaleY: 1,
      duration: 140,
      ease: 'Quad.out',
    });
  }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);

    const onFloor = this.arcadeBody.blocked.down || this.arcadeBody.onFloor();
    if (onFloor && !this.isDashing) this.jumpsLeft = MAX_JUMPS;

    if (this.dashCooldownTimer > 0) this.dashCooldownTimer -= delta;

    if (this.isDashing) {
      this.dashTimer -= delta;
      if (this.dashTimer <= 0) {
        this.isDashing = false;
        this.clearTint();
        this.arcadeBody.setVelocityX(0);
      }
    }
  }
}
