import type { Preference } from '../stores/useMbtiStore'

export type DialogueChoiceResult =
  | {
      kind: 'mbti'
      questionId: string
      preference: Preference
    }
  | {
      kind: 'story'
      trigger:
        | 'time-monster-understood'
        | 'snow-spirit-understood'
        | 'glass-master-understood'
        | 'inner-doubt-understood'
        | 'perfectionism-understood'
    }

export type DialogueChoice = {
  id: string
  label: string
  nextNodeId: string
  result?: DialogueChoiceResult
}

export type DialoguePortraitMood = 'calm' | 'thoughtful' | 'warm'

export type DialogueNode = {
  id: string
  speakerName: string
  avatarLabel: string
  avatarImageUrl?: string
  mood?: DialoguePortraitMood
  text: string
  nextNodeId?: string
  choices?: readonly DialogueChoice[]
}

export type DialoguePortraitId =
  | 'forestElder'
  | 'cityBarista'
  | 'parkTraveler'
  | 'snowGuide'
  | 'glassMaster'
  | 'innerGuide'

export type DialogueScript = {
  id: string
  title: string
  startNodeId: string
  portraitId?: DialoguePortraitId
  nodes: Record<string, DialogueNode>
}

export const NPC_PORTRAIT_URLS = {
  cityBarista: new URL(
    '../../assets/characters/city-barista-portrait-v1.png',
    import.meta.url,
  ).href,
  parkTraveler: new URL(
    '../../assets/characters/park-traveler-portrait-v1.png',
    import.meta.url,
  ).href,
  snowGuide: new URL(
    '../../assets/characters/snow-guide-portrait-v1.png',
    import.meta.url,
  ).href,
  glassMaster: new URL(
    '../../assets/characters/glass-master-portrait-v1.png',
    import.meta.url,
  ).href,
  innerGuide: new URL(
    '../../assets/characters/inner-guide-portrait-v1.png',
    import.meta.url,
  ).href,
} as const

export const FOREST_ELDER_PORTRAIT_URLS = {
  calm: new URL(
    '../../assets/characters/forest-elder-portrait-calm-v1.png',
    import.meta.url,
  ).href,
  thoughtful: new URL(
    '../../assets/characters/forest-elder-portrait-thoughtful-v1.png',
    import.meta.url,
  ).href,
  warm: new URL(
    '../../assets/characters/forest-elder-portrait-warm-v1.png',
    import.meta.url,
  ).href,
} as const satisfies Record<DialoguePortraitMood, string>

