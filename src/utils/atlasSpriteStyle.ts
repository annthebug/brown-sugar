import type { CSSProperties } from 'react'

type AtlasFrameRect = {
  x: number
  y: number
  w: number
  h: number
}

type AtlasFrame = {
  frame: AtlasFrameRect
  spriteSourceSize: AtlasFrameRect
  sourceSize: {
    w: number
    h: number
  }
}

export type SpriteAtlas = {
  frames: Record<string, AtlasFrame>
  meta: {
    size: {
      w: number
      h: number
    }
  }
}

export function getAtlasSpriteStyle(
  atlas: SpriteAtlas,
  frameName: string,
  textureUrl: string,
  scale: number,
): CSSProperties {
  const frame = atlas.frames[frameName]

  if (!frame) {
    throw new Error(`Missing sprite frame: ${frameName}`)
  }

  const { sourceSize, spriteSourceSize, frame: rect } = frame
  const sheet = atlas.meta.size

  return {
    width: sourceSize.w * scale,
    height: sourceSize.h * scale,
    backgroundImage: `url(${textureUrl})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: `${sheet.w * scale}px ${sheet.h * scale}px`,
    backgroundPosition: `${(spriteSourceSize.x - rect.x) * scale}px ${(spriteSourceSize.y - rect.y) * scale}px`,
    imageRendering: 'pixelated',
  }
}
