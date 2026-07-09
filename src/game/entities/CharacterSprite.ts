import Phaser from 'phaser'
import { ASSET_KEYS, MORANDI_PALETTE } from '../assets/assetManifest'

export type CharacterAtlas = 'npc' | 'boss'

type CharacterSpriteOptions = {
  atlas: CharacterAtlas
  frame: string
  label: string
  scale?: number
  depth?: number
  alpha?: number
}

export type CharacterMarker = Phaser.GameObjects.Container & {
  sprite: Phaser.GameObjects.Sprite
  label: Phaser.GameObjects.Text
}

export function placeCharacterSprite(
  scene: Phaser.Scene,
  x: number,
  y: number,
  options: CharacterSpriteOptions,
): CharacterMarker {
  const textureKey = options.atlas === 'npc' ? ASSET_KEYS.npcCharacters : ASSET_KEYS.bossCharacters
  // Match Black Sugar on-screen height (256px frame × 0.44 scale).
  const defaultScale = options.atlas === 'npc' ? 0.44 : 0.48
  const scale = options.scale ?? defaultScale

  const container = scene.add.container(x, y) as CharacterMarker
  const sprite = scene.add.sprite(0, 0, textureKey, options.frame)
  sprite.setOrigin(0.5, 1).setScale(scale)

  if (options.alpha !== undefined) {
    sprite.setAlpha(options.alpha)
  }

  const label = scene.add
    .text(0, 8, options.label, {
      color: MORANDI_PALETTE.slateText,
      fontFamily: 'monospace',
      fontSize: '11px',
      fontStyle: 'bold',
    })
    .setOrigin(0.5)

  if (options.depth !== undefined) {
    container.setDepth(options.depth)
  }

  container.add([sprite, label])
  container.sprite = sprite
  container.label = label
  return container
}
