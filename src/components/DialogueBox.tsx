import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  resolveDialogueAvatarUrl,
  type DialogueChoice,
  type DialogueChoiceResult,
  type DialogueScript,
} from '../data/dialogues'

type DialogueBoxProps = {
  script: DialogueScript
  onChoiceResult: (result: DialogueChoiceResult, choice: DialogueChoice) => void
  onClose: () => void
}

const TYPEWRITER_INTERVAL_MS = 24

type TypewriterTextProps = {
  text: string
  isRevealed: boolean
  onComplete: () => void
}

function TypewriterText({ text, isRevealed, onComplete }: TypewriterTextProps) {
  const [characterCount, setCharacterCount] = useState(0)

  useEffect(() => {
    if (isRevealed) {
      return
    }

    let currentIndex = 0
    const intervalId = window.setInterval(() => {
      currentIndex += 1
      setCharacterCount(currentIndex)

      if (currentIndex >= text.length) {
        window.clearInterval(intervalId)
        onComplete()
      }
    }, TYPEWRITER_INTERVAL_MS)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [isRevealed, onComplete, text])

  return <>{isRevealed ? text : text.slice(0, characterCount)}</>
}

export function DialogueBox({ script, onChoiceResult, onClose }: DialogueBoxProps) {
  const [nodeId, setNodeId] = useState(script.startNodeId)
  const [isTextRevealed, setIsTextRevealed] = useState(false)
  const currentNode = useMemo(() => script.nodes[nodeId], [nodeId, script.nodes])

  const finishTyping = useCallback(() => {
    setIsTextRevealed(true)
  }, [])

  if (!currentNode) {
    return null
  }

  const continueDialogue = () => {
    if (!isTextRevealed) {
      finishTyping()
      return
    }

    if (currentNode.nextNodeId) {
      setIsTextRevealed(false)
      setNodeId(currentNode.nextNodeId)
      return
    }

    onClose()
  }

  const chooseOption = (choice: DialogueChoice) => {
    if (!isTextRevealed) {
      finishTyping()
      return
    }

    if (choice.result) {
      onChoiceResult(choice.result, choice)
    }

    setIsTextRevealed(false)
    setNodeId(choice.nextNodeId)
  }

  const showChoices = isTextRevealed && currentNode.choices && currentNode.choices.length > 0
  const avatarImageUrl = resolveDialogueAvatarUrl(currentNode)

  return (
    <section className="dialogue-overlay" aria-label={script.title}>
      <article className="dialogue-box">
        <div className="dialogue-avatar" aria-hidden="true">
          {avatarImageUrl ? (
            <img
              key={currentNode.id}
              src={avatarImageUrl}
              alt=""
              className="dialogue-avatar-image"
              width={64}
              height={64}
            />
          ) : (
            currentNode.avatarLabel
          )}
        </div>
        <div className="dialogue-content">
          <p className="dialogue-speaker">{currentNode.speakerName}</p>
          <p className="dialogue-text">
            <TypewriterText
              key={currentNode.id}
              text={currentNode.text}
              isRevealed={isTextRevealed}
              onComplete={finishTyping}
            />
          </p>
          {showChoices ? (
            <div className="dialogue-choices" aria-label="對話選項">
              {currentNode.choices?.map((choice) => (
                <button key={choice.id} type="button" onClick={() => chooseOption(choice)}>
                  {choice.label}
                </button>
              ))}
            </div>
          ) : (
            <button type="button" className="dialogue-continue" onClick={continueDialogue}>
              {!isTextRevealed ? '顯示文字' : currentNode.nextNodeId ? '繼續' : '關閉'}
            </button>
          )}
        </div>
      </article>
    </section>
  )
}
