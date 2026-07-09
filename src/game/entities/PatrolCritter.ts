import Phaser from 'phaser'
import { MORANDI_PALETTE } from '../assets/assetManifest'
import type { Player } from './Player'

export type PatrolCritterKind = 'yarnBall' | 'cardboardBox'

type PatrolCritterOptions = {
  kind: PatrolCritterKind
  x: number
  y: number
  patrolMinX: number
  patrolMaxX: number
  speed?: number
}

const CRITTER_SPEED = 42
const PAUSE_MS = 420
const KNOCKBACK_X = 160
const KNOCKBACK_Y = -110

export class PatrolCritter extends Phaser.GameObjects.Container {
  private readonly patrolMinX: number
  private readonly patrolMaxX: number
  private readonly speed: number
  private direction: 1 | -1 = 1
  private pauseTimer = 0

  constructor(scene: Phaser.Scene, options: PatrolCritterOptions) {
    super(scene, options.x, options.y)

    this.patrolMinX = options.patrolMinX
    this.patrolMaxX = options.patrolMaxX
    this.speed = options.speed ?? CRITTER_SPEED

    if (options.kind === 'yarnBall') {
      const body = scene.add.circle(0, -16, 18, MORANDI_PALETTE.mistPink, 0.88)
      const fuzz = scene.add.circle(-8, -20, 8, MORANDI_PALETTE.cloud, 0.55)
      this.add([body, fuzz])
      this.setSize(34, 34)
    } else {
      const box = scene.add.rectangle(0, -18, 42, 34, MORANDI_PALETTE.warmBeige, 0.94)
      box.setStrokeStyle(2, MORANDI_PALETTE.dustyBlue, 0.45)
      const flap = scene.add.rectangle(0, -34, 42, 8, MORANDI_PALETTE.cloud, 0.72)
      this.add([box, flap])
      this.setSize(44, 38)
    }

    scene.add.existing(this)
    scene.physics.add.existing(this)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setAllowGravity(true)
    body.setCollideWorldBounds(false)
    body.setMaxVelocity(this.speed, 900)
    body.setVelocityX(this.speed * this.direction)
  }

  update() {
    if (this.pauseTimer > 0) {
      this.pauseTimer -= this.scene.game.loop.delta
      ;(this.body as Phaser.Physics.Arcade.Body).setVelocityX(0)
      return
    }

    const body = this.body as Phaser.Physics.Arcade.Body

    if (this.x <= this.patrolMinX) {
      this.direction = 1
    } else if (this.x >= this.patrolMaxX) {
      this.direction = -1
    }

    body.setVelocityX(this.speed * this.direction)
  }

  bumpPlayer(player: Player) {
    const playerBody = player.body as Phaser.Physics.Arcade.Body
    const knockDirection: 1 | -1 = player.x < this.x ? -1 : 1

    playerBody.setVelocityX(knockDirection * KNOCKBACK_X)
    playerBody.setVelocityY(KNOCKBACK_Y)
    this.pauseTimer = PAUSE_MS
    ;(this.body as Phaser.Physics.Arcade.Body).setVelocityX(0)
  }
}
