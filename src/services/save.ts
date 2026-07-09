import { useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { ACHIEVEMENT_MAP, type AchievementId } from '../data/achievements'
import { getQuestionById, type MbtiPreferenceLetter } from '../data/mbti'
import { useAchievementStore } from '../stores/useAchievementStore'
import type { Chapter } from '../stores/useGameStore'
import { useGameStore } from '../stores/useGameStore'
import { useGalleryStore } from '../stores/useGalleryStore'
import type { Preference } from '../stores/useMbtiStore'
import { useMbtiStore } from '../stores/useMbtiStore'
import { getBowlIdForType } from './mbti'
import { getFirestoreDb, isFirebaseConfigured } from './firebase'

const SAVE_META_KEY = 'perfect-bowl-save-meta'
const SAVE_USER_KEY = 'perfect-bowl-user-id'

type SaveMeta = {
  userId: string
  saveUpdatedAt: number
  mbtiUpdatedAt: number
}

type SaveDocument = {
  userId: string
  chapter: number
  chapterKey: Chapter
  memoryShards: number
  totalMemoryShards: number
  unlockedMemories: string[]
  achievements: string[]
  storyFlags: {
    hasImperfectBowl: boolean
    hasTrueBowl: boolean
  }
  chapterFlags: {
    forestChapterCleared: boolean
    cityChapterCleared: boolean
    snowChapterCleared: boolean
    glassChapterCleared: boolean
    retryChapterCleared: boolean
  }
  gameCompleted: boolean
  updatedAt: number
}

type MbtiDocument = {
  userId: string
  score: Record<MbtiPreferenceLetter, number>
  answers: Record<string, Preference>
  result?: string
  bowl?: string
  completedAt?: number
  updatedAt: number
}

let started = false
let syncing = false
let syncQueued = false
let debounceHandle: number | null = null
let lastSaveFingerprint = ''
let lastMbtiFingerprint = ''
let isApplyingRemoteState = false

function getDefaultMeta(): SaveMeta {
  return {
    userId: getOrCreateUserId(),
    saveUpdatedAt: 0,
    mbtiUpdatedAt: 0,
  }
}

function getOrCreateUserId() {
  const existing = window.localStorage.getItem(SAVE_USER_KEY)

  if (existing) {
    return existing
  }

  const nextId = window.crypto?.randomUUID?.() ?? `local-${Date.now()}`
  window.localStorage.setItem(SAVE_USER_KEY, nextId)
  return nextId
}

function readMeta(): SaveMeta {
  try {
    const raw = window.localStorage.getItem(SAVE_META_KEY)

    if (!raw) {
      return getDefaultMeta()
    }

    const parsed = JSON.parse(raw) as Partial<SaveMeta>

    return {
      userId: typeof parsed.userId === 'string' && parsed.userId ? parsed.userId : getOrCreateUserId(),
      saveUpdatedAt: typeof parsed.saveUpdatedAt === 'number' ? parsed.saveUpdatedAt : 0,
      mbtiUpdatedAt: typeof parsed.mbtiUpdatedAt === 'number' ? parsed.mbtiUpdatedAt : 0,
    }
  } catch {
    return getDefaultMeta()
  }
}

function writeMeta(meta: SaveMeta) {
  window.localStorage.setItem(SAVE_META_KEY, JSON.stringify(meta))
}

function chapterToNumber(chapter: Chapter) {
  switch (chapter) {
    case 'Forest':
      return 1
    case 'City':
      return 2
    case 'Snow Mountain':
      return 3
    case 'Glass Studio':
      return 4
    case 'Retry':
      return 5
    case 'Final Stage':
      return 6
  }
}

function chapterFromNumber(value: number, fallback: Chapter): Chapter {
  switch (value) {
    case 1:
      return 'Forest'
    case 2:
      return 'City'
    case 3:
      return 'Snow Mountain'
    case 4:
      return 'Glass Studio'
    case 5:
      return 'Retry'
    case 6:
      return 'Final Stage'
    default:
      return fallback
  }
}

function buildSaveDocument(meta: SaveMeta): SaveDocument {
  const game = useGameStore.getState()
  const gallery = useGalleryStore.getState()
  const achievements = useAchievementStore.getState()

  return {
    userId: meta.userId,
    chapter: chapterToNumber(game.currentChapter),
    chapterKey: game.currentChapter,
    memoryShards: game.memoryShards,
    totalMemoryShards: game.totalMemoryShards,
    unlockedMemories: gallery.memories.filter((memory) => memory.unlocked).map((memory) => memory.id),
    achievements: achievements.unlockedIds,
    storyFlags: game.storyFlags,
    chapterFlags: {
      forestChapterCleared: game.forestChapterCleared,
      cityChapterCleared: game.cityChapterCleared,
      snowChapterCleared: game.snowChapterCleared,
      glassChapterCleared: game.glassChapterCleared,
      retryChapterCleared: game.retryChapterCleared,
    },
    gameCompleted: game.gameCompleted,
    updatedAt: meta.saveUpdatedAt,
  }
}

function buildLetterScores(answers: Record<string, Preference>) {
  const score: Record<MbtiPreferenceLetter, number> = {
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
  }

  Object.entries(answers).forEach(([questionId, preference]) => {
    const question = getQuestionById(questionId)

    if (!question) {
      return
    }

    const letter = question.preferences[preference]
    score[letter] += 1
  })

  return score
}

function buildMbtiDocument(meta: SaveMeta): MbtiDocument {
  const mbti = useMbtiStore.getState()
  const result = mbti.getMbtiResult()

  return {
    userId: meta.userId,
    score: buildLetterScores(mbti.answersByQuestionId),
    answers: mbti.answersByQuestionId,
    result: result ?? undefined,
    bowl: result ? getBowlIdForType(result) : undefined,
    completedAt: result ? meta.mbtiUpdatedAt : undefined,
    updatedAt: meta.mbtiUpdatedAt,
  }
}

function getSaveFingerprint() {
  const game = useGameStore.getState()
  const gallery = useGalleryStore.getState()
  const achievements = useAchievementStore.getState()

  return JSON.stringify({
    currentChapter: game.currentChapter,
    forestChapterCleared: game.forestChapterCleared,
    cityChapterCleared: game.cityChapterCleared,
    snowChapterCleared: game.snowChapterCleared,
    glassChapterCleared: game.glassChapterCleared,
    retryChapterCleared: game.retryChapterCleared,
    gameCompleted: game.gameCompleted,
    storyFlags: game.storyFlags,
    memoryShards: game.memoryShards,
    totalMemoryShards: game.totalMemoryShards,
    unlockedMemories: gallery.memories.filter((memory) => memory.unlocked).map((memory) => memory.id),
    achievements: achievements.unlockedIds,
  })
}

function getMbtiFingerprint() {
  const mbti = useMbtiStore.getState()

  return JSON.stringify({
    answeredQuestionIds: mbti.answeredQuestionIds,
    answersByQuestionId: mbti.answersByQuestionId,
    scores: mbti.scores,
  })
}

function hasLocalGameProgress() {
  const game = useGameStore.getState()
  const gallery = useGalleryStore.getState()
  const achievements = useAchievementStore.getState()

  return (
    game.currentChapter !== 'Forest' ||
    game.memoryShards > 0 ||
    game.totalMemoryShards > 0 ||
    game.forestChapterCleared ||
    game.cityChapterCleared ||
    game.snowChapterCleared ||
    game.glassChapterCleared ||
    game.retryChapterCleared ||
    game.gameCompleted ||
    gallery.memories.some((memory) => memory.unlocked) ||
    achievements.unlockedIds.length > 0
  )
}

function hasLocalMbtiProgress() {
  return useMbtiStore.getState().answeredQuestionIds.length > 0
}

function ensureInitialMeta() {
  const meta = readMeta()
  let changed = false
  const now = Date.now()

  if (meta.saveUpdatedAt === 0 && hasLocalGameProgress()) {
    meta.saveUpdatedAt = now
    changed = true
  }

  if (meta.mbtiUpdatedAt === 0 && hasLocalMbtiProgress()) {
    meta.mbtiUpdatedAt = now
    changed = true
  }

  if (changed) {
    writeMeta(meta)
  }

  return meta
}

function applyRemoteSaveDocument(saveDoc: SaveDocument) {
  const currentGame = useGameStore.getState()
  const currentGallery = useGalleryStore.getState()
  const currentAchievements = useAchievementStore.getState()

  useGameStore.setState({
    ...currentGame,
    currentChapter: saveDoc.chapterKey ?? chapterFromNumber(saveDoc.chapter, currentGame.currentChapter),
    forestChapterCleared: saveDoc.chapterFlags?.forestChapterCleared ?? currentGame.forestChapterCleared,
    cityChapterCleared: saveDoc.chapterFlags?.cityChapterCleared ?? currentGame.cityChapterCleared,
    snowChapterCleared: saveDoc.chapterFlags?.snowChapterCleared ?? currentGame.snowChapterCleared,
    glassChapterCleared: saveDoc.chapterFlags?.glassChapterCleared ?? currentGame.glassChapterCleared,
    retryChapterCleared: saveDoc.chapterFlags?.retryChapterCleared ?? currentGame.retryChapterCleared,
    gameCompleted: saveDoc.gameCompleted ?? currentGame.gameCompleted,
    storyFlags: {
      hasImperfectBowl: saveDoc.storyFlags?.hasImperfectBowl ?? currentGame.storyFlags.hasImperfectBowl,
      hasTrueBowl: saveDoc.storyFlags?.hasTrueBowl ?? currentGame.storyFlags.hasTrueBowl,
    },
    memoryShards: saveDoc.memoryShards,
    totalMemoryShards: saveDoc.totalMemoryShards ?? currentGame.totalMemoryShards,
  })

  useGalleryStore.setState({
    ...currentGallery,
    memories: currentGallery.memories.map((memory) => ({
      ...memory,
      unlocked: saveDoc.unlockedMemories.includes(memory.id) ? true : memory.unlocked,
      unlockedAt:
        saveDoc.unlockedMemories.includes(memory.id) && !memory.unlockedAt
          ? new Date(saveDoc.updatedAt).toISOString()
          : memory.unlockedAt,
    })),
  })

  useAchievementStore.setState({
    ...currentAchievements,
    unlockedIds: (saveDoc.achievements ?? []).filter(
      (achievementId): achievementId is AchievementId =>
        typeof achievementId === 'string' && ACHIEVEMENT_MAP.has(achievementId as AchievementId),
    ),
    toastQueue: [],
  })
}

function getDimensionScoresFromAnswers(answers: Record<string, Preference>) {
  const scores = {
    EI: 0,
    SN: 0,
    TF: 0,
    JP: 0,
  }

  Object.entries(answers).forEach(([questionId, preference]) => {
    const question = getQuestionById(questionId)

    if (!question) {
      return
    }

    scores[question.dimension] += preference === 'first' ? 1 : -1
  })

  return scores
}

function applyRemoteMbtiDocument(mbtiDoc: MbtiDocument) {
  const currentMbti = useMbtiStore.getState()
  const answersByQuestionId = Object.fromEntries(
    Object.entries(mbtiDoc.answers ?? {}).filter(
      (entry): entry is [string, Preference] =>
        typeof entry[0] === 'string' && (entry[1] === 'first' || entry[1] === 'second'),
    ),
  )

  useMbtiStore.setState({
    ...currentMbti,
    answeredQuestionIds: Object.keys(answersByQuestionId),
    answersByQuestionId,
    scores: getDimensionScoresFromAnswers(answersByQuestionId),
  })
}

async function syncWithCloud() {
  if (syncing || !window.navigator.onLine || !isFirebaseConfigured()) {
    return
  }

  const db = getFirestoreDb()

  if (!db) {
    return
  }

  syncing = true

  try {
    const meta = ensureInitialMeta()
    const saveRef = doc(db, 'saves', meta.userId)
    const mbtiRef = doc(db, 'mbti', meta.userId)

    const [saveSnapshot, mbtiSnapshot] = await Promise.all([getDoc(saveRef), getDoc(mbtiRef)])
    const cloudSave = saveSnapshot.exists() ? (saveSnapshot.data() as SaveDocument) : null
    const cloudMbti = mbtiSnapshot.exists() ? (mbtiSnapshot.data() as MbtiDocument) : null

    isApplyingRemoteState = true

    if (cloudSave && cloudSave.updatedAt > meta.saveUpdatedAt) {
      applyRemoteSaveDocument(cloudSave)
      meta.saveUpdatedAt = cloudSave.updatedAt
    } else if (!cloudSave || meta.saveUpdatedAt >= cloudSave.updatedAt) {
      await setDoc(saveRef, buildSaveDocument(meta), { merge: true })
    }

    if (cloudMbti && cloudMbti.updatedAt > meta.mbtiUpdatedAt) {
      applyRemoteMbtiDocument(cloudMbti)
      meta.mbtiUpdatedAt = cloudMbti.updatedAt
    } else if (!cloudMbti || meta.mbtiUpdatedAt >= cloudMbti.updatedAt) {
      await setDoc(mbtiRef, buildMbtiDocument(meta), { merge: true })
    }

    writeMeta(meta)
    lastSaveFingerprint = getSaveFingerprint()
    lastMbtiFingerprint = getMbtiFingerprint()
  } finally {
    isApplyingRemoteState = false
    syncing = false

    if (syncQueued) {
      syncQueued = false
      void syncWithCloud()
    }
  }
}

function queueCloudSync() {
  if (debounceHandle) {
    window.clearTimeout(debounceHandle)
  }

  debounceHandle = window.setTimeout(() => {
    if (syncing) {
      syncQueued = true
      return
    }

    void syncWithCloud()
  }, 500)
}

function markSaveUpdated(kind: 'save' | 'mbti') {
  if (isApplyingRemoteState) {
    return
  }

  const meta = readMeta()
  const now = Date.now()

  if (kind === 'save') {
    meta.saveUpdatedAt = now
  } else {
    meta.mbtiUpdatedAt = now
  }

  writeMeta(meta)
  queueCloudSync()
}

function startSaveSync() {
  if (started) {
    return () => {}
  }

  started = true
  ensureInitialMeta()
  lastSaveFingerprint = getSaveFingerprint()
  lastMbtiFingerprint = getMbtiFingerprint()

  const unsubscribeGame = useGameStore.subscribe(() => {
    const next = getSaveFingerprint()

    if (next === lastSaveFingerprint) {
      return
    }

    lastSaveFingerprint = next
    markSaveUpdated('save')
  })

  const unsubscribeGallery = useGalleryStore.subscribe(() => {
    const next = getSaveFingerprint()

    if (next === lastSaveFingerprint) {
      return
    }

    lastSaveFingerprint = next
    markSaveUpdated('save')
  })

  const unsubscribeMbti = useMbtiStore.subscribe(() => {
    const next = getMbtiFingerprint()

    if (next === lastMbtiFingerprint) {
      return
    }

    lastMbtiFingerprint = next
    markSaveUpdated('mbti')
  })

  const unsubscribeAchievements = useAchievementStore.subscribe(() => {
    const next = getSaveFingerprint()

    if (next === lastSaveFingerprint) {
      return
    }

    lastSaveFingerprint = next
    markSaveUpdated('save')
  })

  const handleOnline = () => {
    void syncWithCloud()
  }

  window.addEventListener('online', handleOnline)
  void syncWithCloud()

  return () => {
    unsubscribeGame()
    unsubscribeGallery()
    unsubscribeMbti()
    unsubscribeAchievements()
    window.removeEventListener('online', handleOnline)
    started = false
  }
}

export function useSaveSync() {
  useEffect(() => {
    return startSaveSync()
  }, [])
}
