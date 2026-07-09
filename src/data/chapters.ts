import type { Chapter } from '../stores/useGameStore'

export type SceneKey =
  | 'ForestScene'
  | 'CityScene'
  | 'SnowMountainScene'
  | 'GlassStudioScene'
  | 'RetryScene'
  | 'FinalScene'
  | 'GameScene'

export const CHAPTER_SCENE_MAP: Record<Chapter, SceneKey> = {
  Forest: 'ForestScene',
  City: 'CityScene',
  'Snow Mountain': 'SnowMountainScene',
  'Glass Studio': 'GlassStudioScene',
  Retry: 'RetryScene',
  'Final Stage': 'FinalScene',
}

const CHAPTER_ORDER: readonly Chapter[] = [
  'Forest',
  'City',
  'Snow Mountain',
  'Glass Studio',
  'Retry',
  'Final Stage',
]

export function isChapter(value: string | null | undefined): value is Chapter {
  return CHAPTER_ORDER.includes(value as Chapter)
}

export function getSceneKeyForChapter(chapter: Chapter): SceneKey {
  return CHAPTER_SCENE_MAP[chapter]
}

export function getPlayableChapter(input: {
  requestedChapter: Chapter | null
  currentChapter: Chapter
  forestChapterCleared: boolean
  cityChapterCleared: boolean
  snowChapterCleared: boolean
  glassChapterCleared: boolean
  retryChapterCleared: boolean
}): Chapter {
  if (!input.forestChapterCleared) {
    return 'Forest'
  }

  if (!input.cityChapterCleared) {
    if (input.requestedChapter === 'City') {
      return 'City'
    }

    return 'City'
  }

  if (!input.snowChapterCleared) {
    if (input.requestedChapter === 'Snow Mountain') {
      return 'Snow Mountain'
    }

    return 'Snow Mountain'
  }

  if (!input.glassChapterCleared) {
    if (input.requestedChapter === 'Glass Studio') {
      return 'Glass Studio'
    }

    return 'Glass Studio'
  }

  if (!input.retryChapterCleared) {
    if (input.requestedChapter === 'Retry') {
      return 'Retry'
    }

    return 'Retry'
  }

  if (input.requestedChapter && isChapter(input.requestedChapter)) {
    return input.requestedChapter
  }

  return input.currentChapter
}

export function getGameRouteForChapter(chapter: Chapter) {
  return `/game?chapter=${encodeURIComponent(chapter)}`
}

export function hasContinuableProgress(input: {
  currentChapter: Chapter
  memoryShards: number
  totalMemoryShards: number
  forestChapterCleared: boolean
  cityChapterCleared?: boolean
  snowChapterCleared?: boolean
  glassChapterCleared?: boolean
  retryChapterCleared?: boolean
}) {
  return (
    input.totalMemoryShards > 0 ||
    input.memoryShards > 0 ||
    input.forestChapterCleared ||
    input.cityChapterCleared === true ||
    input.snowChapterCleared === true ||
    input.glassChapterCleared === true ||
    input.retryChapterCleared === true ||
    input.currentChapter !== 'Forest'
  )
}

export const CHAPTER_LABELS: Record<Chapter, { eyebrow: string; title: string; hint: string }> = {
  Forest: {
    eyebrow: '第一章・森林',
    title: '淡藍天空森林',
    hint: '找到巨罐並理解它',
  },
  City: {
    eyebrow: '第二章・城市',
    title: '淡藍天空城市',
    hint: '在月台遇見時間怪物',
  },
  'Snow Mountain': {
    eyebrow: '第三章・雪山',
    title: '淡藍天空雪原',
    hint: '跟著靈光找到雪靈',
  },
  'Glass Studio': {
    eyebrow: '第四章・玻璃工坊',
    title: '淡藍天空工坊',
    hint: '吹出第一只碗',
  },
  Retry: {
    eyebrow: '第五章・再試一次',
    title: '淡藍天空再試一次',
    hint: '面對內在懷疑',
  },
  'Final Stage': {
    eyebrow: '最終章',
    title: '淡藍天空終章',
    hint: '放下完美主義',
  },
}

export const CHAPTER_DISPLAY_NAMES: Record<Chapter, string> = {
  Forest: '森林',
  City: '城市',
  'Snow Mountain': '雪山',
  'Glass Studio': '玻璃工坊',
  Retry: '再試一次',
  'Final Stage': '最終章',
}
