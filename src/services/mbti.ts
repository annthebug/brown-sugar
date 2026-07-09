import { ASSET_KEYS } from '../game/assets/assetManifest'

export type MbtiDimension = 'EI' | 'SN' | 'TF' | 'JP'
export type MbtiScores = Record<MbtiDimension, number>

export const MBTI_TYPES = [
  'ISTJ',
  'ISFJ',
  'INFJ',
  'INTJ',
  'ISTP',
  'ISFP',
  'INFP',
  'INTP',
  'ESTP',
  'ESFP',
  'ENFP',
  'ENTP',
  'ESTJ',
  'ESFJ',
  'ENFJ',
  'ENTJ',
] as const

export type MbtiType = (typeof MBTI_TYPES)[number]

const MBTI_GRID_ORDER: readonly (readonly MbtiType[])[] = [
  ['ISTJ', 'ISFJ', 'INFJ', 'INTJ'],
  ['ISTP', 'ISFP', 'INFP', 'INTP'],
  ['ESTP', 'ESFP', 'ENFP', 'ENTP'],
  ['ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'],
]

export const MBTI_BOWL_NAMES: Record<MbtiType, string> = {
  ISTJ: '物流師之碗',
  ISFJ: '守護者之碗',
  INFJ: '提倡者之碗',
  INTJ: '策士之碗',
  ISTP: '巧匠之碗',
  ISFP: '冒險家之碗',
  INFP: '夢想家之碗',
  INTP: '思考者之碗',
  ESTP: '企業家之碗',
  ESFP: '表演者之碗',
  ENFP: '競選者之碗',
  ENTP: '辯論家之碗',
  ESTJ: '總經理之碗',
  ESFJ: '執政官之碗',
  ENFJ: '主人公之碗',
  ENTJ: '指揮官之碗',
}

export const MBTI_BOWL_SHEET_URL = new URL(
  '../../assets/bowls/mbti-glass-bowls-sheet-v1.png',
  import.meta.url,
).href

export function calculateMbtiType(scores: MbtiScores): MbtiType {
  const energy = scores.EI >= 0 ? 'E' : 'I'
  const perception = scores.SN >= 0 ? 'S' : 'N'
  const judgment = scores.TF >= 0 ? 'T' : 'F'
  const lifestyle = scores.JP >= 0 ? 'J' : 'P'

  const type = `${energy}${perception}${judgment}${lifestyle}`

  if (!isMbtiType(type)) {
    throw new Error(`Invalid MBTI type calculated: ${type}`)
  }

  return type
}

export function isMbtiType(value: string): value is MbtiType {
  return MBTI_TYPES.includes(value as MbtiType)
}

export function getBowlIdForType(type: MbtiType): string {
  return type
}

export function getBowlAssetKey(): string {
  return ASSET_KEYS.mbtiGlassBowls
}

export function getBowlGridPosition(type: MbtiType): { row: number; col: number } {
  for (let row = 0; row < MBTI_GRID_ORDER.length; row += 1) {
    const columns = MBTI_GRID_ORDER[row]
    const col = columns.indexOf(type)

    if (col >= 0) {
      return { row, col }
    }
  }

  throw new Error(`No bowl grid position found for MBTI type: ${type}`)
}

export function getBowlSheetBackgroundPosition(type: MbtiType): string {
  const { row, col } = getBowlGridPosition(type)
  const x = col === 0 ? 0 : (col / 3) * 100
  const y = row === 0 ? 0 : (row / 3) * 100

  return `${x}% ${y}%`
}
