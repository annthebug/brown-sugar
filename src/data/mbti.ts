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
    npc: '森林長者',
    prompt: '如果森林忽然安靜下來，你會怎麼找到前行的方向呢？',
    preferences: { first: 'E', second: 'I' },
  },
  {
    id: 'forest-ei-02',
    chapter: 1,
    dimension: 'EI',
    npc: '森林長者',
    prompt: '當眼前出現一條新的小路時，你最先會怎麼做？',
    preferences: { first: 'E', second: 'I' },
  },
  {
    id: 'forest-sn-01',
    chapter: 1,
    dimension: 'SN',
    npc: '森林長者',
    prompt: '一塊覆著青苔的石頭標記著路徑。你最先注意到什麼呢？',
    preferences: { first: 'S', second: 'N' },
  },
  {
    id: 'forest-sn-02',
    chapter: 1,
    dimension: 'SN',
    npc: '森林長者',
    prompt: '長者攤開兩顆漿果。你的第一個念頭會是什麼？',
    preferences: { first: 'S', second: 'N' },
  },
  {
    id: 'forest-sn-03',
    chapter: 1,
    dimension: 'SN',
    npc: '森林長者',
    prompt: '雨水讓前方的腳印變得模糊柔軟。你會怎麼讀懂它們呢？',
    preferences: { first: 'S', second: 'N' },
  },
  // Chapter 2 — City (T/F, J/P)
  {
    id: 'city-tf-01',
    chapter: 2,
    dimension: 'TF',
    npc: '咖啡師',
    prompt: '如果朋友錯過了最後一班電車，你會先說什麼呢？',
    preferences: { first: 'T', second: 'F' },
  },
  {
    id: 'city-tf-02',
    chapter: 2,
    dimension: 'TF',
    npc: '咖啡師',
    prompt: '眼前有兩個都行得通的方案，你會怎麼選呢？',
    preferences: { first: 'T', second: 'F' },
  },
  {
    id: 'city-tf-03',
    chapter: 2,
    dimension: 'TF',
    npc: '咖啡師',
    prompt: '深夜收到一則訊息時，什麼對你來說更重要呢？',
    preferences: { first: 'T', second: 'F' },
  },
  {
    id: 'city-jp-01',
    chapter: 2,
    dimension: 'JP',
    npc: '旅人',
    prompt: '午後忽然多出一段自由時間，你覺得怎樣最剛好呢？',
    preferences: { first: 'J', second: 'P' },
  },
  {
    id: 'city-jp-02',
    chapter: 2,
    dimension: 'JP',
    npc: '旅人',
    prompt: '一家舒服的小咖啡館裡只剩一個空位，你會怎麼決定呢？',
    preferences: { first: 'J', second: 'P' },
  },
  // Chapter 3 — Snow Mountain (S/N, E/I)
  {
    id: 'snow-sn-01',
    chapter: 3,
    dimension: 'SN',
    npc: '雪山嚮導',
    prompt: '白雪蓋住了舊有的腳印。這時候，你會相信什麼呢？',
    preferences: { first: 'S', second: 'N' },
  },
  {
    id: 'snow-sn-02',
    chapter: 3,
    dimension: 'SN',
    npc: '雪山嚮導',
    prompt: '山風悄悄改變了雪堆的形狀。你會注意到什麼呢？',
    preferences: { first: 'S', second: 'N' },
  },
  {
    id: 'snow-ei-01',
    chapter: 3,
    dimension: 'EI',
    npc: '雪山嚮導',
    prompt: '遠方亮著一盞小燈。你會怎麼做呢？',
    preferences: { first: 'E', second: 'I' },
  },
  {
    id: 'snow-ei-02',
    chapter: 3,
    dimension: 'EI',
    npc: '雪山嚮導',
    prompt: '山中的小屋暖暖的。你會選擇坐在哪裡呢？',
    preferences: { first: 'E', second: 'I' },
  },
  // Chapter 4 — Glass Studio (T/F, J/P)
  {
    id: 'glass-tf-01',
    chapter: 4,
    dimension: 'TF',
    npc: '玻璃師傅',
    prompt: '一只碗出現了一道細細的小裂痕。對你來說，最重要的是什麼呢？',
    preferences: { first: 'T', second: 'F' },
  },
  {
    id: 'glass-tf-02',
    chapter: 4,
    dimension: 'TF',
    npc: '玻璃師傅',
    prompt: '有兩種釉色都能完成這只碗，你會怎麼決定呢？',
    preferences: { first: 'T', second: 'F' },
  },
  {
    id: 'glass-jp-01',
    chapter: 4,
    dimension: 'JP',
    npc: '玻璃師傅',
    prompt: '窯燒的時程忽然改變了。你會怎麼回應呢？',
    preferences: { first: 'J', second: 'P' },
  },
  {
    id: 'glass-jp-02',
    chapter: 4,
    dimension: 'JP',
    npc: '玻璃師傅',
    prompt: '玻璃上浮現了新的紋路。你會怎麼做呢？',
    preferences: { first: 'J', second: 'P' },
  },
  // Chapter 5 — Retry / Final (mixed)
  {
    id: 'final-tf-01',
    chapter: 5,
    dimension: 'TF',
    npc: '內在嚮導',
    prompt: '你已經快要找回那只碗了。是什麼讓你的腳步穩下來呢？',
    preferences: { first: 'T', second: 'F' },
  },
  {
    id: 'final-jp-01',
    chapter: 5,
    dimension: 'JP',
    npc: '內在嚮導',
    prompt: '最後一段路分成了兩個方向。你會怎麼繼續往前呢？',
    preferences: { first: 'J', second: 'P' },
  },
  {
    id: 'final-ei-01',
    chapter: 5,
    dimension: 'EI',
    npc: '內在嚮導',
    prompt: '在那只碗回到你身邊之前，你想讓誰陪著你呢？',
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
