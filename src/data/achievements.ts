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
    title: '晨光微亮',
    description: '在溫柔天空下收集第一片回憶碎片。',
  },
  {
    id: 'first-memory',
    title: '柔軟倒影',
    description: '解鎖第一段回憶，讓溫暖畫面慢慢回來。',
  },
  {
    id: 'forest-chapter',
    title: '森林約定',
    description: '完成森林章節，和黑糖繼續往前走。',
  },
  {
    id: 'all-memories',
    title: '我們的相簿',
    description: '解鎖所有回憶，讓相簿裝滿共同片刻。',
  },
  {
    id: 'mbti-complete',
    title: '心意盛開',
    description: '完成旅途中所有隱藏的 MBTI 對話。',
  },
  {
    id: 'journey-complete',
    title: '溫柔歸來的碗',
    description: '抵達結局，把玻璃抹茶碗帶回家。',
  },
]

export const ACHIEVEMENT_MAP = new Map(
  ACHIEVEMENT_DEFINITIONS.map((achievement) => [achievement.id, achievement]),
)
