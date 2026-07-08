import Phaser from 'phaser'
import { ASSET_KEYS, BLACK_SUGAR_FRAMES } from '../assets/assetManifest'
import { gameEventBus } from '../events/eventBus'
import type { InputSnapshot } from '../input/InputController'

export type PlayerState =
  | 'idle'
  | 'walk'
  | 'jump'
  | 'doubleJump'
  | 'dash'
  | 'meow'
  | 'collect'
  | 'talk'

// ─── Tuning constants ──────────────────────────────────────────────────────
const WALK_SPEED = 210
const JUMP_VEL = -560
const DOUBLE_JUMP_VEL = -490
const DASH_VEL = 500
const DASH_DURATION_MS = 170
const DASH_COOLDOWN_MS = 900
const MEOW_LOCK_MS = 600
const COLLECT_LOCK_MS = 500
const PLAYER_SCALE = 0.44

/**
 * Registers all Black Sugar animations on the scene's animation manager.
 * Guard prevents duplicate registration when the scene restarts.
 */
function registerAnimations(anims: Phaser.Animations.AnimationManager) {
  const key = ASSET_KEYS.blackSugar

  const add = (id: string, frames: string[], rate: number, repeat = -1) => {
    if (anims.exists(id)) return
    anims.create({
      key: id,
      frames: frames.map((f) => ({ key, frame: f })),
      frameRate: rate,
      repeat,
    })
  }

  // Idle (front) — occasional blink to feel alive
  add(
    'bs-idle',
    [
      BLACK_SUGAR_FRAMES.frontIdle,
      BLACK_SUGAR_FRAMES.frontIdle,
      BLACK_SUGAR_FRAMES.frontIdle,
      BLACK_SUGAR_FRAMES.frontBlink,
    ],
    3,
  )
  // Idle (side) used while standing after walking
  add('bs-side-idle', [BLACK_SUGAR_FRAMES.sideIdle], 1)
  // Walk cycle
  add('bs-walk', [BLACK_SUGAR_FRAMES.sideWalk1, BLACK_SUGAR_FRAMES.sideWalk2], 8)
  // Jump / double-jump share one frame; played once
  add('bs-jump', [BLACK_SUGAR_FRAMES.jump], 1, 0)
  // Dash holds a single frame
  add('bs-dash', [BLACK_SUGAR_FRAMES.dash], 1, 0)
  // Meow — one expression frame
  add('bs-meow', [BLACK_SUGAR_FRAMES.meow], 1, 0)
  // Collect — sparkle expression
  add('bs-collect', [BLACK_SUGAR_FRAMES.collectItem], 1, 0)
  // Happy / sad emotes (triggered externally)
  add('bs-happy', [BLACK_SUGAR_FRAMES.happySparkle], 2, 0)
  add('bs-sad', [BLACK_SUGAR_FRAMES.sadPleading], 2, 0)
}

// ─── Player ────────────────────────────────────────────────────────────────

export class Player extends Phaser.Physics.Arcade.Sprite {
  private _state: PlayerState = 'idle'
  private facingRight = true
  private wasOnGround = true

  // Ability flags
  private canDoubleJump = false
  private isDashing = false
  private dashCooldown = 0

