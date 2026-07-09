import Phaser from 'phaser'
import { ASSET_KEYS, MORANDI_PALETTE } from '../assets/assetManifest'
import { gameEventBus } from '../events/eventBus'
import { MemoryShard } from '../entities/MemoryShard'
import { Player } from '../entities/Player'
import { InputController } from '../input/InputController'
import { TouchControls } from '../input/TouchControls'

const WORLD_WIDTH = 1920
const WORLD_HEIGHT = 540
const GROUND_Y = 484
const GROUND_HEIGHT = 112
const GROUND_TOP = GROUND_Y - GROUND_HEIGHT / 2

export class RetryScene extends Phaser.Scene {
  private player?: Player
  private inputCtrl?: InputController
  private touchCtrl?: TouchControls
  private platforms?: Phaser.Physics.Arcade.StaticGroup
  private shards: MemoryShard[] = []

  constructor() {
    super('RetryScene')
  }

  create() {
    this.shards = []

    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT)
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT)
    this.cameras.main.setBackgroundColor(MORANDI_PALETTE.skyTop)

    this.buildBackground()
    this.platforms = this.buildGround()
    this.player = new Player(this, 120, GROUND_TOP)
    this.physics.add.collider(this.player, this.platforms)

    this.placeMemoryShards()

    this.inputCtrl = new InputController(this)
    const isTouch = this.sys.game.device.input.touch
    this.touchCtrl = new TouchControls(this, this.inputCtrl)
    this.touchCtrl.setVisible(isTouch)

    this.cameras.main.startFollow(this.player, true, 0.12, 0.12)
    this.cameras.main.setDeadzone(120, 40)

    this.add
      .text(16, 16, 'Chapter 5 · Retry', {
        color: MORANDI_PALETTE.slateText,
        fontFamily: 'monospace',
        fontSize: '14px',
        fontStyle: 'bold',
        backgroundColor: 'rgba(248, 251, 249, 0.72)',
        padding: { x: 10, y: 6 },
      })
      .setScrollFactor(0)
      .setDepth(20)

    this.add
      .text(WORLD_WIDTH / 2, GROUND_TOP - 120, 'Gather materials again. Inner Doubt awaits ahead.', {
        color: MORANDI_PALETTE.mutedText,
        fontFamily: 'monospace',
        fontSize: '13px',
        backgroundColor: 'rgba(248, 251, 249, 0.82)',
        padding: { x: 12, y: 8 },
      })
      .setOrigin(0.5)
      .setDepth(4)

    if (!isTouch) {
      this.add
        .text(this.scale.width / 2, 16, '← → Move   Space Jump   Shift Dash   E Talk / Interact', {
          color: MORANDI_PALETTE.mutedText,
          fontFamily: 'monospace',
          fontSize: '12px',
          backgroundColor: 'rgba(248, 251, 249, 0.72)',
          padding: { x: 10, y: 6 },
        })
        .setOrigin(0.5, 0)
        .setScrollFactor(0)
        .setDepth(20)
    }

    gameEventBus.emit('phaser:ready', {
      scene: this.scene.key,
      message: 'Retry chapter placeholder ready.',
    })
  }

  update(_time: number, delta: number) {
    if (!this.player || !this.inputCtrl) {
      return
    }

    const snap = this.inputCtrl.snapshot()
    this.player.update(snap, delta)
  }

  shutdown() {
    this.inputCtrl?.destroy()
    this.touchCtrl?.destroy()
  }

  private buildBackground() {
    const sky = this.add
      .tileSprite(0, 0, WORLD_WIDTH, WORLD_HEIGHT, ASSET_KEYS.paleBlueSky)
      .setOrigin(0, 0)
      .setScrollFactor(0.12)

    this.add.rectangle(WORLD_WIDTH / 2, WORLD_HEIGHT * 0.55, WORLD_WIDTH, WORLD_HEIGHT * 0.7, MORANDI_PALETTE.skyBottom, 0.18)

    sky.setSize(WORLD_WIDTH, WORLD_HEIGHT)
  }

  private buildGround() {
    const ground = this.add.rectangle(WORLD_WIDTH / 2, GROUND_Y, WORLD_WIDTH, GROUND_HEIGHT, MORANDI_PALETTE.sageGreen, 0.4)
    ground.setStrokeStyle(2, MORANDI_PALETTE.dustyBlue, 0.32)
    this.physics.add.existing(ground, true)
    ;(ground.body as Phaser.Physics.Arcade.StaticBody).updateFromGameObject()
    return this.physics.add.staticGroup([ground])
  }

  private placeMemoryShards() {
    const shardPositions = [
      { x: 360, y: GROUND_TOP - 36 },
      { x: 720, y: GROUND_TOP - 36 },
      { x: 1080, y: GROUND_TOP - 36 },
      { x: 1440, y: GROUND_TOP - 36 },
    ]

    shardPositions.forEach(({ x, y }) => {
      const shard = new MemoryShard(this, x, y)
      this.shards.push(shard)

      if (this.player) {
        this.physics.add.overlap(this.player, shard, () => {
          shard.collect(this.player as Player)
        })
      }
    })
  }
}
