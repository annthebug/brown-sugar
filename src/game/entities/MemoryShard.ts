import Phaser from 'phaser'
import { MORANDI_PALETTE } from '../assets/assetManifest'
import { gameEventBus } from '../events/eventBus'
import type { Player } from './Player'

export class MemoryShard extends Phaser.GameObjects.Container {
  private collected = false

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)

    const glow = scene.add.circle(0, -20, 22, MORANDI_PALETTE.warmBeige, 0.34)
    const diamond = scene.add
      .polygon(0, -20, [0, -18, 14, 0, 0, 18, -14, 0], MORANDI_PALETTE.dustyBlue, 0.92)
      .setStrokeStyle(2, MORANDI_PALETTE.cloud, 0.78)

    this.add([glow, diamond])
    this.setSize(36, 44)
    scene.add.existing(this)
    scene.physics.add.existing(this)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setAllowGravity(false)
    body.setImmovable(true)

    scene.tweens.add({
      targets: glow,
      alpha: 0.58,
      duration: 950,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
  }

  collect(player: Player) {
    if (this.collected) {
      return
    }

    this.collected = true
    player.triggerCollect()

    gameEventBus.emit('memory-shard-collected', {
      scene: this.scene.scene.key,
      amount: 1,
    })

    this.scene.tweens.add({
      targets: this,
      y: this.y - 10,
      alpha: 0,
      duration: 220,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        this.destroy()
      },
    })
  }
}