  // Timed lock-outs (ms remaining)
  private meowLock = 0
  private collectLock = 0

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, ASSET_KEYS.blackSugar, BLACK_SUGAR_FRAMES.sideIdle)

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setOrigin(0.5, 1)
      .setScale(PLAYER_SCALE)

    // Use the sprite's natural frame bounds as the physics body.
    // Custom hitbox will be tuned once real art dimensions are confirmed.
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setMaxVelocityY(1200)

    registerAnimations(scene.anims)
    this.play('bs-side-idle')
  }

  // ── Main update called each frame from GameScene ──────────────────────

  update(input: InputSnapshot, delta: number) {
    const body = this.body as Phaser.Physics.Arcade.Body
    const onGround = body.blocked.down

    // Tick cooldowns
    if (this.dashCooldown > 0) this.dashCooldown -= delta
    if (this.meowLock > 0) this.meowLock -= delta
    if (this.collectLock > 0) this.collectLock -= delta

    // Landing: reset aerial state
    if (onGround && !this.wasOnGround) {
      this.isDashing = false
      body.setAllowGravity(true)
      if (this._state === 'jump' || this._state === 'doubleJump' || this._state === 'dash') {
        this._state = 'idle'
      }
    }
    this.wasOnGround = onGround

    // Dash — owns the frame entirely while active
    if (this.isDashing) {
      this.syncAnim(onGround, 0)
      return
    }

    // Meow lock
    if (this.meowLock > 0) {
      body.setVelocityX(0)
      return
    }

    // Collect lock
    if (this.collectLock > 0) {
      body.setVelocityX(0)
      return
    }

    // ── Horizontal movement ──────────────────────────────────────────────

    let velX = 0
    if (input.left) {
      velX = -WALK_SPEED
      this.facingRight = false
      this.setFlipX(true)
    } else if (input.right) {
      velX = WALK_SPEED
      this.facingRight = true
      this.setFlipX(false)
    }
    body.setVelocityX(velX)

    // ── Jump / Double-Jump ───────────────────────────────────────────────

    if (input.jumpJustDown) {
      if (onGround) {
        body.setVelocityY(JUMP_VEL)
        this.canDoubleJump = true
        this._state = 'jump'
      } else if (this.canDoubleJump) {
        body.setVelocityY(DOUBLE_JUMP_VEL)
        this.canDoubleJump = false
        this._state = 'doubleJump'
        gameEventBus.emit('player:double-jump', { x: this.x, y: this.y })
      }
    }

    // ── Dash ─────────────────────────────────────────────────────────────

    if (input.dashJustDown && this.dashCooldown <= 0) {
      this.performDash()
    }

    // ── Meow ─────────────────────────────────────────────────────────────

    if (input.meowJustDown && this._state !== 'meow') {
      this.performMeow()
    }

    // ── Talk ─────────────────────────────────────────────────────────────

    if (input.talkJustDown && onGround) {
      this.triggerTalk()
    }

    // ── Animation sync ───────────────────────────────────────────────────

    this.syncAnim(onGround, velX)
  }

  // ── Public action triggers (callable by the scene) ───────────────────

  triggerCollect() {
    if (this._state === 'collect') return
    this._state = 'collect'
    this.collectLock = COLLECT_LOCK_MS
    this.play('bs-collect', true)
    gameEventBus.emit('player:collect', { x: this.x, y: this.y })
    this.scene.time.delayedCall(COLLECT_LOCK_MS, () => {
      if (this._state === 'collect') this._state = 'idle'
    })
  }

  triggerTalk() {
    if (this._state === 'talk') return
    this._state = 'talk'
    this.play('bs-idle', true)
    gameEventBus.emit('player:talk-start', {})
  }

  endTalk() {
    if (this._state !== 'talk') return
    this._state = 'idle'
    gameEventBus.emit('player:talk-end', {})
  }

  playEmote(emote: 'happy' | 'sad') {
    this.play(emote === 'happy' ? 'bs-happy' : 'bs-sad', true)
  }

  get playerState(): PlayerState {
    return this._state
  }

  // ── Private helpers ──────────────────────────────────────────────────

  private performDash() {
    const body = this.body as Phaser.Physics.Arcade.Body
    const dir: 1 | -1 = this.facingRight ? 1 : -1

    this.isDashing = true
    this.dashCooldown = DASH_COOLDOWN_MS
    this._state = 'dash'
    this.play('bs-dash', true)

    body.setVelocityX(dir * DASH_VEL)
    body.setVelocityY(0)
    body.setAllowGravity(false)

    gameEventBus.emit('player:dash', { direction: dir })

    this.scene.time.delayedCall(DASH_DURATION_MS, () => {
      if (!this.active) return
      this.isDashing = false
      body.setAllowGravity(true)
      if (this._state === 'dash') this._state = 'idle'
    })
  }

  private performMeow() {
    const body = this.body as Phaser.Physics.Arcade.Body
    this._state = 'meow'
    this.meowLock = MEOW_LOCK_MS
    this.play('bs-meow', true)
    body.setVelocityX(0)
    gameEventBus.emit('player:meow', { x: this.x, y: this.y })
    this.scene.time.delayedCall(MEOW_LOCK_MS, () => {
      if (this._state === 'meow') this._state = 'idle'
    })
  }

  private syncAnim(onGround: boolean, velX: number) {
    // Locked states control their own animation
    if (this._state === 'dash') return
    if (this._state === 'meow') return
    if (this._state === 'collect') return
    if (this._state === 'talk') return

    if (!onGround) {
      // In the air — show jump frame regardless of horizontal vel
      if (this.anims.currentAnim?.key !== 'bs-jump') {
        this.play('bs-jump', true)
      }
      return
    }

    if (velX !== 0) {
      this._state = 'walk'
      this.play('bs-walk', true)
    } else {
      this._state = 'idle'
      // After walking use side-idle; after landing from air use front-idle
      const cur = this.anims.currentAnim?.key
      if (cur !== 'bs-idle' && cur !== 'bs-side-idle') {
        this.play('bs-idle', true)
      }
    }
  }
}
