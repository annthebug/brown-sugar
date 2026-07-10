import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import Phaser from 'phaser'
import { createGameConfig } from '../game/config'
import { gameEventBus } from '../game/events/eventBus'

const IGNORED_SCENE_KEYS = new Set(['BootScene', 'PreloadScene'])

function getActiveGameplayScenes(game: Phaser.Game) {
  return game.scene
    .getScenes(true)
    .filter((scene) => scene.scene.isActive() && !IGNORED_SCENE_KEYS.has(scene.scene.key))
}

export type PhaserGameHandle = {
  pauseActiveScene: () => void
  resumeActiveScene: () => void
  restartActiveScene: () => void
}

type PhaserGameProps = {
  isPaused: boolean
}

export const PhaserGame = forwardRef<PhaserGameHandle, PhaserGameProps>(function PhaserGame(
  { isPaused },
  ref,
) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const gameRef = useRef<Phaser.Game | null>(null)
  const [status, setStatus] = useState('正在準備遊戲場景...')

  useImperativeHandle(ref, () => ({
    pauseActiveScene: () => {
      const game = gameRef.current
      if (!game) {
        return
      }

      getActiveGameplayScenes(game).forEach((scene) => {
        scene.scene.pause()
      })
    },
    resumeActiveScene: () => {
      const game = gameRef.current
      if (!game) {
        return
      }

      getActiveGameplayScenes(game).forEach((scene) => {
        scene.scene.resume()
      })
    },
    restartActiveScene: () => {
      const game = gameRef.current
      if (!game) {
        return
      }

      const activeScene = getActiveGameplayScenes(game)[0]

      if (!activeScene) {
        return
      }

      activeScene.scene.restart()
    },
  }))

  useEffect(() => {
    const unsubscribeReady = gameEventBus.on('phaser:ready', (payload) => {
      setStatus(payload.message)
    })

    const unsubscribeBooted = gameEventBus.on('phaser:booted', (payload) => {
      setStatus(`${payload.scene} 已啟動。`)
    })

    const unsubscribePreloadProgress = gameEventBus.on(
      'phaser:preload-progress',
      (payload) => {
        setStatus(`${payload.scene} 載入中 ${payload.progress}%。`)
      },
    )

    const unsubscribePreloaded = gameEventBus.on('phaser:preloaded', (payload) => {
      if (payload.failedAssets.length > 0) {
        setStatus(`${payload.scene} 載入失敗：${payload.failedAssets.join('、')}。`)
        return
      }

      setStatus(`${payload.scene} 已載入 ${payload.assetCount} 個佔位素材。`)
    })

    const unsubscribePreloadError = gameEventBus.on('phaser:preload-error', (payload) => {
      setStatus(`${payload.scene} 無法載入 ${payload.assetLabel}。`)
    })

    if (containerRef.current && !gameRef.current) {
      gameRef.current = new Phaser.Game(createGameConfig(containerRef.current))
    }

    return () => {
      unsubscribeReady()
      unsubscribeBooted()
      unsubscribePreloadProgress()
      unsubscribePreloaded()
      unsubscribePreloadError()
      gameRef.current?.destroy(true)
      gameRef.current = null
    }
  }, [])

  useEffect(() => {
    const game = gameRef.current
    if (!game) {
      return
    }

    getActiveGameplayScenes(game).forEach((scene) => {
      if (isPaused) {
        scene.scene.pause()
      } else {
        scene.scene.resume()
      }
    })
  }, [isPaused])

  return (
    <section className="game-card" aria-label="遊戲預覽">
      <div ref={containerRef} className="phaser-container" />
      <p className="game-status" role="status">
        {status}
      </p>
    </section>
  )
})
