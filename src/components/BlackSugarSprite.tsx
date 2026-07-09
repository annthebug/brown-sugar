import blackSugarAtlas from '../../assets/characters/black-sugar-sprite-sheet-v1.json'
import blackSugarSpriteSheet from '../../assets/characters/black-sugar-sprite-sheet-v1.png'
import { BLACK_SUGAR_FRAMES } from '../game/assets/assetManifest'
import { getAtlasSpriteStyle } from '../utils/atlasSpriteStyle'

type BlackSugarFrame = keyof typeof BLACK_SUGAR_FRAMES

type BlackSugarSpriteProps = {
  frame?: BlackSugarFrame
  scale?: number
  className?: string
  label?: string
}

export function BlackSugarSprite({
  frame = 'frontIdle',
  scale = 0.68,
  className = 'black-sugar-sprite',
  label = '黑糖',
}: BlackSugarSpriteProps) {
  const frameName = BLACK_SUGAR_FRAMES[frame]
  const style = getAtlasSpriteStyle(blackSugarAtlas, frameName, blackSugarSpriteSheet, scale)

  return <div className={className} style={style} role="img" aria-label={label} />
}
