import Phaser from 'phaser'
import { MORANDI_PALETTE } from '../assets/assetManifest'
import type { InputController } from './InputController'

const BTN_ALPHA = 0.55
const BTN_ACTIVE_ALPHA = 0.85
const LABEL_DEPTH = 201
const BG_DEPTH = 200

/**
 * On-screen touch controls rendered as semi-transparent circles fixed to the camera.
 * Shown only on touch-capable devices; hidden on pointer-mouse-only setups.
 */
export class TouchControls {
  private scene: Phaser.Scene
  private ctrl: InputController
  private objects: Phaser.GameObjects.GameObject[] = []

  constructor(scene: Phaser.Scene, ctrl: InputController) {
    this.scene = scene
    this.ctrl = ctrl
    this.build()
  }

  private build() {
    const { width, height } = this.scene.scale

    // D-pad left / right
    this.makeHoldButton(60, height - 72, '◀', 38, 'left')
    this.makeHoldButton(148, height - 72, '▶', 38, 'right')

    // Jump (right side, largest)
    this.makeHoldButton(width - 64, height - 130, 'Jump', 44, 'jump')

    // Dash & Meow (tap only — set for one frame then auto-clear)
    this.makeTapButton(width - 164, height - 72, 'Dash', 34, () => {
      this.ctrl.setTouchInput('dash', true)
      this.scene.time.delayedCall(80, () => this.ctrl.setTouchInput('dash', false))
    })
    this.makeTapButton(width - 68, height - 64, 'Meow', 34, () => {
      this.ctrl.setTouchInput('meow', true)
      this.scene.time.delayedCall(80, () => this.ctrl.setTouchInput('meow', false))
    })

    // Talk / confirm button (upper-right action)
    this.makeTapButton(width - 120, height - 132, 'Talk', 28, () => {
      this.ctrl.setTouchInput('talk', true)
      this.scene.time.delayedCall(80, () => this.ctrl.setTouchInput('talk', false))
    })
  }

  private makeHoldButton(
    x: number,
    y: number,
    label: string,
    radius: number,
    key: 'left' | 'right' | 'jump',
  ) {
    const bg = this.scene.add
      .circle(x, y, radius, MORANDI_PALETTE.dustyBlue, BTN_ALPHA)
      .setScrollFactor(0)
      .setDepth(BG_DEPTH)
      .setInteractive()

    const txt = this.scene.add
      .text(x, y, label, {
        color: '#ffffff',
        fontFamily: 'monospace',
        fontSize: radius > 40 ? '13px' : '12px',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(LABEL_DEPTH)

    bg.on('pointerdown', () => {
      this.ctrl.setTouchInput(key, true)
      bg.setAlpha(BTN_ACTIVE_ALPHA)
    })
    bg.on('pointerup', () => {
      this.ctrl.setTouchInput(key, false)
      bg.setAlpha(BTN_ALPHA)
    })
    bg.on('pointerout', () => {
      this.ctrl.setTouchInput(key, false)
      bg.setAlpha(BTN_ALPHA)
    })

    this.objects.push(bg, txt)
  }

  private makeTapButton(x: number, y: number, label: string, radius: number, onTap: () => void) {
    const bg = this.scene.add
      .circle(x, y, radius, MORANDI_PALETTE.mistPink, BTN_ALPHA)
      .setScrollFactor(0)
      .setDepth(BG_DEPTH)
      .setInteractive()

    const txt = this.scene.add
      .text(x, y, label, {
        color: '#ffffff',
        fontFamily: 'monospace',
        fontSize: '11px',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(LABEL_DEPTH)

    bg.on('pointerdown', () => {
      onTap()
      bg.setAlpha(BTN_ACTIVE_ALPHA)
      this.scene.time.delayedCall(120, () => bg.setAlpha(BTN_ALPHA))
    })

    this.objects.push(bg, txt)
  }

  setVisible(visible: boolean) {
    this.objects.forEach((o) => {
      const go = o as Phaser.GameObjects.GameObject & { setVisible(v: boolean): unknown }
      go.setVisible(visible)
    })
  }

  destroy() {
    this.objects.forEach((o) => o.destroy())
    this.objects = []
  }
}
