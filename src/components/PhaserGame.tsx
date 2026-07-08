import { useEffect, useRef, useState } from 'react'
import Phaser from 'phaser'
import { createGameConfig } from '../game/config'
import { gameEventBus } from '../game/events/eventBus'

export function PhaserGame() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const gameRef = useRef<Phaser.Game | null>(null)
  const [status, setStatus] = useState('Preparing Phaser...')

  useEffect(() => {
    const unsubscribeReady = gameEventBus.on('phaser:ready', (payload) => {
      setStatus(payload.message)
    })

    const unsubscribeBooted = gameEventBus.on('phaser:booted', (payload) => {
      setStatus(`${payload.scene} started.`)
    })

    const unsubscribePreloadProgress = gameEventBus.on(
      'phaser:preload-progress',
      (payload) => {
        setStatus(`${payload.scene} loading ${payload.progress}%.`)
      },
    )

    const unsubscribePreloaded = gameEventBus.on('phaser:preloaded', (payload) => {
      setStatus(`${payload.scene} loaded ${payload.assetCount} assets.`)
    })

    if (containerRef.current && !gameRef.current) {
      gameRef.current = new Phaser.Game(createGameConfig(containerRef.current))
    }

    return () => {
      unsubscribeReady()
      unsubscribeBooted()
      unsubscribePreloadProgress()
      unsubscribePreloaded()
      gameRef.current?.destroy(true)
      gameRef.current = null
    }
  }, [])

  return (
    <section className="game-card" aria-label="Phaser game preview">
      <div ref={containerRef} className="phaser-container" />
      <p className="game-status" role="status">
        {status}
      </p>
    </section>
  )
}
