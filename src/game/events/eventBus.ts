export type GameEventMap = {
  'phaser:booted': { scene: string }
  'phaser:preload-progress': { scene: string; progress: number }
  'phaser:preloaded': { scene: string; assetCount: number }
  'phaser:ready': { scene: string; message: string }
  'player:meow': { x: number; y: number }
  'player:collect': { x: number; y: number }
  'player:talk-start': Record<string, never>
  'player:talk-end': Record<string, never>
  'player:dash': { direction: 1 | -1 }
  'player:double-jump': { x: number; y: number }
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
