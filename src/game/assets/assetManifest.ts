import blackSugarTextureUrl from '../../../assets/characters/black-sugar-sprite-sheet-v1.png'
import blackSugarAtlasUrl from '../../../assets/characters/black-sugar-sprite-sheet-v1.json?url'
import forestElderTextureUrl from '../../../assets/characters/forest-elder-sprite-sheet-v1.png'
import forestElderAtlasUrl from '../../../assets/characters/forest-elder-sprite-sheet-v1.json?url'
import forestElderSideTextureUrl from '../../../assets/characters/forest-elder-side-sprite-sheet-v1.png'
import forestElderSideAtlasUrl from '../../../assets/characters/forest-elder-side-sprite-sheet-v1.json?url'
import cityBaristaTextureUrl from '../../../assets/characters/city-barista-side-sprite-sheet-v1.png'
import cityBaristaAtlasUrl from '../../../assets/characters/city-barista-side-sprite-sheet-v1.json?url'
import parkTravelerTextureUrl from '../../../assets/characters/park-traveler-side-sprite-sheet-v1.png'
import parkTravelerAtlasUrl from '../../../assets/characters/park-traveler-side-sprite-sheet-v1.json?url'
import snowGuideTextureUrl from '../../../assets/characters/snow-guide-side-sprite-sheet-v1.png'
import snowGuideAtlasUrl from '../../../assets/characters/snow-guide-side-sprite-sheet-v1.json?url'
import glassMasterTextureUrl from '../../../assets/characters/glass-master-side-sprite-sheet-v1.png'
import glassMasterAtlasUrl from '../../../assets/characters/glass-master-side-sprite-sheet-v1.json?url'
import innerGuideTextureUrl from '../../../assets/characters/inner-guide-side-sprite-sheet-v1.png'
import innerGuideAtlasUrl from '../../../assets/characters/inner-guide-side-sprite-sheet-v1.json?url'
import giantCanTextureUrl from '../../../assets/characters/giant-can-sprite-sheet-v1.png'
import giantCanAtlasUrl from '../../../assets/characters/giant-can-sprite-sheet-v1.json?url'
import timeMonsterTextureUrl from '../../../assets/characters/time-monster-sprite-sheet-v1.png'
import timeMonsterAtlasUrl from '../../../assets/characters/time-monster-sprite-sheet-v1.json?url'
import snowSpiritTextureUrl from '../../../assets/characters/snow-spirit-sprite-sheet-v1.png'
import snowSpiritAtlasUrl from '../../../assets/characters/snow-spirit-sprite-sheet-v1.json?url'
import glassMasterBossTextureUrl from '../../../assets/characters/glass-master-boss-sprite-sheet-v1.png'
import glassMasterBossAtlasUrl from '../../../assets/characters/glass-master-boss-sprite-sheet-v1.json?url'
import innerDoubtTextureUrl from '../../../assets/characters/inner-doubt-sprite-sheet-v1.png'
import innerDoubtAtlasUrl from '../../../assets/characters/inner-doubt-sprite-sheet-v1.json?url'
import npcTextureUrl from '../../../assets/characters/npc-sprite-sheet-v1.png'
import npcAtlasUrl from '../../../assets/characters/npc-sprite-sheet-v1.json?url'
import bossTextureUrl from '../../../assets/characters/boss-sprite-sheet-v1.png'
import bossAtlasUrl from '../../../assets/characters/boss-sprite-sheet-v1.json?url'
import paleBlueSkyUrl from '../../../assets/scenes/pale-blue-sky-placeholder.png'
import loadingPanelUrl from '../../../assets/ui/loading-panel-placeholder.png'
import mbtiGlassBowlsUrl from '../../../assets/bowls/mbti-glass-bowls-sheet-v1.png'

