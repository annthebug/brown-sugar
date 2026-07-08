export type GameEventMap = {
  'phaser:booted': { scene: string }
  'phaser:preload-progress': { scene: string; progress: number }
  'phaser:preload-error': {
    scene: string
    key: string
    assetLabel: string
    fileType: string
    url: string
  }
  'phaser:preloaded': { scene: string; assetCount: number; failedAssets: readonly string[] }
  'phaser:ready': { scene: string; message: string }
  'memory-shard-collected': { scene: string; amount: number }
}

type GameEventName = keyof GameEventMap

type GameEventHandler<TEventName extends GameEventName> = (
  payload: GameEventMap[TEventName],
) => void

const target = new EventTarget()

export const gameEventBus = {
  emit<TEventName extends GameEventName>(
    eventName: TEventName,
    payload: GameEventMap[TEventName],
  ) {
    target.dispatchEvent(new CustomEvent(eventName, { detail: payload }))
  },

  on<TEventName extends GameEventName>(
    eventName: TEventName,
    handler: GameEventHandler<TEventName>,
  ) {
    const listener = (event: Event) => {
      handler((event as CustomEvent<GameEventMap[TEventName]>).detail)
    }

    target.addEventListener(eventName, listener)

    return () => {
      target.removeEventListener(eventName, listener)
    }
  },
}
