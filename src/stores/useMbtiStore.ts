import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MBTI_QUESTION_COUNT, getQuestionById } from '../data/mbti'
import { calculateMbtiType, type MbtiDimension, type MbtiScores, type MbtiType } from '../services/mbti'

export type Dimension = MbtiDimension
export type Preference = 'first' | 'second'

export type AnsweredPreferenceMap = Record<string, Preference>

type MbtiState = {
  scores: MbtiScores
  answeredQuestionIds: string[]
  answersByQuestionId: AnsweredPreferenceMap
  answerQuestion: (questionId: string, preference: Preference) => boolean
  resetScores: () => void
  isComplete: () => boolean
  getMbtiResult: () => MbtiType | null
}

const initialScores: MbtiScores = {
  EI: 0,
  SN: 0,
  TF: 0,
  JP: 0,
}

export const useMbtiStore = create<MbtiState>()(
  persist(
    (set, get) => ({
      scores: initialScores,
      answeredQuestionIds: [],
      answersByQuestionId: {},
      answerQuestion: (questionId, preference) => {
        const question = getQuestionById(questionId)

        if (!question) {
          return false
        }

        let answered = false

        set((state) => {
          if (state.answeredQuestionIds.includes(questionId)) {
            return state
          }

          answered = true

          return {
            answeredQuestionIds: [...state.answeredQuestionIds, questionId],
            answersByQuestionId: {
              ...state.answersByQuestionId,
              [questionId]: preference,
            },
            scores: {
              ...state.scores,
              [question.dimension]:
                state.scores[question.dimension] + (preference === 'first' ? 1 : -1),
            },
          }
        })

        return answered
      },
      resetScores: () =>
        set({
          scores: initialScores,
          answeredQuestionIds: [],
          answersByQuestionId: {},
        }),
      isComplete: () => get().answeredQuestionIds.length >= MBTI_QUESTION_COUNT,
      getMbtiResult: () => {
        if (!get().isComplete()) {
          return null
        }

        return calculateMbtiType(get().scores)
      },
    }),
    {
      name: 'perfect-bowl-mbti',
      merge: (persistedState, currentState) => {
        const persisted =
          typeof persistedState === 'object' && persistedState !== null ? persistedState : {}

        return {
          ...currentState,
          ...persisted,
          scores: {
            ...currentState.scores,
            ...(typeof persisted === 'object' &&
            persisted !== null &&
            'scores' in persisted &&
            typeof persisted.scores === 'object' &&
            persisted.scores !== null
              ? persisted.scores
              : {}),
          },
          answeredQuestionIds:
            typeof persisted === 'object' &&
            persisted !== null &&
            'answeredQuestionIds' in persisted &&
            Array.isArray(persisted.answeredQuestionIds)
              ? persisted.answeredQuestionIds.filter(
                  (questionId): questionId is string => typeof questionId === 'string',
                )
              : currentState.answeredQuestionIds,
          answersByQuestionId:
            typeof persisted === 'object' &&
            persisted !== null &&
            'answersByQuestionId' in persisted &&
            typeof persisted.answersByQuestionId === 'object' &&
            persisted.answersByQuestionId !== null
              ? Object.fromEntries(
                  Object.entries(persisted.answersByQuestionId).filter(
                    (entry): entry is [string, Preference] =>
                      typeof entry[0] === 'string' &&
                      (entry[1] === 'first' || entry[1] === 'second'),
                  ),
                )
              : currentState.answersByQuestionId,
        }
      },
    },
  ),
)
