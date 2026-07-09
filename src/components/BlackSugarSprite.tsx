import type { CSSProperties } from 'react'
import blackSugarAtlas from '../../assets/characters/black-sugar-sprite-sheet-v1.json'
import blackSugarSpriteSheet from '../../assets/characters/black-sugar-sprite-sheet-v1.png'
import { BLACK_SUGAR_FRAMES } from '../game/assets/assetManifest'
import { getAtlasSpriteStyle } from '../utils/atlasSpriteStyle'

type BlackSugarFrame = keyof typeof BLACK_SUGAR_FRAMES

type BlackSugarSpriteStyleOverrides = Pick<CSSProperties, 'backgroundSize' | 'backgroundPosition'>

type BlackSugarSpriteProps = {
  frame?: BlackSugarFrame
  scale?: number
  className?: string
  label?: string
  styleOverrides?: BlackSugarSpriteStyleOverrides
}

export function BlackSugarSprite({
  frame = 'frontIdle',
  scale = 0.68,
  className = 'black-sugar-sprite',
  label = '黑糖',
  styleOverrides,
}: BlackSugarSpriteProps) {
  const frameName = BLACK_SUGAR_FRAMES[frame]
  const style: CSSProperties = {
    ...getAtlasSpriteStyle(blackSugarAtlas, frameName, blackSugarSpriteSheet, scale),
    ...styleOverrides,
  }

  return <div className={className} style={style} role="img" aria-label={label} />
}
