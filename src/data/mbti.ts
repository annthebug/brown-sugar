export type MbtiDimension = 'EI' | 'SN' | 'TF' | 'JP'
export type MbtiPreferenceLetter = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P'
export type MbtiChapter = 1 | 2 | 3 | 4 | 5

export type MbtiQuestion = {
  id: string
  chapter: MbtiChapter
  dimension: MbtiDimension
  npc: string
  prompt: string
  preferences: {
    first: MbtiPreferenceLetter
    second: MbtiPreferenceLetter
  }
}

export const MBTI_QUESTIONS = [
  // Chapter 1 — Forest (E/I, S/N)
  {
    id: 'forest-ei-01',
    chapter: 1,
    dimension: 'EI',
    npc: 'Forest Elder',
    prompt: 'If the forest turns quiet, how would you find your way?',
    preferences: { first: 'E', second: 'I' },
  },
  {
    id: 'forest-ei-02',
    chapter: 1,
    dimension: 'EI',
    npc: 'Forest Elder',
    prompt: 'When a new trail appears, what do you do first?',
    preferences: { first: 'E', second: 'I' },
  },
  {
    id: 'forest-sn-01',
    chapter: 1,
    dimension: 'SN',
    npc: 'Forest Elder',
    prompt: 'A mossy stone marks the path. What catches your attention?',
    preferences: { first: 'S', second: 'N' },
  },
  {
    id: 'forest-sn-02',
    chapter: 1,
    dimension: 'SN',
    npc: 'Forest Elder',
    prompt: 'The elder shows two berries. Which thought comes first?',
    preferences: { first: 'S', second: 'N' },
  },
  {
    id: 'forest-sn-03',
    chapter: 1,
    dimension: 'SN',
    npc: 'Forest Elder',
    prompt: 'Rain softens the footprints ahead. How do you read them?',
    preferences: { first: 'S', second: 'N' },
  },
  // Chapter 2 — City (T/F, J/P)
  {
    id: 'city-tf-01',
    chapter: 2,
    dimension: 'TF',
    npc: 'City Guide',
    prompt: 'A friend misses the last tram. What do you say first?',
    preferences: { first: 'T', second: 'F' },
  },
  {
    id: 'city-tf-02',
    chapter: 2,
    dimension: 'TF',
    npc: 'City Guide',
    prompt: 'Two plans could work. How do you choose?',
    preferences: { first: 'T', second: 'F' },
  },
  {
    id: 'city-jp-01',
    chapter: 2,
    dimension: 'JP',
    npc: 'City Guide',
    prompt: 'Your afternoon is suddenly free. What sounds best?',
    preferences: { first: 'J', second: 'P' },
  },
  {
    id: 'city-jp-02',
    chapter: 2,
    dimension: 'JP',
    npc: 'City Guide',
    prompt: 'A cozy café has one empty seat. How do you decide?',
    preferences: { first: 'J', second: 'P' },
  },
  // Chapter 3 — Snow Mountain (S/N, E/I)
  {
    id: 'snow-sn-01',
    chapter: 3,
    dimension: 'SN',
    npc: 'Snow Spirit',
    prompt: 'Snow hides the old steps. What do you trust?',
    preferences: { first: 'S', second: 'N' },
  },
  {
    id: 'snow-sn-02',
    chapter: 3,
    dimension: 'SN',
    npc: 'Snow Spirit',
    prompt: 'The wind shifts the drifts. What do you notice?',
    preferences: { first: 'S', second: 'N' },
  },
  {
    id: 'snow-ei-01',
    chapter: 3,
    dimension: 'EI',
    npc: 'Snow Spirit',
    prompt: 'A lantern glows in the distance. What do you do?',
    preferences: { first: 'E', second: 'I' },
  },
  {
    id: 'snow-ei-02',
    chapter: 3,
    dimension: 'EI',
    npc: 'Snow Spirit',
    prompt: 'The mountain shelter feels warm. Where do you settle?',
    preferences: { first: 'E', second: 'I' },
  },
  // Chapter 4 — Glass Studio (T/F, J/P)
  {
    id: 'glass-tf-01',
    chapter: 4,
    dimension: 'TF',
    npc: 'Glass Master',
    prompt: 'A bowl develops a tiny crack. What matters most?',
    preferences: { first: 'T', second: 'F' },
  },
  {
    id: 'glass-tf-02',
    chapter: 4,
    dimension: 'TF',
    npc: 'Glass Master',
    prompt: 'Two glazes could finish the bowl. How do you decide?',
    preferences: { first: 'T', second: 'F' },
  },
  {
    id: 'glass-jp-01',
    chapter: 4,
    dimension: 'JP',
    npc: 'Glass Master',
    prompt: 'The kiln schedule changes. How do you respond?',
    preferences: { first: 'J', second: 'P' },
  },
  {
    id: 'glass-jp-02',
    chapter: 4,
    dimension: 'JP',
    npc: 'Glass Master',
    prompt: 'A new pattern appears in the glass. What do you do?',
    preferences: { first: 'J', second: 'P' },
  },
  // Chapter 5 — Retry / Final (mixed)
  {
    id: 'final-tf-01',
    chapter: 5,
    dimension: 'TF',
    npc: 'Inner Guide',
    prompt: 'You almost have the bowl. What steadies your paws?',
    preferences: { first: 'T', second: 'F' },
  },
  {
    id: 'final-jp-01',
    chapter: 5,
    dimension: 'JP',
    npc: 'Inner Guide',
    prompt: 'The last path splits twice. How do you move forward?',
    preferences: { first: 'J', second: 'P' },
  },
  {
    id: 'final-ei-01',
    chapter: 5,
    dimension: 'EI',
    npc: 'Inner Guide',
    prompt: 'Before the bowl returns, who do you want beside you?',
    preferences: { first: 'E', second: 'I' },
  },
] as const satisfies readonly MbtiQuestion[]

export type MbtiQuestionId = (typeof MBTI_QUESTIONS)[number]['id']

export const MBTI_QUESTION_COUNT = MBTI_QUESTIONS.length

export const MBTI_QUESTIONS_BY_ID: Readonly<Record<MbtiQuestionId, MbtiQuestion>> =
  Object.fromEntries(MBTI_QUESTIONS.map((question) => [question.id, question])) as Record<
    MbtiQuestionId,
    MbtiQuestion
  >

export function getQuestionsByChapter(chapter: MbtiChapter): readonly MbtiQuestion[] {
  return MBTI_QUESTIONS.filter((question) => question.chapter === chapter)
}

export function getQuestionById(id: string): MbtiQuestion | undefined {
  return MBTI_QUESTIONS_BY_ID[id as MbtiQuestionId]
}
