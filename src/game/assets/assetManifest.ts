export const ASSET_KEYS = {
  blackSugar: 'black-sugar',
  paleBlueSky: 'scene-pale-blue-sky',
  loadingPanel: 'ui-loading-panel',
  mbtiGlassBowls: 'bowls-mbti-glass-sheet',
} as const

export const BLACK_SUGAR_FRAMES = {
  frontIdle: 'black-sugar-front-idle',
  frontBlink: 'black-sugar-front-blink',
  sideIdle: 'black-sugar-side-idle',
  sideWalk1: 'black-sugar-side-walk-1',
  sideWalk2: 'black-sugar-side-walk-2',
  backIdle: 'black-sugar-back-idle',
  jump: 'black-sugar-jump',
  dash: 'black-sugar-dash',
  meow: 'black-sugar-meow',
  happySparkle: 'black-sugar-happy-sparkle',
  sadPleading: 'black-sugar-sad-pleading',
  collectItem: 'black-sugar-collect-item',
} as const

export type AssetCategory = 'characters' | 'scenes' | 'ui' | 'memories' | 'bowls'
type AssetPurpose = 'preload' | 'gallery-source'

type BaseAsset = {
  key: string
  category: AssetCategory
  placeholder: boolean
  purpose: AssetPurpose
  description: string
}

export type AtlasAsset = BaseAsset & {
  kind: 'atlas'
  textureUrl: string
  atlasUrl: string
  frames: readonly string[]
}

export type ImageAsset = BaseAsset & {
  kind: 'image'
  url: string
}

export type GameAsset = AtlasAsset | ImageAsset

export type GameAssetManifest = {
  characters: readonly AtlasAsset[]
  scenes: readonly ImageAsset[]
  ui: readonly ImageAsset[]
  memories: readonly ImageAsset[]
  bowls: readonly ImageAsset[]
}

export const PLACEHOLDER_RESOURCE_RULES = {
  filename: 'Use lowercase kebab-case and end temporary assets with `-placeholder`.',
  palette: 'Keep pale blue sky as the main background with Morandi accent colors.',
  privacy: 'Memory files are owner-provided placeholders only; do not invent private text.',
  replacement: 'Keep asset keys stable when replacing placeholder files with final art.',
} as const

export const MORANDI_PALETTE = {
  skyTop: 0xd8edf4,
  skyBottom: 0xe8f2ef,
  cloud: 0xf8fbf9,
  dustyBlue: 0x8fb2bf,
  sageGreen: 0xb7c9bd,
  warmBeige: 0xf4eadc,
  mistPink: 0xd9b7b1,
  slateText: '#385867',
  mutedText: '#50676f',
  errorText: '#8a5d63',
} as const

export const GAME_ASSET_MANIFEST = {
  characters: [
    {
      kind: 'atlas',
      category: 'characters',
      key: ASSET_KEYS.blackSugar,
      placeholder: true,
      purpose: 'preload',
      description: 'Brown Sugar character placeholder atlas for boot and preview scenes.',
      textureUrl: new URL(
        '../../../assets/characters/black-sugar-sprite-sheet-v1.png',
        import.meta.url,
      ).href,
      atlasUrl: new URL(
        '../../../assets/characters/black-sugar-sprite-sheet-v1.json',
        import.meta.url,
      ).href,
      frames: Object.values(BLACK_SUGAR_FRAMES),
    },
  ],
  scenes: [
    {
      kind: 'image',
      category: 'scenes',
      key: ASSET_KEYS.paleBlueSky,
      placeholder: true,
      purpose: 'preload',
      description: 'Pale blue sky placeholder background for the current GameScene.',
      url: new URL('../../../assets/scenes/pale-blue-sky-placeholder.png', import.meta.url)
        .href,
    },
  ],
  ui: [
    {
      kind: 'image',
      category: 'ui',
      key: ASSET_KEYS.loadingPanel,
      placeholder: true,
      purpose: 'preload',
      description: 'Soft loading panel placeholder for Phaser preload UI.',
      url: new URL('../../../assets/ui/loading-panel-placeholder.png', import.meta.url).href,
    },
  ],
  memories: [],
  bowls: [
    {
      kind: 'image',
      category: 'bowls',
      key: ASSET_KEYS.mbtiGlassBowls,
      placeholder: true,
      purpose: 'preload',
      description: 'MBTI glass bowl placeholder sheet for future ending previews.',
      url: new URL('../../../assets/bowls/mbti-glass-bowls-sheet-v1.png', import.meta.url)
        .href,
    },
  ],
} as const satisfies GameAssetManifest

export function getPreloadAssets(): readonly GameAsset[] {
  return [
    ...GAME_ASSET_MANIFEST.characters,
    ...GAME_ASSET_MANIFEST.scenes,
    ...GAME_ASSET_MANIFEST.ui,
    ...GAME_ASSET_MANIFEST.memories,
    ...GAME_ASSET_MANIFEST.bowls,
  ]
}

export function getAssetUrlSummary(asset: GameAsset): readonly string[] {
  if (asset.kind === 'atlas') {
    return [asset.textureUrl, asset.atlasUrl]
  }

  return [asset.url]
}

export function getAssetLabel(asset: GameAsset): string {
  return `${asset.category}/${asset.key}`
}
