import Phaser from 'phaser'
import { MORANDI_PALETTE } from '../assets/assetManifest'
import type { InputController } from './InputController'
import { mapSafeAreaInsetsToGame, readCssSafeAreaInsets } from './safeAreaInsets'

const BTN_ALPHA = 0.55
const BTN_ACTIVE_ALPHA = 0.85
const LABEL_DEPTH = 201
const BG_DEPTH = 200
const HINT_DEPTH = 202
const MIN_BUTTON_RADIUS = 22

type ButtonSpec = {
  x: number
  y: number
  radius: number
}

type TouchLayout = {
  dpadLeft: ButtonSpec
  dpadRight: ButtonSpec
  jump: ButtonSpec
  dash: ButtonSpec
  meow: ButtonSpec
  talk: ButtonSpec
}

/**
 * On-screen touch controls rendered as semi-transparent circles fixed to the camera.
 * Shown only on touch-capable devices; hidden on pointer-mouse-only setups.
 */
export class TouchControls {
  private scene: Phaser.Scene
  private ctrl: InputController
  private objects: Phaser.GameObjects.GameObject[] = []
  private portraitHint?: Phaser.GameObjects.Text
  private visible = true
  private readonly handleLayoutChange: () => void

  constructor(scene: Phaser.Scene, ctrl: InputController) {
    this.scene = scene
    this.ctrl = ctrl
    this.handleLayoutChange = () => {
      this.rebuild()
    }

    this.build()
    this.scene.scale.on(Phaser.Scale.Events.RESIZE, this.handleLayoutChange)

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleLayoutChange)
      window.addEventListener('orientationchange', this.handleLayoutChange)
    }
  }

  private computeLayout(): TouchLayout {
    const width = this.scene.scale.width
    const height = this.scene.scale.height
    const insets = mapSafeAreaInsetsToGame(this.scene, readCssSafeAreaInsets())
    const shortSide = Math.min(width, height)

    const edgeMargin = Math.max(16, shortSide * 0.03)
    const gap = Math.max(12, width * 0.014)
    const dpadRadius = Math.max(MIN_BUTTON_RADIUS, shortSide * 0.045)
    const actionRadius = Math.max(MIN_BUTTON_RADIUS, shortSide * 0.042)
    const jumpRadius = Math.max(MIN_BUTTON_RADIUS + 2, shortSide * 0.048)

    const baseY = height - insets.bottom - edgeMargin - dpadRadius
    const dpadLeftX = insets.left + edgeMargin + dpadRadius
    const dpadRightX = dpadLeftX + dpadRadius * 2 + gap

    const meowX = width - insets.right - edgeMargin - actionRadius
    const dashX = meowX - actionRadius * 2 - gap
    const jumpX = width - insets.right - edgeMargin - jumpRadius
    const talkX = jumpX - actionRadius * 2 - gap
    const upperY = baseY - jumpRadius - gap - actionRadius

    return {
      dpadLeft: { x: dpadLeftX, y: baseY, radius: dpadRadius },
      dpadRight: { x: dpadRightX, y: baseY, radius: dpadRadius },
      jump: { x: jumpX, y: upperY, radius: jumpRadius },
      dash: { x: dashX, y: baseY, radius: actionRadius },
      meow: { x: meowX, y: baseY, radius: actionRadius },
      talk: { x: talkX, y: upperY, radius: actionRadius },
    }
  }

  private build() {
    this.clearObjects()
    const layout = this.computeLayout()

    this.makeHoldButton(layout.dpadLeft.x, layout.dpadLeft.y, '◀', layout.dpadLeft.radius, 'left')
    this.makeHoldButton(layout.dpadRight.x, layout.dpadRight.y, '▶', layout.dpadRight.radius, 'right')
    this.makeHoldButton(layout.jump.x, layout.jump.y, 'Jump', layout.jump.radius, 'jump')

    this.makeTapButton(layout.dash.x, layout.dash.y, 'Dash', layout.dash.radius, () => {
      this.ctrl.setTouchInput('dash', true)
      this.scene.time.delayedCall(80, () => this.ctrl.setTouchInput('dash', false))
    })
    this.makeTapButton(layout.meow.x, layout.meow.y, 'Meow', layout.meow.radius, () => {
      this.ctrl.setTouchInput('meow', true)
      this.scene.time.delayedCall(80, () => this.ctrl.setTouchInput('meow', false))
    })
    this.makeTapButton(layout.talk.x, layout.talk.y, 'Talk', layout.talk.radius, () => {
      this.ctrl.setTouchInput('talk', true)
      this.scene.time.delayedCall(80, () => this.ctrl.setTouchInput('talk', false))
    })

    this.updatePortraitHint()
    this.applyVisibility()
  }

  private rebuild() {
    this.build()
  }

  private clearObjects() {
    this.objects.forEach((object) => object.destroy())
    this.objects = []
    this.portraitHint = undefined
  }

  private updatePortraitHint() {
    const isPortrait =
      typeof window !== 'undefined' ? window.innerHeight > window.innerWidth : false

    if (!isPortrait) {
      this.portraitHint?.setVisible(false)
      return
    }

    const { width, height } = this.scene.scale

    if (!this.portraitHint) {
      this.portraitHint = this.scene.add
        .text(width / 2, height * 0.22, '建議橫向遊玩', {
          color: MORANDI_PALETTE.slateText,
          fontFamily: 'monospace',
          fontSize: `${Math.max(14, Math.round(width * 0.02))}px`,
          fontStyle: 'bold',
          backgroundColor: 'rgba(248, 251, 249, 0.55)',
          padding: { x: 14, y: 8 },
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(HINT_DEPTH)
        .setAlpha(0.62)

      this.objects.push(this.portraitHint)
    } else {
      this.portraitHint
        .setPosition(width / 2, height * 0.22)
        .setVisible(true)
    }
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
      .setInteractive(new Phaser.Geom.Circle(0, 0, radius), Phaser.Geom.Circle.Contains)

    const txt = this.scene.add
      .text(x, y, label, {
        color: '#ffffff',
        fontFamily: 'monospace',
        fontSize: radius >= 24 ? '13px' : '12px',
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
      .setInteractive(new Phaser.Geom.Circle(0, 0, radius), Phaser.Geom.Circle.Contains)

    const txt = this.scene.add
      .text(x, y, label, {
        color: '#ffffff',
        fontFamily: 'monospace',
        fontSize: radius >= 24 ? '12px' : '11px',
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

  private applyVisibility() {
    this.objects.forEach((object) => {
      const gameObject = object as Phaser.GameObjects.GameObject & { setVisible(v: boolean): unknown }
      gameObject.setVisible(this.visible)
    })
  }

  setVisible(visible: boolean) {
    this.visible = visible
    this.applyVisibility()
  }

  destroy() {
    this.scene.scale.off(Phaser.Scale.Events.RESIZE, this.handleLayoutChange)

    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.handleLayoutChange)
      window.removeEventListener('orientationchange', this.handleLayoutChange)
    }

    this.clearObjects()
  }
}
