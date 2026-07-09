import type { Chapter } from '../stores/useGameStore'

export type SceneKey = 'ForestScene' | 'GameScene'

export const CHAPTER_SCENE_MAP: Record<Chapter, SceneKey> = {
  Forest: 'ForestScene',
  City: 'ForestScene',
  'Snow Mountain': 'ForestScene',
  'Glass Studio': 'ForestScene',
  Retry: 'ForestScene',
  'Final Stage': 'ForestScene',
}

export function getSceneKeyForChapter(chapter: Chapter): SceneKey {
  return CHAPTER_SCENE_MAP[chapter]
}

export function getGameRouteForChapter(chapter: Chapter) {
  return `/game?chapter=${encodeURIComponent(chapter)}`
}

export function hasContinuableProgress(input: {
  currentChapter: Chapter
  memoryShards: number
  totalMemoryShards: number
  forestChapterCleared: boolean
}) {
  return (
    input.totalMemoryShards > 0 ||
    input.memoryShards > 0 ||
    input.forestChapterCleared ||
    input.currentChapter !== 'Forest'
  )
}
