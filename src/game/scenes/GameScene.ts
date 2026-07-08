import Phaser from 'phaser'
import { MORANDI_PALETTE } from '../assets/assetManifest'
import { gameEventBus } from '../events/eventBus'
import { Player } from '../entities/Player'
import { InputController } from '../input/InputController'
import { TouchControls } from '../input/TouchControls'

// Ground geometry — shared between visual and physics body
const GROUND_CENTER_Y_OFFSET = 56   // px from bottom to ground rect centre
const GROUND_HEIGHT = 112

export class GameScene extends Phaser.Scene {
  private player?: Player
  private inputCtrl?: InputController
  private touchCtrl?: TouchControls

  constructor() {
    super('GameScene')
  }

  create() {
    const { width, height } = this.scale

    // ── Background ──────────────────────────────────────────────────────
    this.cameras.main.setBackgroundColor(MORANDI_PALETTE.skyTop)
    this.add.image(width / 2, height / 2, 'scene-pale-blue-sky').setDisplaySize(width, height)
    this.add.rectangle(
      width / 2,
      height * 0.62,
      width,
      height * 0.76,
      MORANDI_PALETTE.skyBottom,
      0.28,
    )

    this.addCloud(width * 0.18, height * 0.2, 1)
    this.addCloud(width * 0.72, height * 0.24, 0.84)
    this.addCloud(width * 0.45, height * 0.34, 0.62)

    // ── Ground (visual + physics static body) ───────────────────────────
    const groundY = height - GROUND_CENTER_Y_OFFSET
    const ground = this.add.rectangle(width / 2, groundY, width, GROUND_HEIGHT, MORANDI_PALETTE.sageGreen)
    this.physics.add.existing(ground, true)   // true = static body
    ;(ground.body as Phaser.Physics.Arcade.StaticBody).refreshBody()

    // Decorative overlay on top of ground
    this.add.rectangle(width / 2, height - 22, width, 44, MORANDI_PALETTE.warmBeige, 0.8)

    // ── Player ──────────────────────────────────────────────────────────
    const spawnY = groundY - GROUND_HEIGHT / 2  // top surface of ground
    this.player = new Player(this, width / 2, spawnY)

    // Player collides with ground
    this.physics.add.collider(this.player, ground)

    // ── Input ───────────────────────────────────────────────────────────
    this.inputCtrl = new InputController(this)

    // Show touch controls only on touch-capable devices
    const isTouch = this.sys.game.device.input.touch
    this.touchCtrl = new TouchControls(this, this.inputCtrl)
    this.touchCtrl.setVisible(isTouch)

    // ── Debug hint (desktop) ────────────────────────────────────────────
    if (!isTouch) {
      this.add
        .text(
          width / 2,
          height * 0.08,
          '← → Move   Space / ↑ Jump   Shift Dash   M Meow   E Talk',
          {
            color: MORANDI_PALETTE.mutedText,
            fontFamily: 'monospace',
            fontSize: '13px',
          },
        )
        .setOrigin(0.5)
        .setAlpha(0.7)
    }

    gameEventBus.emit('phaser:ready', {
      scene: this.scene.key,
      message: 'GameScene ready — Player active.',
    })
  }

  update(_time: number, delta: number) {
    if (!this.player || !this.inputCtrl) return
    const snap = this.inputCtrl.snapshot()
    this.player.update(snap, delta)
  }

  shutdown() {
    this.inputCtrl?.destroy()
    this.touchCtrl?.destroy()
  }

  private addCloud(x: number, y: number, scale: number) {
    const cloud = this.add.container(x, y)
    const circles = [
      this.add.circle(-44 * scale, 8 * scale, 28 * scale, MORANDI_PALETTE.cloud, 0.82),
      this.add.circle(-12 * scale, -10 * scale, 38 * scale, MORANDI_PALETTE.cloud, 0.88),
      this.add.circle(30 * scale, 4 * scale, 30 * scale, MORANDI_PALETTE.cloud, 0.76),
      this.add.circle(60 * scale, 14 * scale, 20 * scale, MORANDI_PALETTE.cloud, 0.64),
    ]
    cloud.add(circles)
  }
}