export function resolveDialogueAvatarUrl(
  node: DialogueNode,
  script?: DialogueScript,
): string | undefined {
  if (node.avatarImageUrl) {
    return node.avatarImageUrl
  }

  if (node.mood && script?.portraitId === 'forestElder') {
    return FOREST_ELDER_PORTRAIT_URLS[node.mood]
  }

  if (script?.portraitId === 'cityBarista') {
    return NPC_PORTRAIT_URLS.cityBarista
  }

  if (script?.portraitId === 'parkTraveler') {
    return NPC_PORTRAIT_URLS.parkTraveler
  }

  if (script?.portraitId === 'snowGuide') {
    return NPC_PORTRAIT_URLS.snowGuide
  }

  if (script?.portraitId === 'glassMaster') {
    return NPC_PORTRAIT_URLS.glassMaster
  }

  if (script?.portraitId === 'innerGuide') {
    return NPC_PORTRAIT_URLS.innerGuide
  }

  return undefined
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
    title: '森林長者',
    portraitId: 'forestElder',
    startNodeId: 'forest-ei-01',
    nodes: {
      'forest-ei-01': {
        id: 'forest-ei-01',
        speakerName: '森林長者',
        avatarLabel: '森',
        mood: 'calm',
        text: '今天的小徑很柔軟。黑糖，如果森林忽然安靜下來，你會怎麼找到前行的方向呢？',
        choices: [
          mbtiChoice(
            'forest-ei-01-a',
            '我會輕聲呼喚，問問附近有沒有人願意指路。',
            'forest-ei-01-r1',
            'forest-ei-01',
            'first',
          ),
          mbtiChoice(
            'forest-ei-01-b',
            '我會先停下來，慢慢看看周圍細小的線索。',
            'forest-ei-01-r2',
            'forest-ei-01',
            'second',
          ),
        ],
      },
      'forest-ei-01-r1': {
        id: 'forest-ei-01-r1',
        speakerName: '森林長者',
        avatarLabel: '森',
        mood: 'warm',
        text: '聲音也能成為一盞小燈。森林會記得那些願意溫柔開口的貓咪。',
        nextNodeId: 'forest-ei-02',
      },
      'forest-ei-01-r2': {
        id: 'forest-ei-01-r2',
        speakerName: '森林長者',
        avatarLabel: '森',
        mood: 'warm',
        text: '安靜的停頓也能成為指南針。森林會記得那些先傾聽再邁步的貓咪。',
        nextNodeId: 'forest-ei-02',
      },
      'forest-ei-02': {
        id: 'forest-ei-02',
        speakerName: '森林長者',
        avatarLabel: '森',
        mood: 'thoughtful',
        text: '當眼前出現一條新的小路時，你最先會怎麼做？',
        choices: [
          mbtiChoice(
            'forest-ei-02-a',
            '我會先沿著已經留下的腳印前進。',
            'forest-ei-02-r1',
            'forest-ei-02',
            'first',
          ),
          mbtiChoice(
            'forest-ei-02-b',
            '我會先感受風的方向，再選擇自己的步伐。',
            'forest-ei-02-r2',
            'forest-ei-02',
            'second',
          ),
        ],
      },
      'forest-ei-02-r1': {
        id: 'forest-ei-02-r1',
        speakerName: '森林長者',
        avatarLabel: '森',
        mood: 'warm',
        text: '有人走過的步伐，能讓路顯得更溫暖。繼續聽見你身邊的世界吧。',
        nextNodeId: 'forest-sn-01',
      },
      'forest-ei-02-r2': {
        id: 'forest-ei-02-r2',
        speakerName: '森林長者',
        avatarLabel: '森',
        mood: 'warm',
        text: '按照自己的節奏也很好。森林信任懂得自己步調的貓咪。',
        nextNodeId: 'forest-sn-01',
      },
      'forest-sn-01': {
        id: 'forest-sn-01',
        speakerName: '森林長者',
        avatarLabel: '森',
        mood: 'thoughtful',
        text: '一塊覆著青苔的石頭標記著路徑。你最先注意到什麼呢？',
        choices: [
          mbtiChoice(
            'forest-sn-01-a',
            '青苔細緻的形狀，還有石面微微潮濕的樣子。',
            'forest-sn-01-r1',
            'forest-sn-01',
            'first',
          ),
          mbtiChoice(
            'forest-sn-01-b',
            '這塊石頭像是看過許多旅人的那種感覺。',
            'forest-sn-01-r2',
            'forest-sn-01',
            'second',
          ),
        ],
      },
      'forest-sn-01-r1': {
        id: 'forest-sn-01-r1',
        speakerName: '森林長者',
        avatarLabel: '森',
        mood: 'warm',
        text: '小小的細節裡，也能藏著完整的地圖。你很會看見眼前真實存在的事物。',
        nextNodeId: 'forest-sn-02',
      },
      'forest-sn-01-r2': {
        id: 'forest-sn-01-r2',
        speakerName: '森林長者',
        avatarLabel: '森',
        mood: 'warm',
        text: '故事常常住在安靜的地方。你能感受到石頭記得的那些片刻。',
        nextNodeId: 'forest-sn-02',
      },
      'forest-sn-02': {
        id: 'forest-sn-02',
        speakerName: '森林長者',
        avatarLabel: '森',
        mood: 'thoughtful',
        text: '長者攤開兩顆漿果。你的第一個念頭會是什麼？',
        choices: [
          mbtiChoice(
            'forest-sn-02-a',
            '一顆比較鮮紅，另一顆的色澤稍微柔和一些。',
            'forest-sn-02-r1',
            'forest-sn-02',
            'first',
          ),
          mbtiChoice(
            'forest-sn-02-b',
            '它們像是一對很適合拿來送給誰的小禮物。',
            'forest-sn-02-r2',
            'forest-sn-02',
            'second',
          ),
        ],
      },
      'forest-sn-02-r1': {
        id: 'forest-sn-02-r1',
        speakerName: '森林長者',
        avatarLabel: '森',
        mood: 'warm',
        text: '你會先留意真實存在的樣子，再去想像更多。這會讓腳步更安心。',
        nextNodeId: 'forest-sn-03',
      },
      'forest-sn-02-r2': {
        id: 'forest-sn-02-r2',
        speakerName: '森林長者',
        avatarLabel: '森',
        mood: 'warm',
        text: '你總能很快感受到其中的意義。森林很喜歡這樣柔軟的心。',
        nextNodeId: 'forest-sn-03',
      },
      'forest-sn-03': {
        id: 'forest-sn-03',
        speakerName: '森林長者',
        avatarLabel: '森',
        mood: 'thoughtful',
        text: '雨水讓前方的腳印變得模糊柔軟。你會怎麼讀懂它們呢？',
        choices: [
          mbtiChoice(
            'forest-sn-03-a',
            '我會看每個腳印的深淺與前進方向。',
            'forest-sn-03-r1',
            'forest-sn-03',
            'first',
          ),
          mbtiChoice(
            'forest-sn-03-b',
            '我會想像是誰走過這裡，還有他為什麼走得那麼急。',
            'forest-sn-03-r2',
            'forest-sn-03',
            'second',
          ),
        ],
      },
      'forest-sn-03-r1': {
        id: 'forest-sn-03-r1',
        speakerName: '森林長者',
        avatarLabel: '森',
        mood: 'warm',
        text: '當路徑不太明朗時，清楚的事實也能是一種溫柔。',
        nextNodeId: 'farewell',
      },
      'forest-sn-03-r2': {
        id: 'forest-sn-03-r2',
        speakerName: '森林長者',
        avatarLabel: '森',
        mood: 'warm',
        text: '當路徑不太明朗時，留給可能性的空間也能是一種溫柔。',
        nextNodeId: 'farewell',
      },
      farewell: {
        id: 'farewell',
        speakerName: '森林長者',
        avatarLabel: '森',
        mood: 'calm',
        text: '把這句話帶著走吧。不是每個真實的答案，都需要很大聲。',
      },
    },
  },
  cityBarista: {
    id: 'city-barista',
    title: '咖啡師',
    portraitId: 'cityBarista',
    startNodeId: 'city-tf-01',
    nodes: {
      'city-tf-01': {
        id: 'city-tf-01',
        speakerName: '咖啡師',
        avatarLabel: '咖',
        text: '最後一班列車剛離開，朋友還站在月台上等著。你會先說什麼呢？',
        choices: [
          mbtiChoice(
            'city-tf-01-a',
            '我們先一起看看下一班車和接下來的路線吧。',
            'city-tf-01-r1',
            'city-tf-01',
            'first',
          ),
          mbtiChoice(
            'city-tf-01-b',
            '沒關係，我們可以一起慢慢找一條更安心的回家路。',
            'city-tf-01-r2',
            'city-tf-01',
            'second',
          ),
        ],
      },
      'city-tf-01-r1': {
        id: 'city-tf-01-r1',
        speakerName: '咖啡師',
        avatarLabel: '咖',
        text: '清楚的安排，能讓忙碌的街道也安靜一點。',
        nextNodeId: 'city-tf-02',
      },
      'city-tf-01-r2': {
        id: 'city-tf-01-r2',
        speakerName: '咖啡師',
        avatarLabel: '咖',
        text: '溫暖的話語，能讓忙碌的街道也安靜一點。',
        nextNodeId: 'city-tf-02',
      },
      'city-tf-02': {
        id: 'city-tf-02',
        speakerName: '咖啡師',
        avatarLabel: '咖',
        text: '眼前有兩個都行得通的方案，你會怎麼選呢？',
        choices: [
          mbtiChoice(
            'city-tf-02-a',
            '我會比較哪一個更快、更簡單。',
            'city-tf-02-r1',
            'city-tf-02',
            'first',
          ),
          mbtiChoice(
            'city-tf-02-b',
            '我會選讓大家都比較舒服安心的那一個。',
            'city-tf-02-r2',
            'city-tf-02',
            'second',
          ),
        ],
      },
      'city-tf-02-r1': {
        id: 'city-tf-02-r1',
        speakerName: '咖啡師',
        avatarLabel: '咖',
        text: '在城市裡，效率本身也有它溫柔的一面。',
        nextNodeId: 'city-tf-03',
      },
      'city-tf-02-r2': {
        id: 'city-tf-02-r2',
        speakerName: '咖啡師',
        avatarLabel: '咖',
        text: '在城市裡，體貼本身也有它細膩的智慧。',
        nextNodeId: 'city-tf-03',
      },
      'city-tf-03': {
        id: 'city-tf-03',
        speakerName: '咖啡師',
        avatarLabel: '咖',
        text: '深夜收到一則訊息時，什麼對你來說更重要呢？',
        choices: [
          mbtiChoice(
            'city-tf-03-a',
            '內容是不是足夠清楚、真誠。',
            'city-tf-03-r1',
            'city-tf-03',
            'first',
          ),
          mbtiChoice(
            'city-tf-03-b',
            '語氣是不是依然溫柔。',
            'city-tf-03-r2',
            'city-tf-03',
            'second',
          ),
        ],
      },
      'city-tf-03-r1': {
        id: 'city-tf-03-r1',
        speakerName: '咖啡師',
        avatarLabel: '咖',
        text: '真誠本身，也能是一種安靜的安慰。',
        nextNodeId: 'city-barista-farewell',
      },
      'city-tf-03-r2': {
        id: 'city-tf-03-r2',
        speakerName: '咖啡師',
        avatarLabel: '咖',
        text: '溫度本身，也能是一種安靜的安慰。',
        nextNodeId: 'city-barista-farewell',
      },
      'city-barista-farewell': {
        id: 'city-barista-farewell',
        speakerName: '咖啡師',
        avatarLabel: '咖',
        text: '距離會把時間拉長，但一杯飲品裡，依然可以裝下你們彼此的想念。',
      },
    },
  },
  cityTraveler: {
    id: 'city-traveler',
    title: '旅人',
    portraitId: 'parkTraveler',
    startNodeId: 'city-jp-01',
    nodes: {
      'city-jp-01': {
        id: 'city-jp-01',
        speakerName: '旅人',
        avatarLabel: '旅',
        text: '午後忽然多出一段自由時間，你覺得怎樣最剛好呢？',
        choices: [
          mbtiChoice(
            'city-jp-01-a',
            '把原本安排好的事情一件件完成。',
            'city-jp-01-r1',
            'city-jp-01',
            'first',
          ),
          mbtiChoice(
            'city-jp-01-b',
            '走向看起來最吸引我的街角。',
            'city-jp-01-r2',
            'city-jp-01',
            'second',
          ),
        ],
      },
      'city-jp-01-r1': {
        id: 'city-jp-01-r1',
        speakerName: '旅人',
        avatarLabel: '旅',
        text: '有條理的小清單，會讓空下來的一小時顯得很充裕。',
        nextNodeId: 'city-jp-02',
      },
      'city-jp-01-r2': {
        id: 'city-jp-01-r2',
        speakerName: '旅人',
        avatarLabel: '旅',
        text: '隨意漫遊的一小時，本身就像一份禮物。',
        nextNodeId: 'city-jp-02',
      },
      'city-jp-02': {
        id: 'city-jp-02',
        speakerName: '旅人',
        avatarLabel: '旅',
        text: '一家舒服的小咖啡館裡只剩一個空位，你會怎麼決定呢？',
        choices: [
          mbtiChoice(
            'city-jp-02-a',
            '我會先看菜單，決定好之後再坐下。',
            'city-jp-02-r1',
            'city-jp-02',
            'first',
          ),
          mbtiChoice(
            'city-jp-02-b',
            '我會先坐下來，讓當下的心情替我做選擇。',
            'city-jp-02-r2',
            'city-jp-02',
            'second',
          ),
        ],
      },
      'city-jp-02-r1': {
        id: 'city-jp-02-r1',
        speakerName: '旅人',
        avatarLabel: '旅',
        text: '早一點做決定，會留下更多餘裕去好好享受這一杯。',
        nextNodeId: 'city-traveler-farewell',
      },
      'city-jp-02-r2': {
        id: 'city-jp-02-r2',
        speakerName: '旅人',
        avatarLabel: '旅',
        text: '替當下留一點空白，會讓這一杯的味道更柔和。',
        nextNodeId: 'city-traveler-farewell',
      },
      'city-traveler-farewell': {
        id: 'city-traveler-farewell',
        speakerName: '旅人',
        avatarLabel: '旅',
        text: '有些路不會畫在地圖上，但依然很值得走一趟。',
      },
    },
  },
  timeMonster: {
    id: 'time-monster',
    title: '時間怪物',
    startNodeId: 'time-intro',
    nodes: {
      'time-intro': {
        id: 'time-intro',
        speakerName: '時間怪物',
        avatarLabel: '時',
        text: '你一路追著我跑過月台。別害怕，我不是來嚇你的。我只是兩個地方之間，被拉長的那些時光。',
        nextNodeId: 'time-wait',
      },
      'time-wait': {
        id: 'time-wait',
        speakerName: '時間怪物',
        avatarLabel: '時',
        text: '當在意的人離得很遠時，等待總會顯得有些沉重。我也一直背著那份重量。',
        nextNodeId: 'time-choice',
      },
      'time-choice': {
        id: 'time-choice',
        speakerName: '黑糖',
        avatarLabel: '糖',
        text: '你想對這段等待說些什麼呢？',
        choices: [
          {
            id: 'time-choice-a',
            label: '距離是真的，但我們好好放在心上的牽掛也是真的。',
            nextNodeId: 'time-understand',
            result: { kind: 'story', trigger: 'time-monster-understood' },
          },
          {
            id: 'time-choice-b',
            label: '我會溫柔地迎向這些時光，一個安靜片刻、一個安靜片刻地走過去。',
            nextNodeId: 'time-understand',
            result: { kind: 'story', trigger: 'time-monster-understood' },
          },
        ],
      },
      'time-understand': {
        id: 'time-understand',
        speakerName: '時間怪物',
        avatarLabel: '時',
        text: '這樣一來，我就不必再那麼龐大了。我也許可以變成一座橋。',
        nextNodeId: 'time-farewell',
      },
      'time-farewell': {
        id: 'time-farewell',
        speakerName: '時間怪物',
        avatarLabel: '時',
        text: '繼續往前吧，小貓。等你抵達之前，城市會替你把位置暖著。',
      },
    },
  },
  cityGuide: {
    id: 'city-guide',
    title: '城市嚮導',
    startNodeId: 'city-tf-01',
    nodes: {
      'city-tf-01': {
        id: 'city-tf-01',
        speakerName: '城市嚮導',
        avatarLabel: '城',
        text: '如果朋友錯過了最後一班電車，你會先說什麼呢？',
        choices: [
          mbtiChoice(
            'city-tf-01-a',
            '我們先一起看看下一班車和接下來的路線吧。',
            'city-tf-01-r1',
            'city-tf-01',
            'first',
          ),
          mbtiChoice(
            'city-tf-01-b',
            '沒關係，我們可以一起慢慢找一條更安心的回家路。',
            'city-tf-01-r2',
            'city-tf-01',
            'second',
          ),
        ],
      },
      'city-tf-01-r1': {
        id: 'city-tf-01-r1',
        speakerName: '城市嚮導',
        avatarLabel: '城',
        text: '清楚的安排，能讓忙碌的街道也安靜一點。',
        nextNodeId: 'city-tf-02',
      },
      'city-tf-01-r2': {
        id: 'city-tf-01-r2',
        speakerName: '城市嚮導',
        avatarLabel: '城',
        text: '溫暖的話語，能讓忙碌的街道也安靜一點。',
        nextNodeId: 'city-tf-02',
      },
      'city-tf-02': {
        id: 'city-tf-02',
        speakerName: '城市嚮導',
        avatarLabel: '城',
        text: '眼前有兩個都行得通的方案，你會怎麼選呢？',
        choices: [
          mbtiChoice(
            'city-tf-02-a',
            '我會比較哪一個更快、更簡單。',
            'city-tf-02-r1',
            'city-tf-02',
            'first',
          ),
          mbtiChoice(
            'city-tf-02-b',
            '我會選讓大家都比較舒服安心的那一個。',
            'city-tf-02-r2',
            'city-tf-02',
            'second',
          ),
        ],
      },
      'city-tf-02-r1': {
        id: 'city-tf-02-r1',
        speakerName: '城市嚮導',
        avatarLabel: '城',
        text: '在城市裡，效率本身也有它溫柔的一面。',
        nextNodeId: 'city-jp-01',
      },
      'city-tf-02-r2': {
        id: 'city-tf-02-r2',
        speakerName: '城市嚮導',
        avatarLabel: '城',
        text: '在城市裡，體貼本身也有它細膩的智慧。',
        nextNodeId: 'city-jp-01',
      },
      'city-jp-01': {
        id: 'city-jp-01',
        speakerName: '城市嚮導',
        avatarLabel: '城',
        text: '午後忽然多出一段自由時間，你覺得怎樣最剛好呢？',
        choices: [
          mbtiChoice(
            'city-jp-01-a',
            '把原本安排好的事情一件件完成。',
            'city-jp-01-r1',
            'city-jp-01',
            'first',
          ),
          mbtiChoice(
            'city-jp-01-b',
            '走向看起來最吸引我的街角。',
            'city-jp-01-r2',
            'city-jp-01',
            'second',
          ),
        ],
      },
      'city-jp-01-r1': {
        id: 'city-jp-01-r1',
        speakerName: '城市嚮導',
        avatarLabel: '城',
        text: '有條理的小清單，會讓空下來的一小時顯得很充裕。',
        nextNodeId: 'city-jp-02',
      },
      'city-jp-01-r2': {
        id: 'city-jp-01-r2',
        speakerName: '城市嚮導',
        avatarLabel: '城',
        text: '隨意漫遊的一小時，本身就像一份禮物。',
        nextNodeId: 'city-jp-02',
      },
      'city-jp-02': {
        id: 'city-jp-02',
        speakerName: '城市嚮導',
        avatarLabel: '城',
        text: '一家舒服的小咖啡館裡只剩一個空位，你會怎麼決定呢？',
        choices: [
          mbtiChoice(
            'city-jp-02-a',
            '我會先看菜單，決定好之後再坐下。',
            'city-jp-02-r1',
            'city-jp-02',
            'first',
          ),
          mbtiChoice(
            'city-jp-02-b',
            '我會先坐下來，讓當下的心情替我做選擇。',
            'city-jp-02-r2',
            'city-jp-02',
            'second',
          ),
        ],
      },
      'city-jp-02-r1': {
        id: 'city-jp-02-r1',
        speakerName: '城市嚮導',
        avatarLabel: '城',
        text: '早一點做決定，會留下更多餘裕去好好享受這一杯。',
        nextNodeId: 'city-farewell',
      },
      'city-jp-02-r2': {
        id: 'city-jp-02-r2',
        speakerName: '城市嚮導',
        avatarLabel: '城',
        text: '替當下留一點空白，會讓這一杯的味道更柔和。',
        nextNodeId: 'city-farewell',
      },
      'city-farewell': {
        id: 'city-farewell',
        speakerName: '城市嚮導',
        avatarLabel: '城',
        text: '城市走得很快，但你的步伐依然可以保持溫柔。',
      },
    },
  },
  snowSpirit: {
    id: 'snow-spirit',
    title: '雪靈',
    portraitId: 'snowGuide',
    startNodeId: 'snow-sn-01',
    nodes: {
      'snow-sn-01': {
        id: 'snow-sn-01',
        speakerName: '雪靈',
        avatarLabel: '雪',
        text: '白雪蓋住了舊有的腳印。這時候，你會相信什麼呢？',
        choices: [
          mbtiChoice(
            'snow-sn-01-a',
            '雪堆底下仍然露出的石階邊緣。',
            'snow-sn-01-r1',
            'snow-sn-01',
            'first',
          ),
          mbtiChoice(
            'snow-sn-01-b',
            '旅人們常停下腳步的地方，那一點淡淡的光。',
            'snow-sn-01-r2',
            'snow-sn-01',
            'second',
          ),
        ],
      },
      'snow-sn-01-r1': {
        id: 'snow-sn-01-r1',
        speakerName: '雪靈',
        avatarLabel: '雪',
        text: '那些還看得見的痕跡，能替冰冷的腳步帶路。',
        nextNodeId: 'snow-sn-02',
      },
      'snow-sn-01-r2': {
        id: 'snow-sn-01-r2',
        speakerName: '雪靈',
        avatarLabel: '雪',
        text: '那些心裡感受到的東西，也能替冰冷的腳步帶路。',
        nextNodeId: 'snow-sn-02',
      },
      'snow-sn-02': {
        id: 'snow-sn-02',
        speakerName: '雪靈',
        avatarLabel: '雪',
        text: '山風悄悄改變了雪堆的形狀。你會注意到什麼呢？',
        choices: [
          mbtiChoice(
            'snow-sn-02-a',
            '雪是怎麼堆在每一道樹根旁邊的。',
            'snow-sn-02-r1',
            'snow-sn-02',
            'first',
          ),
          mbtiChoice(
            'snow-sn-02-b',
            '整座山像是在風裡輕輕呼吸的樣子。',
            'snow-sn-02-r2',
            'snow-sn-02',
            'second',
          ),
        ],
      },
      'snow-sn-02-r1': {
        id: 'snow-sn-02-r1',
        speakerName: '雪靈',
        avatarLabel: '雪',
        text: '你會從山真正展現出的樣子裡讀懂它。',
        nextNodeId: 'snow-ei-01',
      },
      'snow-sn-02-r2': {
        id: 'snow-sn-02-r2',
        speakerName: '雪靈',
        avatarLabel: '雪',
        text: '你會從山帶出的氣息與暗示裡讀懂它。',
        nextNodeId: 'snow-ei-01',
      },
      'snow-ei-01': {
        id: 'snow-ei-01',
        speakerName: '雪靈',
        avatarLabel: '雪',
        text: '遠方亮著一盞小燈。你會怎麼做呢？',
        choices: [
          mbtiChoice(
            'snow-ei-01-a',
            '我會輕聲喊一喊，看看那裡是誰。',
            'snow-ei-01-r1',
            'snow-ei-01',
            'first',
          ),
          mbtiChoice(
            'snow-ei-01-b',
            '我會先安靜看著那道光，再慢慢決定。',
            'snow-ei-01-r2',
            'snow-ei-01',
            'second',
          ),
        ],
      },
      'snow-ei-01-r1': {
        id: 'snow-ei-01-r1',
        speakerName: '雪靈',
        avatarLabel: '雪',
        text: '小小的聲音，也能越過這片廣闊的白雪。',
        nextNodeId: 'snow-ei-02',
      },
      'snow-ei-01-r2': {
        id: 'snow-ei-01-r2',
        speakerName: '雪靈',
        avatarLabel: '雪',
        text: '小小的停頓，也能越過這片廣闊的白雪。',
        nextNodeId: 'snow-ei-02',
      },
      'snow-ei-02': {
        id: 'snow-ei-02',
        speakerName: '雪靈',
        avatarLabel: '雪',
        text: '山中的小屋暖暖的。你會選擇坐在哪裡呢？',
        choices: [
          mbtiChoice(
            'snow-ei-02-a',
            '靠近大家一點，坐在故事已經慢慢流動的地方。',
            'snow-ei-02-r1',
            'snow-ei-02',
            'first',
          ),
          mbtiChoice(
            'snow-ei-02-b',
            '坐在安靜的角落，望著窗外的雪景。',
            'snow-ei-02-r2',
            'snow-ei-02',
            'second',
          ),
        ],
      },
      'snow-ei-02-r1': {
        id: 'snow-ei-02-r1',
        speakerName: '雪靈',
        avatarLabel: '雪',
        text: '被分享出去的溫暖，會慢慢長大。',
        nextNodeId: 'snow-farewell',
      },
      'snow-ei-02-r2': {
        id: 'snow-ei-02-r2',
        speakerName: '雪靈',
        avatarLabel: '雪',
        text: '被安靜照料著的溫暖，也會慢慢長大。',
        nextNodeId: 'snow-farewell',
      },
      'snow-farewell': {
        id: 'snow-farewell',
        speakerName: '雪靈',
        avatarLabel: '雪',
        text: '雪會記得每一步輕輕走過的痕跡。',
      },
    },
  },
  snowSpiritBoss: {
    id: 'snow-spirit-boss',
    title: '雪靈',
    startNodeId: 'snow-boss-intro',
    nodes: {
      'snow-boss-intro': {
        id: 'snow-boss-intro',
        speakerName: '雪靈',
        avatarLabel: '雪',
        text: '你追著那道光，穿過一片片雪地。這座山收著許多離家很遠的旅程。',
        nextNodeId: 'snow-boss-travel',
      },
      'snow-boss-travel': {
        id: 'snow-boss-travel',
        speakerName: '雪靈',
        avatarLabel: '雪',
        text: '有些路會有點冷，可是只要一起走，距離就會變得柔和一些。',
        nextNodeId: 'snow-boss-choice',
      },
      'snow-boss-choice': {
        id: 'snow-boss-choice',
        speakerName: '黑糖',
        avatarLabel: '糖',
        text: '你想從這片遙遠的雪裡，帶走什麼呢？',
        choices: [
          {
            id: 'snow-boss-choice-a',
            label: '即使路很遠，也依然願意出發的那份記憶。',
            nextNodeId: 'snow-boss-understand',
            result: { kind: 'story', trigger: 'snow-spirit-understood' },
          },
          {
            id: 'snow-boss-choice-b',
            label: '不只終點，還有一路上慢慢找到的那些溫暖。',
            nextNodeId: 'snow-boss-understand',
            result: { kind: 'story', trigger: 'snow-spirit-understood' },
          },
        ],
      },
      'snow-boss-understand': {
        id: 'snow-boss-understand',
        speakerName: '雪靈',
        avatarLabel: '雪',
        text: '那麼，這座山就不是阻擋你的高牆，而是你一直沒有停下來的證明。',
        nextNodeId: 'snow-boss-farewell',
      },
      'snow-boss-farewell': {
        id: 'snow-boss-farewell',
        speakerName: '雪靈',
        avatarLabel: '雪',
        text: '把這份安靜帶著走吧。下一座山谷已經在等你了。',
      },
    },
  },
  glassMaster: {
    id: 'glass-master',
    title: '玻璃師傅',
    portraitId: 'glassMaster',
    startNodeId: 'glass-tf-01',
    nodes: {
      'glass-tf-01': {
        id: 'glass-tf-01',
        speakerName: '玻璃師傅',
        avatarLabel: '玻',
        text: '一只碗出現了一道細細的小裂痕。對你來說，最重要的是什麼呢？',
        choices: [
          mbtiChoice(
            'glass-tf-01-a',
            '它是不是還能安穩地盛住茶。',
            'glass-tf-01-r1',
            'glass-tf-01',
            'first',
          ),
          mbtiChoice(
            'glass-tf-01-b',
            '它是不是依然保有作為禮物的心意。',
            'glass-tf-01-r2',
            'glass-tf-01',
            'second',
          ),
        ],
      },
      'glass-tf-01-r1': {
        id: 'glass-tf-01-r1',
        speakerName: '玻璃師傅',
        avatarLabel: '玻',
        text: '實用與在乎，可以同時住在同一口呼吸裡。',
        nextNodeId: 'glass-tf-02',
      },
      'glass-tf-01-r2': {
        id: 'glass-tf-01-r2',
        speakerName: '玻璃師傅',
        avatarLabel: '玻',
        text: '意義與在乎，可以同時住在同一口呼吸裡。',
        nextNodeId: 'glass-tf-02',
      },
      'glass-tf-02': {
        id: 'glass-tf-02',
        speakerName: '玻璃師傅',
        avatarLabel: '玻',
        text: '有兩種釉色都能完成這只碗，你會怎麼決定呢？',
        choices: [
          mbtiChoice(
            'glass-tf-02-a',
            '我會先試試哪一種能讓玻璃保持最清澈。',
            'glass-tf-02-r1',
            'glass-tf-02',
            'first',
          ),
          mbtiChoice(
            'glass-tf-02-b',
            '我會選最像那段回憶感覺的那一種。',
            'glass-tf-02-r2',
            'glass-tf-02',
            'second',
          ),
        ],
      },
      'glass-tf-02-r1': {
        id: 'glass-tf-02-r1',
        speakerName: '玻璃師傅',
        avatarLabel: '玻',
        text: '清澈本身，也能是一種溫柔。',
        nextNodeId: 'glass-jp-01',
      },
      'glass-tf-02-r2': {
        id: 'glass-tf-02-r2',
        speakerName: '玻璃師傅',
        avatarLabel: '玻',
        text: '回憶本身，也能是一種溫柔。',
        nextNodeId: 'glass-jp-01',
      },
      'glass-jp-01': {
        id: 'glass-jp-01',
        speakerName: '玻璃師傅',
        avatarLabel: '玻',
        text: '窯燒的時程忽然改變了。你會怎麼回應呢？',
        choices: [
          mbtiChoice(
            'glass-jp-01-a',
            '我會重新安排今天，讓燒製的進度穩穩跟上。',
            'glass-jp-01-r1',
            'glass-jp-01',
            'first',
          ),
          mbtiChoice(
            'glass-jp-01-b',
            '我會讓慢一點的火候，教這只碗一些新的東西。',
            'glass-jp-01-r2',
            'glass-jp-01',
            'second',
          ),
        ],
      },
      'glass-jp-01-r1': {
        id: 'glass-jp-01-r1',
        speakerName: '玻璃師傅',
        avatarLabel: '玻',
        text: '有條理的安排，能保護脆弱而珍貴的作品。',
        nextNodeId: 'glass-jp-02',
      },
      'glass-jp-01-r2': {
        id: 'glass-jp-01-r2',
        speakerName: '玻璃師傅',
        avatarLabel: '玻',
        text: '保有彈性，也能保護脆弱而珍貴的作品。',
        nextNodeId: 'glass-jp-02',
      },
      'glass-jp-02': {
        id: 'glass-jp-02',
        speakerName: '玻璃師傅',
        avatarLabel: '玻',
        text: '玻璃上浮現了新的紋路。你會怎麼做呢？',
        choices: [
          mbtiChoice(
            'glass-jp-02-a',
            '我會先記下來，再細心調整下一件作品。',
            'glass-jp-02-r1',
            'glass-jp-02',
            'first',
          ),
          mbtiChoice(
            'glass-jp-02-b',
            '我會順著它走，看看這道紋路想帶我去哪裡。',
            'glass-jp-02-r2',
            'glass-jp-02',
            'second',
          ),
        ],
      },
      'glass-jp-02-r1': {
        id: 'glass-jp-02-r1',
        speakerName: '玻璃師傅',
        avatarLabel: '玻',
        text: '穩穩的專注，能把驚喜慢慢磨成美麗的樣子。',
        nextNodeId: 'glass-farewell',
      },
      'glass-jp-02-r2': {
        id: 'glass-jp-02-r2',
        speakerName: '玻璃師傅',
        avatarLabel: '玻',
        text: '好奇心，能把驚喜慢慢磨成美麗的樣子。',
        nextNodeId: 'glass-farewell',
      },
      'glass-farewell': {
        id: 'glass-farewell',
        speakerName: '玻璃師傅',
        avatarLabel: '玻',
        text: '每一只碗都會一路學習，直到它準備好被誰遇見。',
      },
    },
  },
  glassMasterBoss: {
    id: 'glass-master-boss',
    title: '玻璃師傅',
    startNodeId: 'glass-boss-intro',
    nodes: {
      'glass-boss-intro': {
        id: 'glass-boss-intro',
        speakerName: '玻璃師傅',
        avatarLabel: '玻',
        text: '你讓呼吸穩了下來。那團熔融的玻璃，正安靜地聽著你。',
        nextNodeId: 'glass-boss-shape',
      },
      'glass-boss-shape': {
        id: 'glass-boss-shape',
        speakerName: '玻璃師傅',
        avatarLabel: '玻',
        text: '一只碗不只是形狀而已。它也是你在塑形時，心裡帶著的那份耐心。',
        nextNodeId: 'glass-boss-choice',
      },
      'glass-boss-choice': {
        id: 'glass-boss-choice',
        speakerName: '黑糖',
        avatarLabel: '糖',
        text: '在玻璃慢慢冷卻的時候，我該握住什麼呢？',
        choices: [
          {
            id: 'glass-boss-choice-a',
            label: '即使碗口還有些微微搖晃，我也想握住每一次呼吸裡放進去的心意。',
            nextNodeId: 'glass-boss-understand',
            result: { kind: 'story', trigger: 'glass-master-understood' },
          },
          {
            id: 'glass-boss-choice-b',
            label: '我想握住那份盼望：即使弧線不完美，意義也依然能住在裡面。',
            nextNodeId: 'glass-boss-understand',
            result: { kind: 'story', trigger: 'glass-master-understood' },
          },
        ],
      },
      'glass-boss-understand': {
        id: 'glass-boss-understand',
        speakerName: '玻璃師傅',
        avatarLabel: '玻',
        text: '那就先把這第一只碗收下吧。它或許還不像記憶中的模樣，但它會陪你慢慢學會更多。',
        nextNodeId: 'glass-boss-farewell',
      },
      'glass-boss-farewell': {
        id: 'glass-boss-farewell',
        speakerName: '玻璃師傅',
        avatarLabel: '玻',
        text: '等你準備好了，我們再一起試一次。',
      },
    },
  },
  innerGuide: {
    id: 'inner-guide',
    title: '內在嚮導',
    portraitId: 'innerGuide',
    startNodeId: 'final-tf-01',
    nodes: {
      'final-tf-01': {
        id: 'final-tf-01',
        speakerName: '內在嚮導',
        avatarLabel: '心',
        text: '你已經快要找回那只碗了。是什麼讓你的腳步穩下來呢？',
        choices: [
          mbtiChoice(
            'final-tf-01-a',
            '知道自己已經盡力把每一步都走好了。',
            'final-tf-01-r1',
            'final-tf-01',
            'first',
          ),
          mbtiChoice(
            'final-tf-01-b',
            '知道這段旅程，早已溫柔地改變了我。',
            'final-tf-01-r2',
            'final-tf-01',
            'second',
          ),
        ],
      },
      'final-tf-01-r1': {
        id: 'final-tf-01-r1',
        speakerName: '內在嚮導',
        avatarLabel: '心',
        text: '認真而細心的努力，會慢慢長成安靜的勇氣。',
        nextNodeId: 'final-jp-01',
      },
      'final-tf-01-r2': {
        id: 'final-tf-01-r2',
        speakerName: '內在嚮導',
        avatarLabel: '心',
        text: '柔和而緩慢的成長，會慢慢長成安靜的勇氣。',
        nextNodeId: 'final-jp-01',
      },
      'final-jp-01': {
        id: 'final-jp-01',
        speakerName: '內在嚮導',
        avatarLabel: '心',
        text: '最後一段路分成了兩個方向。你會怎麼繼續往前呢？',
        choices: [
          mbtiChoice(
            'final-jp-01-a',
            '我會選擇自己原本準備好的那條路，穩穩走下去。',
            'final-jp-01-r1',
            'final-jp-01',
            'first',
          ),
          mbtiChoice(
            'final-jp-01-b',
            '如果途中有什麼讓我覺得對了，我也會替改變方向留一點空間。',
            'final-jp-01-r2',
            'final-jp-01',
            'second',
          ),
        ],
      },
      'final-jp-01-r1': {
        id: 'final-jp-01-r1',
        speakerName: '內在嚮導',
        avatarLabel: '心',
        text: '堅定地走下去，會讓結尾顯得更完整。',
        nextNodeId: 'final-ei-01',
      },
      'final-jp-01-r2': {
        id: 'final-jp-01-r2',
        speakerName: '內在嚮導',
        avatarLabel: '心',
        text: '保有開放的心，也會讓結尾顯得更完整。',
        nextNodeId: 'final-ei-01',
      },
      'final-ei-01': {
        id: 'final-ei-01',
        speakerName: '內在嚮導',
        avatarLabel: '心',
        text: '在那只碗回到你身邊之前，你想讓誰陪著你呢？',
        choices: [
          mbtiChoice(
            'final-ei-01-a',
            '那些一路陪我走、也陪我笑過的朋友。',
            'final-ei-01-r1',
            'final-ei-01',
            'first',
          ),
          mbtiChoice(
            'final-ei-01-b',
            '和我一路收集起來的回憶，安安靜靜待一會兒。',
            'final-ei-01-r2',
            'final-ei-01',
            'second',
          ),
        ],
      },
      'final-ei-01-r1': {
        id: 'final-ei-01-r1',
        speakerName: '內在嚮導',
        avatarLabel: '心',
        text: '能與人分享的喜悅，會讓一段旅程真正圓滿。',
        nextNodeId: 'final-farewell',
      },
      'final-ei-01-r2': {
        id: 'final-ei-01-r2',
        speakerName: '內在嚮導',
        avatarLabel: '心',
        text: '安靜留給自己的喜悅，也能讓一段旅程真正圓滿。',
        nextNodeId: 'final-farewell',
      },
      'final-farewell': {
        id: 'final-farewell',
        speakerName: '內在嚮導',
        avatarLabel: '心',
        text: '那只碗從來不只是玻璃。它一直都是你心裡模樣的輪廓。',
      },
    },
  },
  innerDoubtBoss: {
    id: 'inner-doubt-boss',
    title: '內在懷疑',
    startNodeId: 'doubt-intro',
    nodes: {
      'doubt-intro': {
        id: 'doubt-intro',
        speakerName: '內在懷疑',
        avatarLabel: '疑',
        text: '你又把一切重新拾起來了。你真的相信，這一次的碗會有什麼不同嗎？',
        nextNodeId: 'doubt-round-1',
      },
      'doubt-round-1': {
        id: 'doubt-round-1',
        speakerName: '內在懷疑',
        avatarLabel: '疑',
        text: '上一次的碗口還搖搖晃晃的。要是你只是再次重複同樣的失誤呢？',
        nextNodeId: 'doubt-round-2',
      },
      'doubt-round-2': {
        id: 'doubt-round-2',
        speakerName: '黑糖',
        avatarLabel: '糖',
        text: '這份懷疑好沉重。我該怎麼溫柔地回應它呢？',
        choices: [
          {
            id: 'doubt-round-2-a',
            label: '我不是想變得完美，我只是想好好待在這個當下。',
            nextNodeId: 'doubt-round-3',
          },
          {
            id: 'doubt-round-2-b',
            label: '每一次嘗試，都教會了我上一只碗還沒來得及告訴我的事。',
            nextNodeId: 'doubt-round-3',
          },
        ],
      },
      'doubt-round-3': {
        id: 'doubt-round-3',
        speakerName: '內在懷疑',
        avatarLabel: '疑',
        text: '當下很柔軟。可柔軟的東西，總像是很容易碎掉。',
        nextNodeId: 'doubt-choice',
      },
      'doubt-choice': {
        id: 'doubt-choice',
        speakerName: '黑糖',
        avatarLabel: '糖',
        text: '在玻璃慢慢冷卻的時候，我想相信什麼呢？',
        choices: [
          {
            id: 'doubt-choice-a',
            label: '相信努力本身，就已經是一份禮物。',
            nextNodeId: 'doubt-understand',
            result: { kind: 'story', trigger: 'inner-doubt-understood' },
          },
          {
            id: 'doubt-choice-b',
            label: '相信真正的意義，不需要毫無瑕疵的形狀。',
            nextNodeId: 'doubt-understand',
            result: { kind: 'story', trigger: 'inner-doubt-understood' },
          },
        ],
      },
      'doubt-understand': {
        id: 'doubt-understand',
        speakerName: '內在懷疑',
        avatarLabel: '疑',
        text: '那麼，我就先退到一旁吧。這只碗可以照著你的時間慢慢完成。',
        nextNodeId: 'doubt-farewell',
      },
      'doubt-farewell': {
        id: 'doubt-farewell',
        speakerName: '內在懷疑',
        avatarLabel: '疑',
        text: '繼續走下去吧。真正的輪廓，其實已經在慢慢成形了。',
      },
    },
  },
  perfectionismBoss: {
    id: 'perfectionism-boss',
    title: '完美主義',
    startNodeId: 'perfectionism-intro',
    nodes: {
      'perfectionism-intro': {
        id: 'perfectionism-intro',
        speakerName: '完美主義',
        avatarLabel: '完',
        text: '還不夠好。',
        nextNodeId: 'perfectionism-round-1',
      },
      'perfectionism-round-1': {
        id: 'perfectionism-round-1',
        speakerName: '完美主義',
        avatarLabel: '完',
        text: '再來一次。',
        nextNodeId: 'perfectionism-round-2',
      },
      'perfectionism-round-2': {
        id: 'perfectionism-round-2',
        speakerName: '完美主義',
        avatarLabel: '完',
        text: '再一次。',
        nextNodeId: 'perfectionism-choice-1',
      },
      'perfectionism-choice-1': {
        id: 'perfectionism-choice-1',
        speakerName: '黑糖',
        avatarLabel: '糖',
        text: '我聽見你了。可是我不需要把自己困在沒有盡頭的反覆嘗試裡。',
        choices: [
          {
            id: 'perfectionism-choice-1-a',
            label: '這只碗不需要毫無缺憾，也依然可以盛住愛。',
            nextNodeId: 'perfectionism-soften',
          },
          {
            id: 'perfectionism-choice-1-b',
            label: '我可以停在這裡，而它依然保有我放進去的全部心意。',
            nextNodeId: 'perfectionism-soften',
          },
        ],
      },
      'perfectionism-soften': {
        id: 'perfectionism-soften',
        speakerName: '完美主義',
        avatarLabel: '完',
        text: '如果你停下來了……還會剩下什麼？',
        nextNodeId: 'perfectionism-choice-2',
      },
      'perfectionism-choice-2': {
        id: 'perfectionism-choice-2',
        speakerName: '黑糖',
        avatarLabel: '糖',
        text: '當那些壓力終於安靜下來之後，還會留下什麼呢？',
        choices: [
          {
            id: 'perfectionism-choice-2-a',
            label: '留下的是，讓我一開始願意出發的那份在乎。',
            nextNodeId: 'perfectionism-understand',
            result: { kind: 'story', trigger: 'perfectionism-understood' },
          },
          {
            id: 'perfectionism-choice-2-b',
            label: '留下的是，那顆想好好送出真心的心。',
            nextNodeId: 'perfectionism-understand',
            result: { kind: 'story', trigger: 'perfectionism-understood' },
          },
        ],
      },
      'perfectionism-understand': {
        id: 'perfectionism-understand',
        speakerName: '完美主義',
        avatarLabel: '完',
        text: '那麼，我也不需要再一直大聲催促了。',
        nextNodeId: 'perfectionism-farewell',
      },
      'perfectionism-farewell': {
        id: 'perfectionism-farewell',
        speakerName: '完美主義',
        avatarLabel: '完',
        text: '讓這份禮物，就這樣已經足夠。',
      },
    },
  },
} as const satisfies Record<string, DialogueScript>

export type DialogueScriptId = keyof typeof DIALOGUE_SCRIPTS
