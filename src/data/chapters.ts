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
    eyebrow: 'Chapter 1 · Forest',
    title: 'Pale Blue Sky Forest',
    hint: 'Find the Giant Jar',
  },
  City: {
    eyebrow: 'Chapter 2 · City',
    title: 'Pale Blue Sky City',
    hint: 'Meet Time Monster at the metro',
  },
  'Snow Mountain': {
    eyebrow: 'Chapter 3 · Snow Mountain',
    title: 'Pale Blue Sky Snow',
    hint: 'Follow the spirit light to Snow Spirit',
  },
  'Glass Studio': {
    eyebrow: 'Chapter 4 · Glass Studio',
    title: 'Pale Blue Sky Studio',
    hint: 'Shape the first bowl',
  },
  Retry: {
    eyebrow: 'Chapter 5 · Retry',
    title: 'Pale Blue Sky Retry',
    hint: 'Face Inner Doubt',
  },
  'Final Stage': {
    eyebrow: 'Final Stage',
    title: 'Pale Blue Sky Finale',
    hint: 'Release Perfectionism',
  },
}
