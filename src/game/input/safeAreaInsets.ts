import Phaser from 'phaser'

export type SafeAreaInsets = {
  top: number
  right: number
  bottom: number
  left: number
}

function parseInset(value: string) {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

/**
 * Reads CSS safe-area env values from the live document so Phaser HUD can
 * respect iPhone home-indicator and notch padding.
 */
export function readCssSafeAreaInsets(): SafeAreaInsets {
  if (typeof document === 'undefined') {
    return { top: 0, right: 0, bottom: 0, left: 0 }
  }

  const probe = document.createElement('div')
  probe.style.position = 'fixed'
  probe.style.visibility = 'hidden'
  probe.style.pointerEvents = 'none'
  probe.style.paddingTop = 'env(safe-area-inset-top, 0px)'
  probe.style.paddingRight = 'env(safe-area-inset-right, 0px)'
  probe.style.paddingBottom = 'env(safe-area-inset-bottom, 0px)'
  probe.style.paddingLeft = 'env(safe-area-inset-left, 0px)'
  document.body.appendChild(probe)

  const styles = getComputedStyle(probe)
  const insets: SafeAreaInsets = {
    top: parseInset(styles.paddingTop),
    right: parseInset(styles.paddingRight),
    bottom: parseInset(styles.paddingBottom),
    left: parseInset(styles.paddingLeft),
  }

  document.body.removeChild(probe)
  return insets
}

function fallbackInsets(width: number, height: number): SafeAreaInsets {
  return {
    top: height * 0.02,
    right: width * 0.02,
    bottom: height * 0.05,
    left: width * 0.02,
  }
}

/**
 * Maps viewport safe-area pixels into Phaser game coordinates.
 */
export function mapSafeAreaInsetsToGame(scene: Phaser.Scene, cssInsets: SafeAreaInsets): SafeAreaInsets {
  const canvas = scene.scale.canvas

  if (!canvas) {
    return fallbackInsets(scene.scale.width, scene.scale.height)
  }

  const rect = canvas.getBoundingClientRect()
  if (rect.width <= 0 || rect.height <= 0) {
    return fallbackInsets(scene.scale.width, scene.scale.height)
  }

  const scaleX = scene.scale.width / rect.width
  const scaleY = scene.scale.height / rect.height

  const mapped: SafeAreaInsets = {
    top: cssInsets.top * scaleY,
    right: cssInsets.right * scaleX,
    bottom: cssInsets.bottom * scaleY,
    left: cssInsets.left * scaleX,
  }

  const fallback = fallbackInsets(scene.scale.width, scene.scale.height)

  return {
    top: Math.max(mapped.top, fallback.top),
    right: Math.max(mapped.right, fallback.right),
    bottom: Math.max(mapped.bottom, fallback.bottom),
    left: Math.max(mapped.left, fallback.left),
  }
}
