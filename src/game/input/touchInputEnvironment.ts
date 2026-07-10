import Phaser from 'phaser'

const MOBILE_TOUCH_QUERY = '(max-width: 820px), (pointer: coarse)'

export function shouldShowTouchControlsInBrowser(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    return true
  }

  return window.matchMedia(MOBILE_TOUCH_QUERY).matches
}

/**
 * Phaser device.touch alone misses DevTools mobile emulation; also treat narrow
 * or coarse-pointer viewports as touch-first so controls appear during testing.
 */
export function shouldShowTouchControls(scene: Phaser.Scene): boolean {
  if (scene.sys.game.device.input.touch) {
    return true
  }

  return shouldShowTouchControlsInBrowser()
}
