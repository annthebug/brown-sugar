import Phaser from 'phaser'

const MOBILE_TOUCH_QUERY = '(max-width: 820px), (pointer: coarse)'

/**
 * Phaser device.touch alone misses DevTools mobile emulation; also treat narrow
 * or coarse-pointer viewports as touch-first so controls appear during testing.
 */
export function shouldShowTouchControls(scene: Phaser.Scene): boolean {
  if (scene.sys.game.device.input.touch) {
    return true
  }

  if (typeof window !== 'undefined' && window.matchMedia(MOBILE_TOUCH_QUERY).matches) {
    return true
  }

  return false
}