export const ASSET_KEYS = {
  blackSugar: 'black-sugar',
  forestElder: 'forest-elder',
  forestElderSide: 'forest-elder-side',
  cityBarista: 'city-barista',
  parkTraveler: 'park-traveler',
  snowGuide: 'snow-guide',
  glassMaster: 'glass-master',
  innerGuide: 'inner-guide',
  giantCan: 'giant-can',
  timeMonster: 'time-monster',
  snowSpirit: 'snow-spirit',
  glassMasterBoss: 'glass-master-boss',
  innerDoubt: 'inner-doubt',
  npcCharacters: 'npc-characters',
  bossCharacters: 'boss-characters',
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

export const FOREST_ELDER_FRAMES = {
  downIdle: 'forest-elder-down-idle',
  downWalk1: 'forest-elder-down-walk-1',
  downWalk2: 'forest-elder-down-walk-2',
  downWalk3: 'forest-elder-down-walk-3',
  upIdle: 'forest-elder-up-idle',
  upWalk1: 'forest-elder-up-walk-1',
  upWalk2: 'forest-elder-up-walk-2',
  upWalk3: 'forest-elder-up-walk-3',
  leftIdle: 'forest-elder-left-idle',
  leftWalk1: 'forest-elder-left-walk-1',
  leftWalk2: 'forest-elder-left-walk-2',
  leftWalk3: 'forest-elder-left-walk-3',
  rightIdle: 'forest-elder-right-idle',
  rightWalk1: 'forest-elder-right-walk-1',
  rightWalk2: 'forest-elder-right-walk-2',
  rightWalk3: 'forest-elder-right-walk-3',
} as const

export const FOREST_ELDER_SIDE_FRAMES = {
  sideIdle: 'forest-elder-side-idle',
  sideWalk1: 'forest-elder-side-walk-1',
  sideWalk2: 'forest-elder-side-walk-2',
  sideWalk3: 'forest-elder-side-walk-3',
} as const

export const CITY_BARISTA_FRAMES = {
  sideIdle: 'city-barista-side-idle',
  sideWalk1: 'city-barista-side-walk-1',
  sideWalk2: 'city-barista-side-walk-2',
  sideWalk3: 'city-barista-side-walk-3',
} as const

export const PARK_TRAVELER_FRAMES = {
  sideIdle: 'park-traveler-side-idle',
  sideWalk1: 'park-traveler-side-walk-1',
  sideWalk2: 'park-traveler-side-walk-2',
  sideWalk3: 'park-traveler-side-walk-3',
} as const

export const SNOW_GUIDE_FRAMES = {
  sideIdle: 'snow-guide-side-idle',
  sideWalk1: 'snow-guide-side-walk-1',
  sideWalk2: 'snow-guide-side-walk-2',
  sideWalk3: 'snow-guide-side-walk-3',
} as const

export const GLASS_MASTER_FRAMES = {
  sideIdle: 'glass-master-side-idle',
  sideWalk1: 'glass-master-side-walk-1',
  sideWalk2: 'glass-master-side-walk-2',
  sideWalk3: 'glass-master-side-walk-3',
} as const

export const INNER_GUIDE_FRAMES = {
  sideIdle: 'inner-guide-side-idle',
  sideWalk1: 'inner-guide-side-walk-1',
  sideWalk2: 'inner-guide-side-walk-2',
  sideWalk3: 'inner-guide-side-walk-3',
} as const

export const GIANT_CAN_FRAMES = {
  idle: 'giant-can-idle',
  pulse1: 'giant-can-pulse-1',
  pulse2: 'giant-can-pulse-2',
  pulse3: 'giant-can-pulse-3',
} as const

export const TIME_MONSTER_FRAMES = {
  idle: 'time-monster-idle',
  pulse1: 'time-monster-pulse-1',
  pulse2: 'time-monster-pulse-2',
  pulse3: 'time-monster-pulse-3',
} as const

export const SNOW_SPIRIT_FRAMES = {
  idle: 'snow-spirit-idle',
  pulse1: 'snow-spirit-pulse-1',
  pulse2: 'snow-spirit-pulse-2',
  pulse3: 'snow-spirit-pulse-3',
} as const

export const GLASS_MASTER_BOSS_FRAMES = {
  idle: 'glass-master-boss-idle',
  pulse1: 'glass-master-boss-pulse-1',
  pulse2: 'glass-master-boss-pulse-2',
  pulse3: 'glass-master-boss-pulse-3',
} as const

export const INNER_DOUBT_FRAMES = {
  idle: 'inner-doubt-idle',
  pulse1: 'inner-doubt-pulse-1',
  pulse2: 'inner-doubt-pulse-2',
  pulse3: 'inner-doubt-pulse-3',
} as const

export const NPC_FRAMES = {
  forestElder: 'forest-elder-idle',
  coffeeBarista: 'coffee-barista-idle',
  parkTraveler: 'park-traveler-idle',
  snowGuide: 'snow-guide-idle',
  glassMaster: 'glass-master-idle',
  innerVoice: 'inner-voice-idle',
} as const

export const BOSS_FRAMES = {
  giantCan: 'giant-can-idle',
  timeMonster: 'time-monster-idle',
  snowSpirit: 'snow-spirit-idle',
  glassMasterBoss: 'glass-master-boss-idle',
  innerDoubt: 'inner-doubt-idle',
  perfectionism: 'perfectionism-idle',
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
      textureUrl: blackSugarTextureUrl,
      atlasUrl: blackSugarAtlasUrl,
      frames: Object.values(BLACK_SUGAR_FRAMES),
    },
    {
      kind: 'atlas',
      category: 'characters',
      key: ASSET_KEYS.forestElder,
      placeholder: false,
      purpose: 'preload',
      description: 'Forest Elder NPC top-down sprite atlas (idle + 3-frame walk, four directions).',
      textureUrl: forestElderTextureUrl,
      atlasUrl: forestElderAtlasUrl,
      frames: Object.values(FOREST_ELDER_FRAMES),
    },
    {
      kind: 'atlas',
      category: 'characters',
      key: ASSET_KEYS.forestElderSide,
      placeholder: false,
      purpose: 'preload',
      description: 'Forest Elder side-view platformer atlas (idle + 3-frame walk, facing right).',
      textureUrl: forestElderSideTextureUrl,
      atlasUrl: forestElderSideAtlasUrl,
      frames: Object.values(FOREST_ELDER_SIDE_FRAMES),
    },
    {
      kind: 'atlas',
      category: 'characters',
      key: ASSET_KEYS.cityBarista,
      placeholder: false,
      purpose: 'preload',
      description: 'City Barista side-view platformer atlas (idle + 3-frame walk, facing right).',
      textureUrl: cityBaristaTextureUrl,
      atlasUrl: cityBaristaAtlasUrl,
      frames: Object.values(CITY_BARISTA_FRAMES),
    },
    {
      kind: 'atlas',
      category: 'characters',
      key: ASSET_KEYS.parkTraveler,
      placeholder: false,
      purpose: 'preload',
      description: 'Park Traveler side-view platformer atlas (idle + 3-frame walk, facing right).',
      textureUrl: parkTravelerTextureUrl,
      atlasUrl: parkTravelerAtlasUrl,
      frames: Object.values(PARK_TRAVELER_FRAMES),
    },
    {
      kind: 'atlas',
      category: 'characters',
      key: ASSET_KEYS.snowGuide,
      placeholder: false,
      purpose: 'preload',
      description: 'Snow Guide side-view platformer atlas (idle + 3-frame walk, facing right).',
      textureUrl: snowGuideTextureUrl,
      atlasUrl: snowGuideAtlasUrl,
      frames: Object.values(SNOW_GUIDE_FRAMES),
    },
    {
      kind: 'atlas',
      category: 'characters',
      key: ASSET_KEYS.glassMaster,
      placeholder: false,
      purpose: 'preload',
      description: 'Glass Master side-view platformer atlas (idle + 3-frame walk, facing right).',
      textureUrl: glassMasterTextureUrl,
      atlasUrl: glassMasterAtlasUrl,
      frames: Object.values(GLASS_MASTER_FRAMES),
    },
    {
      kind: 'atlas',
      category: 'characters',
      key: ASSET_KEYS.innerGuide,
      placeholder: false,
      purpose: 'preload',
      description: 'Inner Guide side-view platformer atlas (idle + 3-frame walk, facing right).',
      textureUrl: innerGuideTextureUrl,
      atlasUrl: innerGuideAtlasUrl,
      frames: Object.values(INNER_GUIDE_FRAMES),
    },
    {
      kind: 'atlas',
      category: 'characters',
      key: ASSET_KEYS.giantCan,
      placeholder: false,
      purpose: 'preload',
      description: 'Giant Can Forest boss atlas (idle + 3-frame gentle pulse glow, cat-food can).',
      textureUrl: giantCanTextureUrl,
      atlasUrl: giantCanAtlasUrl,
      frames: Object.values(GIANT_CAN_FRAMES),
    },
    {
      kind: 'atlas',
      category: 'characters',
      key: ASSET_KEYS.timeMonster,
      placeholder: false,
      purpose: 'preload',
      description: 'Time Monster City boss atlas (idle + 3-frame pendulum sway / tick glow).',
      textureUrl: timeMonsterTextureUrl,
      atlasUrl: timeMonsterAtlasUrl,
      frames: Object.values(TIME_MONSTER_FRAMES),
    },
    {
      kind: 'atlas',
      category: 'characters',
      key: ASSET_KEYS.snowSpirit,
      placeholder: false,
      purpose: 'preload',
      description: 'Snow Spirit summit boss atlas (idle + 3-frame head bob / white glow pulse, kodama spirit).',
      textureUrl: snowSpiritTextureUrl,
      atlasUrl: snowSpiritAtlasUrl,
      frames: Object.values(SNOW_SPIRIT_FRAMES),
    },
    {
      kind: 'atlas',
      category: 'characters',
      key: ASSET_KEYS.glassMasterBoss,
      placeholder: false,
      purpose: 'preload',
      description: 'Glass Master Boss workshop atlas (idle + 3-frame furnace glow pulse, front-facing artisan).',
      textureUrl: glassMasterBossTextureUrl,
      atlasUrl: glassMasterBossAtlasUrl,
      frames: Object.values(GLASS_MASTER_BOSS_FRAMES),
    },
    {
      kind: 'atlas',
      category: 'characters',
      key: ASSET_KEYS.innerDoubt,
      placeholder: false,
      purpose: 'preload',
      description: 'Inner Doubt Retry boss atlas (idle + 3-frame wobble / blink bounce, soot-sprite cluster).',
      textureUrl: innerDoubtTextureUrl,
      atlasUrl: innerDoubtAtlasUrl,
      frames: Object.values(INNER_DOUBT_FRAMES),
    },
    {
      kind: 'atlas',
      category: 'characters',
      key: ASSET_KEYS.npcCharacters,
      placeholder: true,
      purpose: 'preload',
      description: 'Ghibli-inspired Morandi NPC atlas v2 (Kamaji-style elder, café barista, Kiki-style traveler, hooded guide, glass artisan, river spirit).',
      textureUrl: npcTextureUrl,
      atlasUrl: npcAtlasUrl,
      frames: Object.values(NPC_FRAMES),
    },
    {
      kind: 'atlas',
      category: 'characters',
      key: ASSET_KEYS.bossCharacters,
      placeholder: true,
      purpose: 'preload',
      description: 'Ghibli-inspired Morandi boss atlas v2 (jar spirit, clock spirit, kodama, furnace artisan, soot sprites, mask mist).',
      textureUrl: bossTextureUrl,
      atlasUrl: bossAtlasUrl,
      frames: Object.values(BOSS_FRAMES),
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
      url: paleBlueSkyUrl,
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
      url: loadingPanelUrl,
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
      url: mbtiGlassBowlsUrl,
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
