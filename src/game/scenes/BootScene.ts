import Phaser from 'phaser'
import { gameEventBus } from '../events/eventBus'

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')
  }

  create() {
    gameEventBus.emit('phaser:booted', { scene: this.scene.key })
    this.scene.start('PreloadScene')
  }
}
