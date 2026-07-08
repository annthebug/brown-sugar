import Phaser from 'phaser'
import { ASSET_KEYS, BLACK_SUGAR_FRAMES, MORANDI_PALETTE } from '../assets/assetManifest'
import { gameEventBus } from '../events/eventBus'

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene')
  }

  create() {
    const { width, height } = this.scale

    this.cameras.main.setBackgroundColor(MORANDI_PALETTE.skyTop)
    this.add.image(width / 2, height / 2, ASSET_KEYS.paleBlueSky).setDisplaySize(width, height)
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

    this.add.rectangle(width / 2, height - 56, width, 112, MORANDI_PALETTE.sageGreen)
    this.add.rectangle(width / 2, height - 22, width, 44, MORANDI_PALETTE.warmBeige, 0.8)

    const title = this.add
      .text(width / 2, height * 0.42, 'Brown Sugar begins here', {
        color: MORANDI_PALETTE.slateText,
        fontFamily: 'monospace',
        fontSize: '28px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)

    this.add
      .text(width / 2, title.y + 42, 'Phaser GameScene · pale blue sky', {
        color: MORANDI_PALETTE.mutedText,
        fontFamily: 'monospace',
        fontSize: '16px',
      })
      .setOrigin(0.5)

    this.addBrownSugar(width / 2, height - 136)
    this.addMemoryShard(width * 0.72, height - 152)

    gameEventBus.emit('phaser:ready', {
      scene: this.scene.key,
      message: 'GameScene rendered with a pale blue sky.',
    })
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

  private addBrownSugar(x: number, y: number) {
    this.add
      .sprite(x, y, ASSET_KEYS.blackSugar, BLACK_SUGAR_FRAMES.frontIdle)
      .setOrigin(0.5, 1)
      .setScale(0.44)
  }

  private addMemoryShard(x: number, y: number) {
    const shard = this.add.container(x, y)
    const glow = this.add.circle(0, 0, 34, MORANDI_PALETTE.warmBeige, 0.34)
    const diamond = this.add
      .polygon(0, 0, [0, -30, 22, 0, 0, 30, -22, 0], MORANDI_PALETTE.dustyBlue, 0.92)
      .setStrokeStyle(3, MORANDI_PALETTE.cloud, 0.78)
    const label = this.add
      .text(0, 48, 'Memory Shard', {
        color: MORANDI_PALETTE.slateText,
        fontFamily: 'monospace',
        fontSize: '13px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)

    shard.add([glow, diamond, label])
    shard.setSize(88, 108)
    shard.setInteractive({ useHandCursor: true })
    shard.on('pointerdown', () => {
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
      })
    })

    this.tweens.add({
      targets: glow,
      alpha: 0.58,
      duration: 950,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
  }
}
