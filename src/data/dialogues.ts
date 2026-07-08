import type { Dimension, Preference } from '../stores/useMbtiStore'

export type DialogueChoiceResult = {
  kind: 'mbti'
  dimension: Dimension
  preference: Preference
}

export type DialogueChoice = {
  id: string
  label: string
  nextNodeId: string
  result?: DialogueChoiceResult
}

export type DialogueNode = {
  id: string
  speakerName: string
  avatarLabel: string
  text: string
  nextNodeId?: string
  choices?: readonly DialogueChoice[]
}

export type DialogueScript = {
  id: string
  title: string
  startNodeId: string
  nodes: Record<string, DialogueNode>
}

export const DIALOGUE_SCRIPTS = {
  forestElder: {
    id: 'forest-elder',
    title: 'Forest Elder',
    startNodeId: 'greeting',
    nodes: {
      greeting: {
        id: 'greeting',
        speakerName: 'Forest Elder',
        avatarLabel: 'FE',
        text: 'The path is soft today. Brown Sugar, if the forest turns quiet, how would you find your way?',
        choices: [
          {
            id: 'ask-nearby',
            label: 'I would call out and ask someone nearby.',
            nextNodeId: 'warm-path',
            result: {
              kind: 'mbti',
              dimension: 'EI',
              preference: 'first',
            },
          },
          {
            id: 'study-map',
            label: 'I would pause and read the little signs first.',
            nextNodeId: 'quiet-path',
            result: {
              kind: 'mbti',
              dimension: 'EI',
              preference: 'second',
            },
          },
        ],
      },
      'warm-path': {
        id: 'warm-path',
        speakerName: 'Forest Elder',
        avatarLabel: 'FE',
        text: 'A voice can become a lantern. The forest remembers cats who are brave enough to call gently.',
        nextNodeId: 'farewell',
      },
      'quiet-path': {
        id: 'quiet-path',
        speakerName: 'Forest Elder',
        avatarLabel: 'FE',
        text: 'A quiet pause can become a compass. The forest remembers cats who listen before stepping.',
        nextNodeId: 'farewell',
      },
      farewell: {
        id: 'farewell',
        speakerName: 'Forest Elder',
        avatarLabel: 'FE',
        text: 'Take this thought with you. Not every answer needs to be loud to be true.',
      },
    },
  },
} as const satisfies Record<string, DialogueScript>

export type DialogueScriptId = keyof typeof DIALOGUE_SCRIPTS
