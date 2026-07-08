export const ASSET_KEYS = {
  blackSugar: 'black-sugar',
  paleBlueSky: 'scene-pale-blue-sky',
  loadingPanel: 'ui-loading-panel',
  mbtiGlassBowls: 'bowls-mbti-glass-sheet',
  softChime: 'audio-soft-chime',
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

type AssetCategory = 'characters' | 'scenes' | 'ui' | 'memories' | 'bowls' | 'audio'

type BaseAsset = {
  key: string
  category: AssetCategory
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

export type AudioAsset = BaseAsset & {
  kind: 'audio'
  urls: readonly string[]
}

export type GameAsset = AtlasAsset | ImageAsset | AudioAsset

type GameAssetManifest = {
  characters: readonly AtlasAsset[]
  scenes: readonly ImageAsset[]
  ui: readonly ImageAsset[]
  memories: readonly ImageAsset[]
  bowls: readonly ImageAsset[]
  audio: readonly AudioAsset[]
}

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
} as const

export const GAME_ASSET_MANIFEST = {
  characters: [
    {
      kind: 'atlas',
      category: 'characters',
      key: ASSET_KEYS.blackSugar,
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
      url: new URL('../../../assets/scenes/pale-blue-sky-placeholder.png', import.meta.url)
        .href,
    },
  ],
  ui: [
    {
      kind: 'image',
      category: 'ui',
      key: ASSET_KEYS.loadingPanel,
      url: new URL('../../../assets/ui/loading-panel-placeholder.png', import.meta.url).href,
    },
  ],
  memories: [],
  bowls: [
    {
      kind: 'image',
      category: 'bowls',
      key: ASSET_KEYS.mbtiGlassBowls,
      url: new URL('../../../assets/bowls/mbti-glass-bowls-sheet-v1.png', import.meta.url)
        .href,
    },
  ],
  audio: [
    {
      kind: 'audio',
      category: 'audio',
      key: ASSET_KEYS.softChime,
      urls: [
        new URL('../../../assets/audio/soft-chime-placeholder.wav', import.meta.url).href,
      ],
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
    ...GAME_ASSET_MANIFEST.audio,
  ]
}
