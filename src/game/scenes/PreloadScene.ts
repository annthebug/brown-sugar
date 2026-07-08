import Phaser from 'phaser'
import { gameEventBus } from '../events/eventBus'

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene')
  }

  create() {
    gameEventBus.emit('phaser:preloaded', { scene: this.scene.key })
    this.scene.start('GameScene')
  }
}
