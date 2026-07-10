export type TouchInputKey = 'left' | 'right' | 'jump' | 'dash' | 'meow' | 'talk'

const touchState: Record<TouchInputKey, boolean> = {
  left: false,
  right: false,
  jump: false,
  dash: false,
  meow: false,
  talk: false,
}

export function setTouchInput(key: TouchInputKey, value: boolean) {
  touchState[key] = value
}

export function getTouchInputState(): Readonly<Record<TouchInputKey, boolean>> {
  return touchState
}

export function resetTouchInput() {
  ;(Object.keys(touchState) as TouchInputKey[]).forEach((key) => {
    touchState[key] = false
  })
}
