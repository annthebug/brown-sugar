import type { Preference } from '../stores/useMbtiStore'

export type DialogueChoiceResult =
  | {
      kind: 'mbti'
      questionId: string
      preference: Preference
    }
  | {
      kind: 'story'
      trigger: 'time-monster-understood' | 'snow-spirit-understood' | 'glass-master-understood' | 'inner-doubt-understood'
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

function mbtiChoice(
  id: string,
  label: string,
  nextNodeId: string,
  questionId: string,
  preference: Preference,
): DialogueChoice {
  return {
    id,
    label,
    nextNodeId,
    result: {
      kind: 'mbti',
      questionId,
      preference,
    },
  }
}

export const DIALOGUE_SCRIPTS = {
  forestElder: {
    id: 'forest-elder',
    title: 'Forest Elder',
    startNodeId: 'forest-ei-01',
    nodes: {
      'forest-ei-01': {
        id: 'forest-ei-01',
        speakerName: 'Forest Elder',
        avatarLabel: 'FE',
        text: 'The path is soft today. Brown Sugar, if the forest turns quiet, how would you find your way?',
        choices: [
          mbtiChoice(
            'forest-ei-01-a',
            'I would call out and ask someone nearby.',
            'forest-ei-01-r1',
            'forest-ei-01',
            'first',
          ),
          mbtiChoice(
            'forest-ei-01-b',
            'I would pause and read the little signs first.',
            'forest-ei-01-r2',
            'forest-ei-01',
            'second',
          ),
        ],
      },
      'forest-ei-01-r1': {
        id: 'forest-ei-01-r1',
        speakerName: 'Forest Elder',
        avatarLabel: 'FE',
        text: 'A voice can become a lantern. The forest remembers cats who are brave enough to call gently.',
        nextNodeId: 'forest-ei-02',
      },
      'forest-ei-01-r2': {
        id: 'forest-ei-01-r2',
        speakerName: 'Forest Elder',
        avatarLabel: 'FE',
        text: 'A quiet pause can become a compass. The forest remembers cats who listen before stepping.',
        nextNodeId: 'forest-ei-02',
      },
      'forest-ei-02': {
        id: 'forest-ei-02',
        speakerName: 'Forest Elder',
        avatarLabel: 'FE',
        text: 'When a new trail appears, what do you do first?',
        choices: [
          mbtiChoice(
            'forest-ei-02-a',
            'I follow the pawprints that are already there.',
            'forest-ei-02-r1',
            'forest-ei-02',
            'first',
          ),
          mbtiChoice(
            'forest-ei-02-b',
            'I watch the breeze and choose my own angle.',
            'forest-ei-02-r2',
            'forest-ei-02',
            'second',
          ),
        ],
      },
      'forest-ei-02-r1': {
        id: 'forest-ei-02-r1',
        speakerName: 'Forest Elder',
        avatarLabel: 'FE',
        text: 'Shared steps can warm a path. Keep listening to the world around you.',
        nextNodeId: 'forest-sn-01',
      },
      'forest-ei-02-r2': {
        id: 'forest-ei-02-r2',
        speakerName: 'Forest Elder',
        avatarLabel: 'FE',
        text: 'Your own rhythm is valid too. The forest trusts a cat who knows her pace.',
        nextNodeId: 'forest-sn-01',
      },
      'forest-sn-01': {
        id: 'forest-sn-01',
        speakerName: 'Forest Elder',
        avatarLabel: 'FE',
        text: 'A mossy stone marks the path. What catches your attention?',
        choices: [
          mbtiChoice(
            'forest-sn-01-a',
            'The exact shape of the moss and the damp stone.',
            'forest-sn-01-r1',
            'forest-sn-01',
            'first',
          ),
          mbtiChoice(
            'forest-sn-01-b',
            'The feeling that this stone has seen many travelers.',
            'forest-sn-01-r2',
            'forest-sn-01',
            'second',
          ),
        ],
      },
      'forest-sn-01-r1': {
        id: 'forest-sn-01-r1',
        speakerName: 'Forest Elder',
        avatarLabel: 'FE',
        text: 'Small details can hold a whole map. You see what is here.',
        nextNodeId: 'forest-sn-02',
      },
      'forest-sn-01-r2': {
        id: 'forest-sn-01-r2',
        speakerName: 'Forest Elder',
        avatarLabel: 'FE',
        text: 'Stories live in quiet places. You feel what the stone remembers.',
        nextNodeId: 'forest-sn-02',
      },
      'forest-sn-02': {
        id: 'forest-sn-02',
        speakerName: 'Forest Elder',
        avatarLabel: 'FE',
        text: 'The elder shows two berries. Which thought comes first?',
        choices: [
          mbtiChoice(
            'forest-sn-02-a',
            'One is brighter red, and one is slightly softer.',
            'forest-sn-02-r1',
            'forest-sn-02',
            'first',
          ),
          mbtiChoice(
            'forest-sn-02-b',
            'They look like a pair meant for a gentle gift.',
            'forest-sn-02-r2',
            'forest-sn-02',
            'second',
          ),
        ],
      },
      'forest-sn-02-r1': {
        id: 'forest-sn-02-r1',
        speakerName: 'Forest Elder',
        avatarLabel: 'FE',
        text: 'You notice what is real before what is imagined. That keeps paws safe.',
        nextNodeId: 'forest-sn-03',
      },
      'forest-sn-02-r2': {
        id: 'forest-sn-02-r2',
        speakerName: 'Forest Elder',
        avatarLabel: 'FE',
        text: 'Meaning arrives quickly for you. The forest enjoys that kind of heart.',
        nextNodeId: 'forest-sn-03',
      },
      'forest-sn-03': {
        id: 'forest-sn-03',
        speakerName: 'Forest Elder',
        avatarLabel: 'FE',
        text: 'Rain softens the footprints ahead. How do you read them?',
        choices: [
          mbtiChoice(
            'forest-sn-03-a',
            'I count the depth and direction of each print.',
            'forest-sn-03-r1',
            'forest-sn-03',
            'first',
          ),
          mbtiChoice(
            'forest-sn-03-b',
            'I imagine who walked here and why they hurried.',
            'forest-sn-03-r2',
            'forest-sn-03',
            'second',
          ),
        ],
      },
      'forest-sn-03-r1': {
        id: 'forest-sn-03-r1',
        speakerName: 'Forest Elder',
        avatarLabel: 'FE',
        text: 'Facts can be kind when the trail is uncertain.',
        nextNodeId: 'farewell',
      },
      'forest-sn-03-r2': {
        id: 'forest-sn-03-r2',
        speakerName: 'Forest Elder',
        avatarLabel: 'FE',
        text: 'Possibility can be kind when the trail is uncertain.',
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
  cityBarista: {
    id: 'city-barista',
    title: 'Coffee Barista',
    startNodeId: 'city-tf-01',
    nodes: {
      'city-tf-01': {
        id: 'city-tf-01',
        speakerName: 'Barista',
        avatarLabel: 'BR',
        text: 'The last train just left. A friend is still waiting on the platform. What do you say first?',
        choices: [
          mbtiChoice(
            'city-tf-01-a',
            'Let us check the next route and timing.',
            'city-tf-01-r1',
            'city-tf-01',
            'first',
          ),
          mbtiChoice(
            'city-tf-01-b',
            'It is okay. We can find a softer way home together.',
            'city-tf-01-r2',
            'city-tf-01',
            'second',
          ),
        ],
      },
      'city-tf-01-r1': {
        id: 'city-tf-01-r1',
        speakerName: 'Barista',
        avatarLabel: 'BR',
        text: 'A clear plan can calm a busy street.',
        nextNodeId: 'city-tf-02',
      },
      'city-tf-01-r2': {
        id: 'city-tf-01-r2',
        speakerName: 'Barista',
        avatarLabel: 'BR',
        text: 'Warm words can calm a busy street.',
        nextNodeId: 'city-tf-02',
      },
      'city-tf-02': {
        id: 'city-tf-02',
        speakerName: 'Barista',
        avatarLabel: 'BR',
        text: 'Two plans could work. How do you choose?',
        choices: [
          mbtiChoice(
            'city-tf-02-a',
            'I compare which one is faster and simpler.',
            'city-tf-02-r1',
            'city-tf-02',
            'first',
          ),
          mbtiChoice(
            'city-tf-02-b',
            'I choose the one that keeps everyone comfortable.',
            'city-tf-02-r2',
            'city-tf-02',
            'second',
          ),
        ],
      },
      'city-tf-02-r1': {
        id: 'city-tf-02-r1',
        speakerName: 'Barista',
        avatarLabel: 'BR',
        text: 'Efficiency has its own kindness in the city.',
        nextNodeId: 'city-tf-03',
      },
      'city-tf-02-r2': {
        id: 'city-tf-02-r2',
        speakerName: 'Barista',
        avatarLabel: 'BR',
        text: 'Care has its own wisdom in the city.',
        nextNodeId: 'city-tf-03',
      },
      'city-tf-03': {
        id: 'city-tf-03',
        speakerName: 'Barista',
        avatarLabel: 'BR',
        text: 'A message arrives late at night. What matters more?',
        choices: [
          mbtiChoice(
            'city-tf-03-a',
            'Whether the words are clear and honest.',
            'city-tf-03-r1',
            'city-tf-03',
            'first',
          ),
          mbtiChoice(
            'city-tf-03-b',
            'Whether the tone still feels gentle.',
            'city-tf-03-r2',
            'city-tf-03',
            'second',
          ),
        ],
      },
      'city-tf-03-r1': {
        id: 'city-tf-03-r1',
        speakerName: 'Barista',
        avatarLabel: 'BR',
        text: 'Truth can be a quiet kind of comfort.',
        nextNodeId: 'city-barista-farewell',
      },
      'city-tf-03-r2': {
        id: 'city-tf-03-r2',
        speakerName: 'Barista',
        avatarLabel: 'BR',
        text: 'Warmth can be a quiet kind of comfort.',
        nextNodeId: 'city-barista-farewell',
      },
      'city-barista-farewell': {
        id: 'city-barista-farewell',
        speakerName: 'Barista',
        avatarLabel: 'BR',
        text: 'Distance stretches the hours, but a cup can still hold you both.',
      },
    },
  },
  cityTraveler: {
    id: 'city-traveler',
    title: 'Park Traveler',
    startNodeId: 'city-jp-01',
    nodes: {
      'city-jp-01': {
        id: 'city-jp-01',
        speakerName: 'Traveler',
        avatarLabel: 'TR',
        text: 'Your afternoon is suddenly free. What sounds best?',
        choices: [
          mbtiChoice(
            'city-jp-01-a',
            'Finish the errands I already planned.',
            'city-jp-01-r1',
            'city-jp-01',
            'first',
          ),
          mbtiChoice(
            'city-jp-01-b',
            'Follow whichever corner looks interesting.',
            'city-jp-01-r2',
            'city-jp-01',
            'second',
          ),
        ],
      },
      'city-jp-01-r1': {
        id: 'city-jp-01-r1',
        speakerName: 'Traveler',
        avatarLabel: 'TR',
        text: 'A steady list can make a free hour feel generous.',
        nextNodeId: 'city-jp-02',
      },
      'city-jp-01-r2': {
        id: 'city-jp-01-r2',
        speakerName: 'Traveler',
        avatarLabel: 'TR',
        text: 'A wandering hour can become its own gift.',
        nextNodeId: 'city-jp-02',
      },
      'city-jp-02': {
        id: 'city-jp-02',
        speakerName: 'Traveler',
        avatarLabel: 'TR',
        text: 'A cozy café has one empty seat. How do you decide?',
        choices: [
          mbtiChoice(
            'city-jp-02-a',
            'I check the menu and pick before sitting.',
            'city-jp-02-r1',
            'city-jp-02',
            'first',
          ),
          mbtiChoice(
            'city-jp-02-b',
            'I sit first and let the mood choose for me.',
            'city-jp-02-r2',
            'city-jp-02',
            'second',
          ),
        ],
      },
      'city-jp-02-r1': {
        id: 'city-jp-02-r1',
        speakerName: 'Traveler',
        avatarLabel: 'TR',
        text: 'Deciding early leaves more room to enjoy the cup.',
        nextNodeId: 'city-traveler-farewell',
      },
      'city-jp-02-r2': {
        id: 'city-jp-02-r2',
        speakerName: 'Traveler',
        avatarLabel: 'TR',
        text: 'Leaving space open can make the cup taste softer.',
        nextNodeId: 'city-traveler-farewell',
      },
      'city-traveler-farewell': {
        id: 'city-traveler-farewell',
        speakerName: 'Traveler',
        avatarLabel: 'TR',
        text: 'Some routes are not on any map. They are still worth walking.',
      },
    },
  },
  timeMonster: {
    id: 'time-monster',
    title: 'Time Monster',
    startNodeId: 'time-intro',
    nodes: {
      'time-intro': {
        id: 'time-intro',
        speakerName: 'Time Monster',
        avatarLabel: 'TM',
        text: 'You chased me along the platform. I am not here to frighten you. I am the hours between two places.',
        nextNodeId: 'time-wait',
      },
      'time-wait': {
        id: 'time-wait',
        speakerName: 'Time Monster',
        avatarLabel: 'TM',
        text: 'Waiting feels heavy when someone you love is far away. I carry that weight too.',
        nextNodeId: 'time-choice',
      },
      'time-choice': {
        id: 'time-choice',
        speakerName: 'Brown Sugar',
        avatarLabel: 'BS',
        text: 'What do you want to say to the waiting?',
        choices: [
          {
            id: 'time-choice-a',
            label: 'The distance is real, but so is the care we keep.',
            nextNodeId: 'time-understand',
            result: { kind: 'story', trigger: 'time-monster-understood' },
          },
          {
            id: 'time-choice-b',
            label: 'I will meet the hours gently, one soft moment at a time.',
            nextNodeId: 'time-understand',
            result: { kind: 'story', trigger: 'time-monster-understood' },
          },
        ],
      },
      'time-understand': {
        id: 'time-understand',
        speakerName: 'Time Monster',
        avatarLabel: 'TM',
        text: 'Then I do not have to loom so large. I can become a bridge instead.',
        nextNodeId: 'time-farewell',
      },
      'time-farewell': {
        id: 'time-farewell',
        speakerName: 'Time Monster',
        avatarLabel: 'TM',
        text: 'Go on, little cat. The city will keep your place warm until you arrive.',
      },
    },
  },
  cityGuide: {
    id: 'city-guide',
    title: 'City Guide',
    startNodeId: 'city-tf-01',
    nodes: {
      'city-tf-01': {
        id: 'city-tf-01',
        speakerName: 'City Guide',
        avatarLabel: 'CG',
        text: 'A friend misses the last tram. What do you say first?',
        choices: [
          mbtiChoice(
            'city-tf-01-a',
            'Let us check the next route and timing.',
            'city-tf-01-r1',
            'city-tf-01',
            'first',
          ),
          mbtiChoice(
            'city-tf-01-b',
            'It is okay. We can find a softer way home together.',
            'city-tf-01-r2',
            'city-tf-01',
            'second',
          ),
        ],
      },
      'city-tf-01-r1': {
        id: 'city-tf-01-r1',
        speakerName: 'City Guide',
        avatarLabel: 'CG',
        text: 'A clear plan can calm a busy street.',
        nextNodeId: 'city-tf-02',
      },
      'city-tf-01-r2': {
        id: 'city-tf-01-r2',
        speakerName: 'City Guide',
        avatarLabel: 'CG',
        text: 'Warm words can calm a busy street.',
        nextNodeId: 'city-tf-02',
      },
      'city-tf-02': {
        id: 'city-tf-02',
        speakerName: 'City Guide',
        avatarLabel: 'CG',
        text: 'Two plans could work. How do you choose?',
        choices: [
          mbtiChoice(
            'city-tf-02-a',
            'I compare which one is faster and simpler.',
            'city-tf-02-r1',
            'city-tf-02',
            'first',
          ),
          mbtiChoice(
            'city-tf-02-b',
            'I choose the one that keeps everyone comfortable.',
            'city-tf-02-r2',
            'city-tf-02',
            'second',
          ),
        ],
      },
      'city-tf-02-r1': {
        id: 'city-tf-02-r1',
        speakerName: 'City Guide',
        avatarLabel: 'CG',
        text: 'Efficiency has its own kindness in the city.',
        nextNodeId: 'city-jp-01',
      },
      'city-tf-02-r2': {
        id: 'city-tf-02-r2',
        speakerName: 'City Guide',
        avatarLabel: 'CG',
        text: 'Care has its own wisdom in the city.',
        nextNodeId: 'city-jp-01',
      },
      'city-jp-01': {
        id: 'city-jp-01',
        speakerName: 'City Guide',
        avatarLabel: 'CG',
        text: 'Your afternoon is suddenly free. What sounds best?',
        choices: [
          mbtiChoice(
            'city-jp-01-a',
            'Finish the errands I already planned.',
            'city-jp-01-r1',
            'city-jp-01',
            'first',
          ),
          mbtiChoice(
            'city-jp-01-b',
            'Follow whichever corner looks interesting.',
            'city-jp-01-r2',
            'city-jp-01',
            'second',
          ),
        ],
      },
      'city-jp-01-r1': {
        id: 'city-jp-01-r1',
        speakerName: 'City Guide',
        avatarLabel: 'CG',
        text: 'A steady list can make a free hour feel generous.',
        nextNodeId: 'city-jp-02',
      },
      'city-jp-01-r2': {
        id: 'city-jp-01-r2',
        speakerName: 'City Guide',
        avatarLabel: 'CG',
        text: 'A wandering hour can become its own gift.',
        nextNodeId: 'city-jp-02',
      },
      'city-jp-02': {
        id: 'city-jp-02',
        speakerName: 'City Guide',
        avatarLabel: 'CG',
        text: 'A cozy café has one empty seat. How do you decide?',
        choices: [
          mbtiChoice(
            'city-jp-02-a',
            'I check the menu and pick before sitting.',
            'city-jp-02-r1',
            'city-jp-02',
            'first',
          ),
          mbtiChoice(
            'city-jp-02-b',
            'I sit first and let the mood choose for me.',
            'city-jp-02-r2',
            'city-jp-02',
            'second',
          ),
        ],
      },
      'city-jp-02-r1': {
        id: 'city-jp-02-r1',
        speakerName: 'City Guide',
        avatarLabel: 'CG',
        text: 'Deciding early leaves more room to enjoy the cup.',
        nextNodeId: 'city-farewell',
      },
      'city-jp-02-r2': {
        id: 'city-jp-02-r2',
        speakerName: 'City Guide',
        avatarLabel: 'CG',
        text: 'Leaving space open can make the cup taste softer.',
        nextNodeId: 'city-farewell',
      },
      'city-farewell': {
        id: 'city-farewell',
        speakerName: 'City Guide',
        avatarLabel: 'CG',
        text: 'The city moves quickly, but your pace can stay gentle.',
      },
    },
  },
  snowSpirit: {
    id: 'snow-spirit',
    title: 'Snow Spirit',
    startNodeId: 'snow-sn-01',
    nodes: {
      'snow-sn-01': {
        id: 'snow-sn-01',
        speakerName: 'Snow Spirit',
        avatarLabel: 'SS',
        text: 'Snow hides the old steps. What do you trust?',
        choices: [
          mbtiChoice(
            'snow-sn-01-a',
            'The stone edge still visible beneath the drifts.',
            'snow-sn-01-r1',
            'snow-sn-01',
            'first',
          ),
          mbtiChoice(
            'snow-sn-01-b',
            'The faint glow where travelers usually gather.',
            'snow-sn-01-r2',
            'snow-sn-01',
            'second',
          ),
        ],
      },
      'snow-sn-01-r1': {
        id: 'snow-sn-01-r1',
        speakerName: 'Snow Spirit',
        avatarLabel: 'SS',
        text: 'What remains visible can guide cold paws.',
        nextNodeId: 'snow-sn-02',
      },
      'snow-sn-01-r2': {
        id: 'snow-sn-01-r2',
        speakerName: 'Snow Spirit',
        avatarLabel: 'SS',
        text: 'What is felt can guide cold paws.',
        nextNodeId: 'snow-sn-02',
      },
      'snow-sn-02': {
        id: 'snow-sn-02',
        speakerName: 'Snow Spirit',
        avatarLabel: 'SS',
        text: 'The wind shifts the drifts. What do you notice?',
        choices: [
          mbtiChoice(
            'snow-sn-02-a',
            'How the snow piles against each tree root.',
            'snow-sn-02-r1',
            'snow-sn-02',
            'first',
          ),
          mbtiChoice(
            'snow-sn-02-b',
            'How the mountain seems to breathe in the wind.',
            'snow-sn-02-r2',
            'snow-sn-02',
            'second',
          ),
        ],
      },
      'snow-sn-02-r1': {
        id: 'snow-sn-02-r1',
        speakerName: 'Snow Spirit',
        avatarLabel: 'SS',
        text: 'You read the mountain by what it shows.',
        nextNodeId: 'snow-ei-01',
      },
      'snow-sn-02-r2': {
        id: 'snow-sn-02-r2',
        speakerName: 'Snow Spirit',
        avatarLabel: 'SS',
        text: 'You read the mountain by what it suggests.',
        nextNodeId: 'snow-ei-01',
      },
      'snow-ei-01': {
        id: 'snow-ei-01',
        speakerName: 'Snow Spirit',
        avatarLabel: 'SS',
        text: 'A lantern glows in the distance. What do you do?',
        choices: [
          mbtiChoice(
            'snow-ei-01-a',
            'I call softly to see who is there.',
            'snow-ei-01-r1',
            'snow-ei-01',
            'first',
          ),
          mbtiChoice(
            'snow-ei-01-b',
            'I watch the light and decide in quiet.',
            'snow-ei-01-r2',
            'snow-ei-01',
            'second',
          ),
        ],
      },
      'snow-ei-01-r1': {
        id: 'snow-ei-01-r1',
        speakerName: 'Snow Spirit',
        avatarLabel: 'SS',
        text: 'A small voice can cross a wide white field.',
        nextNodeId: 'snow-ei-02',
      },
      'snow-ei-01-r2': {
        id: 'snow-ei-01-r2',
        speakerName: 'Snow Spirit',
        avatarLabel: 'SS',
        text: 'A small pause can cross a wide white field.',
        nextNodeId: 'snow-ei-02',
      },
      'snow-ei-02': {
        id: 'snow-ei-02',
        speakerName: 'Snow Spirit',
        avatarLabel: 'SS',
        text: 'The mountain shelter feels warm. Where do you settle?',
        choices: [
          mbtiChoice(
            'snow-ei-02-a',
            'Near the others, where stories are already flowing.',
            'snow-ei-02-r1',
            'snow-ei-02',
            'first',
          ),
          mbtiChoice(
            'snow-ei-02-b',
            'In a quiet corner with a view of the snow.',
            'snow-ei-02-r2',
            'snow-ei-02',
            'second',
          ),
        ],
      },
      'snow-ei-02-r1': {
        id: 'snow-ei-02-r1',
        speakerName: 'Snow Spirit',
        avatarLabel: 'SS',
        text: 'Warmth grows when it is shared.',
        nextNodeId: 'snow-farewell',
      },
      'snow-ei-02-r2': {
        id: 'snow-ei-02-r2',
        speakerName: 'Snow Spirit',
        avatarLabel: 'SS',
        text: 'Warmth grows when it is tended quietly.',
        nextNodeId: 'snow-farewell',
      },
      'snow-farewell': {
        id: 'snow-farewell',
        speakerName: 'Snow Spirit',
        avatarLabel: 'SS',
        text: 'The snow remembers every gentle step.',
      },
    },
  },
  snowSpiritBoss: {
    id: 'snow-spirit-boss',
    title: 'Snow Spirit',
    startNodeId: 'snow-boss-intro',
    nodes: {
      'snow-boss-intro': {
        id: 'snow-boss-intro',
        speakerName: 'Snow Spirit',
        avatarLabel: 'SS',
        text: 'You followed the light across the drifts. This mountain holds journeys taken far from home.',
        nextNodeId: 'snow-boss-travel',
      },
      'snow-boss-travel': {
        id: 'snow-boss-travel',
        speakerName: 'Snow Spirit',
        avatarLabel: 'SS',
        text: 'Some paths are cold, but walking them together makes the distance softer.',
        nextNodeId: 'snow-boss-choice',
      },
      'snow-boss-choice': {
        id: 'snow-boss-choice',
        speakerName: 'Brown Sugar',
        avatarLabel: 'BS',
        text: 'What do you want to carry from this faraway snow?',
        choices: [
          {
            id: 'snow-boss-choice-a',
            label: 'The memory of choosing to go, even when it was far.',
            nextNodeId: 'snow-boss-understand',
            result: { kind: 'story', trigger: 'snow-spirit-understood' },
          },
          {
            id: 'snow-boss-choice-b',
            label: 'The warmth we found along the way, not only at the end.',
            nextNodeId: 'snow-boss-understand',
            result: { kind: 'story', trigger: 'snow-spirit-understood' },
          },
        ],
      },
      'snow-boss-understand': {
        id: 'snow-boss-understand',
        speakerName: 'Snow Spirit',
        avatarLabel: 'SS',
        text: 'Then the mountain is not a wall. It is proof that you kept going.',
        nextNodeId: 'snow-boss-farewell',
      },
      'snow-boss-farewell': {
        id: 'snow-boss-farewell',
        speakerName: 'Snow Spirit',
        avatarLabel: 'SS',
        text: 'Take this quiet with you. The next valley is already waiting.',
      },
    },
  },
  glassMaster: {
    id: 'glass-master',
    title: 'Glass Master',
    startNodeId: 'glass-tf-01',
    nodes: {
      'glass-tf-01': {
        id: 'glass-tf-01',
        speakerName: 'Glass Master',
        avatarLabel: 'GM',
        text: 'A bowl develops a tiny crack. What matters most?',
        choices: [
          mbtiChoice(
            'glass-tf-01-a',
            'Whether the bowl can still hold tea safely.',
            'glass-tf-01-r1',
            'glass-tf-01',
            'first',
          ),
          mbtiChoice(
            'glass-tf-01-b',
            'Whether the bowl still feels like a gift.',
            'glass-tf-01-r2',
            'glass-tf-01',
            'second',
          ),
        ],
      },
      'glass-tf-01-r1': {
        id: 'glass-tf-01-r1',
        speakerName: 'Glass Master',
        avatarLabel: 'GM',
        text: 'Usefulness and care can live in the same breath.',
        nextNodeId: 'glass-tf-02',
      },
      'glass-tf-01-r2': {
        id: 'glass-tf-01-r2',
        speakerName: 'Glass Master',
        avatarLabel: 'GM',
        text: 'Meaning and care can live in the same breath.',
        nextNodeId: 'glass-tf-02',
      },
      'glass-tf-02': {
        id: 'glass-tf-02',
        speakerName: 'Glass Master',
        avatarLabel: 'GM',
        text: 'Two glazes could finish the bowl. How do you decide?',
        choices: [
          mbtiChoice(
            'glass-tf-02-a',
            'I test which one keeps the clearest glass.',
            'glass-tf-02-r1',
            'glass-tf-02',
            'first',
          ),
          mbtiChoice(
            'glass-tf-02-b',
            'I choose the one that feels most like the memory.',
            'glass-tf-02-r2',
            'glass-tf-02',
            'second',
          ),
        ],
      },
      'glass-tf-02-r1': {
        id: 'glass-tf-02-r1',
        speakerName: 'Glass Master',
        avatarLabel: 'GM',
        text: 'Clarity can be its own tenderness.',
        nextNodeId: 'glass-jp-01',
      },
      'glass-tf-02-r2': {
        id: 'glass-tf-02-r2',
        speakerName: 'Glass Master',
        avatarLabel: 'GM',
        text: 'Memory can be its own tenderness.',
        nextNodeId: 'glass-jp-01',
      },
      'glass-jp-01': {
        id: 'glass-jp-01',
        speakerName: 'Glass Master',
        avatarLabel: 'GM',
        text: 'The kiln schedule changes. How do you respond?',
        choices: [
          mbtiChoice(
            'glass-jp-01-a',
            'I rearrange the day to keep the firing on track.',
            'glass-jp-01-r1',
            'glass-jp-01',
            'first',
          ),
          mbtiChoice(
            'glass-jp-01-b',
            'I let the slower heat teach the bowl something new.',
            'glass-jp-01-r2',
            'glass-jp-01',
            'second',
          ),
        ],
      },
      'glass-jp-01-r1': {
        id: 'glass-jp-01-r1',
        speakerName: 'Glass Master',
        avatarLabel: 'GM',
        text: 'Order can protect fragile work.',
        nextNodeId: 'glass-jp-02',
      },
      'glass-jp-01-r2': {
        id: 'glass-jp-01-r2',
        speakerName: 'Glass Master',
        avatarLabel: 'GM',
        text: 'Flexibility can protect fragile work.',
        nextNodeId: 'glass-jp-02',
      },
      'glass-jp-02': {
        id: 'glass-jp-02',
        speakerName: 'Glass Master',
        avatarLabel: 'GM',
        text: 'A new pattern appears in the glass. What do you do?',
        choices: [
          mbtiChoice(
            'glass-jp-02-a',
            'I note it and adjust the next piece carefully.',
            'glass-jp-02-r1',
            'glass-jp-02',
            'first',
          ),
          mbtiChoice(
            'glass-jp-02-b',
            'I follow it and see where the pattern wants to go.',
            'glass-jp-02-r2',
            'glass-jp-02',
            'second',
          ),
        ],
      },
      'glass-jp-02-r1': {
        id: 'glass-jp-02-r1',
        speakerName: 'Glass Master',
        avatarLabel: 'GM',
        text: 'Discipline can polish a surprise into beauty.',
        nextNodeId: 'glass-farewell',
      },
      'glass-jp-02-r2': {
        id: 'glass-jp-02-r2',
        speakerName: 'Glass Master',
        avatarLabel: 'GM',
        text: 'Curiosity can polish a surprise into beauty.',
        nextNodeId: 'glass-farewell',
      },
      'glass-farewell': {
        id: 'glass-farewell',
        speakerName: 'Glass Master',
        avatarLabel: 'GM',
        text: 'Every bowl keeps learning until it is ready to be found.',
      },
    },
  },
  glassMasterBoss: {
    id: 'glass-master-boss',
    title: 'Glass Master',
    startNodeId: 'glass-boss-intro',
    nodes: {
      'glass-boss-intro': {
        id: 'glass-boss-intro',
        speakerName: 'Glass Master',
        avatarLabel: 'GM',
        text: 'You kept the breath steady. The molten glass is listening.',
        nextNodeId: 'glass-boss-shape',
      },
      'glass-boss-shape': {
        id: 'glass-boss-shape',
        speakerName: 'Glass Master',
        avatarLabel: 'GM',
        text: 'A bowl is not only a shape. It is the patience you carry while shaping it.',
        nextNodeId: 'glass-boss-choice',
      },
      'glass-boss-choice': {
        id: 'glass-boss-choice',
        speakerName: 'Brown Sugar',
        avatarLabel: 'BS',
        text: 'What should I hold onto while the glass cools?',
        choices: [
          {
            id: 'glass-boss-choice-a',
            label: 'The care I put into each breath, even if the rim wobbles.',
            nextNodeId: 'glass-boss-understand',
            result: { kind: 'story', trigger: 'glass-master-understood' },
          },
          {
            id: 'glass-boss-choice-b',
            label: 'The hope that meaning can live inside an imperfect curve.',
            nextNodeId: 'glass-boss-understand',
            result: { kind: 'story', trigger: 'glass-master-understood' },
          },
        ],
      },
      'glass-boss-understand': {
        id: 'glass-boss-understand',
        speakerName: 'Glass Master',
        avatarLabel: 'GM',
        text: 'Then take this first bowl. It may not match the memory yet — but it is yours to learn from.',
        nextNodeId: 'glass-boss-farewell',
      },
      'glass-boss-farewell': {
        id: 'glass-boss-farewell',
        speakerName: 'Glass Master',
        avatarLabel: 'GM',
        text: 'When you are ready, we will try again together.',
      },
    },
  },
  innerGuide: {
    id: 'inner-guide',
    title: 'Inner Guide',
    startNodeId: 'final-tf-01',
    nodes: {
      'final-tf-01': {
        id: 'final-tf-01',
        speakerName: 'Inner Guide',
        avatarLabel: 'IG',
        text: 'You almost have the bowl. What steadies your paws?',
        choices: [
          mbtiChoice(
            'final-tf-01-a',
            'Knowing I followed each step as well as I could.',
            'final-tf-01-r1',
            'final-tf-01',
            'first',
          ),
          mbtiChoice(
            'final-tf-01-b',
            'Knowing the journey already changed me gently.',
            'final-tf-01-r2',
            'final-tf-01',
            'second',
          ),
        ],
      },
      'final-tf-01-r1': {
        id: 'final-tf-01-r1',
        speakerName: 'Inner Guide',
        avatarLabel: 'IG',
        text: 'Careful effort can become quiet courage.',
        nextNodeId: 'final-jp-01',
      },
      'final-tf-01-r2': {
        id: 'final-tf-01-r2',
        speakerName: 'Inner Guide',
        avatarLabel: 'IG',
        text: 'Soft growth can become quiet courage.',
        nextNodeId: 'final-jp-01',
      },
      'final-jp-01': {
        id: 'final-jp-01',
        speakerName: 'Inner Guide',
        avatarLabel: 'IG',
        text: 'The last path splits twice. How do you move forward?',
        choices: [
          mbtiChoice(
            'final-jp-01-a',
            'I choose the route I prepared for and keep going.',
            'final-jp-01-r1',
            'final-jp-01',
            'first',
          ),
          mbtiChoice(
            'final-jp-01-b',
            'I leave room to change course if something feels right.',
            'final-jp-01-r2',
            'final-jp-01',
            'second',
          ),
        ],
      },
      'final-jp-01-r1': {
        id: 'final-jp-01-r1',
        speakerName: 'Inner Guide',
        avatarLabel: 'IG',
        text: 'Commitment can make the ending feel whole.',
        nextNodeId: 'final-ei-01',
      },
      'final-jp-01-r2': {
        id: 'final-jp-01-r2',
        speakerName: 'Inner Guide',
        avatarLabel: 'IG',
        text: 'Openness can make the ending feel whole.',
        nextNodeId: 'final-ei-01',
      },
      'final-ei-01': {
        id: 'final-ei-01',
        speakerName: 'Inner Guide',
        avatarLabel: 'IG',
        text: 'Before the bowl returns, who do you want beside you?',
        choices: [
          mbtiChoice(
            'final-ei-01-a',
            'The friends who walked with me and laughed along the way.',
            'final-ei-01-r1',
            'final-ei-01',
            'first',
          ),
          mbtiChoice(
            'final-ei-01-b',
            'A quiet moment with the memories I collected.',
            'final-ei-01-r2',
            'final-ei-01',
            'second',
          ),
        ],
      },
      'final-ei-01-r1': {
        id: 'final-ei-01-r1',
        speakerName: 'Inner Guide',
        avatarLabel: 'IG',
        text: 'Shared joy can complete a journey.',
        nextNodeId: 'final-farewell',
      },
      'final-ei-01-r2': {
        id: 'final-ei-01-r2',
        speakerName: 'Inner Guide',
        avatarLabel: 'IG',
        text: 'Private joy can complete a journey.',
        nextNodeId: 'final-farewell',
      },
      'final-farewell': {
        id: 'final-farewell',
        speakerName: 'Inner Guide',
        avatarLabel: 'IG',
        text: 'The bowl was never only glass. It was always the shape of who you are.',
      },
    },
  },
  innerDoubtBoss: {
    id: 'inner-doubt-boss',
    title: 'Inner Doubt',
    startNodeId: 'doubt-intro',
    nodes: {
      'doubt-intro': {
        id: 'doubt-intro',
        speakerName: 'Inner Doubt',
        avatarLabel: 'ID',
        text: 'You gathered everything again. Are you sure this bowl will be any different?',
        nextNodeId: 'doubt-round-1',
      },
      'doubt-round-1': {
        id: 'doubt-round-1',
        speakerName: 'Inner Doubt',
        avatarLabel: 'ID',
        text: 'Last time the rim wobbled. What if you only repeat the same mistake?',
        nextNodeId: 'doubt-round-2',
      },
      'doubt-round-2': {
        id: 'doubt-round-2',
        speakerName: 'Brown Sugar',
        avatarLabel: 'BS',
        text: 'The doubt feels heavy. How do I answer it gently?',
        choices: [
          {
            id: 'doubt-round-2-a',
            label: 'I am not trying to be perfect — I am trying to be present.',
            nextNodeId: 'doubt-round-3',
          },
          {
            id: 'doubt-round-2-b',
            label: 'Each try taught me something the last bowl could not.',
            nextNodeId: 'doubt-round-3',
          },
        ],
      },
      'doubt-round-3': {
        id: 'doubt-round-3',
        speakerName: 'Inner Doubt',
        avatarLabel: 'ID',
        text: 'Presence is soft. But soft things break easily.',
        nextNodeId: 'doubt-choice',
      },
      'doubt-choice': {
        id: 'doubt-choice',
        speakerName: 'Brown Sugar',
        avatarLabel: 'BS',
        text: 'What do I want to believe while the glass cools?',
        choices: [
          {
            id: 'doubt-choice-a',
            label: 'That effort itself is already a gift.',
            nextNodeId: 'doubt-understand',
            result: { kind: 'story', trigger: 'inner-doubt-understood' },
          },
          {
            id: 'doubt-choice-b',
            label: 'That meaning does not need a flawless shape.',
            nextNodeId: 'doubt-understand',
            result: { kind: 'story', trigger: 'inner-doubt-understood' },
          },
        ],
      },
      'doubt-understand': {
        id: 'doubt-understand',
        speakerName: 'Inner Doubt',
        avatarLabel: 'ID',
        text: 'Then I will step aside. The bowl can finish in your own time.',
        nextNodeId: 'doubt-farewell',
      },
      'doubt-farewell': {
        id: 'doubt-farewell',
        speakerName: 'Inner Doubt',
        avatarLabel: 'ID',
        text: 'Keep going. The true shape is already forming.',
      },
    },
  },
} as const satisfies Record<string, DialogueScript>

export type DialogueScriptId = keyof typeof DIALOGUE_SCRIPTS
