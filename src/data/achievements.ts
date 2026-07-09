export type AchievementId =
  | 'first-shard'
  | 'first-memory'
  | 'forest-chapter'
  | 'all-memories'
  | 'mbti-complete'
  | 'journey-complete'

export type AchievementDefinition = {
  id: AchievementId
  title: string
  description: string
}

export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  {
    id: 'first-shard',
    title: 'Morning Spark',
    description: 'Collect the first Memory Shard beneath the gentle sky.',
  },
  {
    id: 'first-memory',
    title: 'Soft Reflection',
    description: 'Unlock the first memory and let a warm scene return.',
  },
  {
    id: 'forest-chapter',
    title: 'Forest Promise',
    description: 'Complete the forest chapter and continue the journey with Black Sugar.',
  },
  {
    id: 'all-memories',
    title: 'Album of Us',
    description: 'Unlock every memory and fill the album with shared moments.',
  },
  {
    id: 'mbti-complete',
    title: 'Heart in Full Bloom',
    description: 'Finish every hidden MBTI conversation along the road.',
  },
  {
    id: 'journey-complete',
    title: 'Perfect Bowl, Gentle Home',
    description: 'Reach the ending and bring the glass matcha bowl home.',
  },
]

export const ACHIEVEMENT_MAP = new Map(
  ACHIEVEMENT_DEFINITIONS.map((achievement) => [achievement.id, achievement]),
)
