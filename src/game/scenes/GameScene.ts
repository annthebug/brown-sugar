import Phaser from 'phaser'
import { gameEventBus } from '../events/eventBus'

const SKY_TOP = 0xd8edf4
const SKY_BOTTOM = 0xe8f2ef
const CLOUD = 0xf8fbf9
const SAGE_GREEN = 0xb7c9bd
const WARM_BEIGE = 0xf4eadc
const DUSTY_BLUE = 0x8fb2bf

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene')
  }

  create() {
    const { width, height } = this.scale

    this.cameras.main.setBackgroundColor(SKY_TOP)
    this.add.rectangle(width / 2, height / 2, width, height, SKY_TOP)
    this.add.rectangle(width / 2, height * 0.62, width, height * 0.76, SKY_BOTTOM, 0.68)

    this.addCloud(width * 0.18, height * 0.2, 1)
    this.addCloud(width * 0.72, height * 0.24, 0.84)
    this.addCloud(width * 0.45, height * 0.34, 0.62)

    this.add.rectangle(width / 2, height - 56, width, 112, SAGE_GREEN)
    this.add.rectangle(width / 2, height - 22, width, 44, WARM_BEIGE, 0.8)

    const title = this.add
      .text(width / 2, height * 0.42, 'Brown Sugar begins here', {
        color: '#385867',
        fontFamily: 'monospace',
        fontSize: '28px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)

    this.add
      .text(width / 2, title.y + 42, 'Phaser GameScene · pale blue sky', {
        color: '#50676f',
        fontFamily: 'monospace',
        fontSize: '16px',
      })
      .setOrigin(0.5)

    this.addBrownSugar(width / 2, height - 136)

    gameEventBus.emit('phaser:ready', {
      scene: this.scene.key,
      message: 'GameScene rendered with a pale blue sky.',
    })
  }

  private addCloud(x: number, y: number, scale: number) {
    const cloud = this.add.container(x, y)
    const circles = [
      this.add.circle(-44 * scale, 8 * scale, 28 * scale, CLOUD, 0.82),
      this.add.circle(-12 * scale, -10 * scale, 38 * scale, CLOUD, 0.88),
      this.add.circle(30 * scale, 4 * scale, 30 * scale, CLOUD, 0.76),
      this.add.circle(60 * scale, 14 * scale, 20 * scale, CLOUD, 0.64),
    ]

    cloud.add(circles)
  }

  private addBrownSugar(x: number, y: number) {
    const cat = this.add.container(x, y)

    cat.add([
      this.add.triangle(-24, -36, 0, 28, 28, 28, 14, -18, 0x5a453d),
      this.add.triangle(24, -36, 0, 28, -28, 28, -14, -18, 0x5a453d),
      this.add.circle(0, 0, 44, 0x6a4f45),
      this.add.circle(-14, -6, 5, CLOUD),
      this.add.circle(14, -6, 5, CLOUD),
      this.add.rectangle(0, 20, 52, 8, DUSTY_BLUE, 0.92),
    ])
  }
}
