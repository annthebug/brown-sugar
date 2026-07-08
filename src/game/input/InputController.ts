import Phaser from 'phaser'

export type InputSnapshot = {
  left: boolean
  right: boolean
  jump: boolean
  jumpJustDown: boolean
  dash: boolean
  dashJustDown: boolean
  meow: boolean
  meowJustDown: boolean
  talk: boolean
  talkJustDown: boolean
}

type TouchKey = 'left' | 'right' | 'jump' | 'dash' | 'meow' | 'talk'

/**
 * Unified input source for keyboard and touch — consumers only see InputSnapshot,
 * keeping game logic decoupled from the physical input device.
 */
export class InputController {
  private keys: {
    left: Phaser.Input.Keyboard.Key
    right: Phaser.Input.Keyboard.Key
    up: Phaser.Input.Keyboard.Key
    space: Phaser.Input.Keyboard.Key
    shift: Phaser.Input.Keyboard.Key
    m: Phaser.Input.Keyboard.Key
    e: Phaser.Input.Keyboard.Key
    enter: Phaser.Input.Keyboard.Key
  }

  private touch: Record<TouchKey, boolean> = {
    left: false,
    right: false,
    jump: false,
    dash: false,
    meow: false,
    talk: false,
  }

  private prev = {
    jump: false,
    dash: false,
    meow: false,
    talk: false,
  }

  constructor(scene: Phaser.Scene) {
    const kb = scene.input.keyboard!
    const K = Phaser.Input.Keyboard.KeyCodes
    this.keys = {
      left: kb.addKey(K.LEFT),
      right: kb.addKey(K.RIGHT),
      up: kb.addKey(K.UP),
      space: kb.addKey(K.SPACE),
      shift: kb.addKey(K.SHIFT),
      m: kb.addKey(K.M),
      e: kb.addKey(K.E),
      enter: kb.addKey(K.ENTER),
    }
  }

  setTouchInput(key: TouchKey, value: boolean) {
    this.touch[key] = value
  }

  snapshot(): InputSnapshot {
    const { keys: k, touch: t } = this

    const left = k.left.isDown || t.left
    const right = k.right.isDown || t.right
    const jump = k.space.isDown || k.up.isDown || t.jump
    const dash = k.shift.isDown || t.dash
    const meow = k.m.isDown || t.meow
    const talk = k.e.isDown || k.enter.isDown || t.talk

    const s: InputSnapshot = {
      left,
      right,
      jump,
      jumpJustDown: jump && !this.prev.jump,
      dash,
      dashJustDown: dash && !this.prev.dash,
      meow,
      meowJustDown: meow && !this.prev.meow,
      talk,
      talkJustDown: talk && !this.prev.talk,
    }

    this.prev = { jump, dash, meow, talk }
    return s
  }

  destroy() {
    // Keys are managed by Phaser's keyboard plugin; no manual cleanup needed.
  }
}
