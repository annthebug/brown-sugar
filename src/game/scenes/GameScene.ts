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
    ;(ground.body as Phaser.Physics.Arcade.StaticBody).updateFromGameObject()

    // Decorative overlay on top of ground
    this.add.rectangle(width / 2, height - 22, width, 44, MORANDI_PALETTE.warmBeige, 0.8)

    const title = this.add
      .text(width / 2, height * 0.42, '黑糖的旅程從這裡開始', {
        color: MORANDI_PALETTE.slateText,
        fontFamily: 'monospace',
        fontSize: '28px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)

    this.add
      .text(width / 2, title.y + 42, 'Phaser 遊戲場景・淡藍天空', {
        color: MORANDI_PALETTE.mutedText,
        fontFamily: 'monospace',
        fontSize: '16px',
      })
      .setOrigin(0.5)

    this.addMemoryShard(width * 0.72, height - 152)

    // ── Player ──────────────────────────────────────────────────────────
    const spawnY = groundY - GROUND_HEIGHT / 2
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
          '← → 移動　Space / ↑ 跳躍　Shift 衝刺　M 喵叫　E 對話',
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
      message: '遊戲場景已就緒，黑糖可以出發了。',
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

  private addMemoryShard(x: number, y: number) {
    let collected = false
    const shard = this.add.container(x, y)
    const glow = this.add.circle(0, 0, 34, MORANDI_PALETTE.warmBeige, 0.34)
    const diamond = this.add
      .polygon(0, 0, [0, -30, 22, 0, 0, 30, -22, 0], MORANDI_PALETTE.dustyBlue, 0.92)
      .setStrokeStyle(3, MORANDI_PALETTE.cloud, 0.78)
    const label = this.add
      .text(0, 48, '回憶碎片', {
        color: MORANDI_PALETTE.slateText,
        fontFamily: 'monospace',
        fontSize: '13px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)

    shard.add([glow, diamond, label])
    shard.setSize(88, 108)
    shard.setInteractive({ useHandCursor: true })
    const glowTween = this.tweens.add({
      targets: glow,
      alpha: 0.58,
      duration: 950,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })

    shard.on('pointerdown', () => {
      if (collected) {
        return
      }

      collected = true
      shard.disableInteractive()
      glowTween.stop()

      gameEventBus.emit('memory-shard-collected', {
        scene: this.scene.key,
        amount: 1,
      })

      this.tweens.add({
        targets: shard,
        y: y - 8,
        duration: 120,
        yoyo: true,
        ease: 'Sine.easeInOut',
        onComplete: () => {
          shard.setAlpha(0.46)
          label.setText('已收集')
        },
      })
    })
  }
}
