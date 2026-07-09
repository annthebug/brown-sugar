import { Howl, Howler } from 'howler'
import { useSettingsStore } from '../stores/useSettingsStore'

const SOFT_CHIME_URL = new URL(
  '../../assets/audio/soft-chime-placeholder.wav',
  import.meta.url,
).href

export type SfxName = 'meow' | 'jump' | 'memoryCollect' | 'dialogueAdvance'

const SFX_BASE_VOLUME: Record<SfxName, number> = {
  meow: 0.55,
  jump: 0.38,
  memoryCollect: 0.5,
  dialogueAdvance: 0.42,
}

const SFX_PLAYBACK: Record<SfxName, number> = {
  meow: 1.05,
  jump: 1.35,
  memoryCollect: 0.95,
  dialogueAdvance: 1.2,
}

function toVolumeRatio(value: number) {
  return Math.min(Math.max(value, 0), 100) / 100
}

class AudioService {
  private initialized = false
  private unlocked = false
  private unlockListenersBound = false
  private readonly sfxHowls = new Map<SfxName, Howl>()
  private unsubscribeSettings?: () => void

  init() {
    if (this.initialized) {
      return
    }

    this.initialized = true

    ;(Object.keys(SFX_BASE_VOLUME) as SfxName[]).forEach((name) => {
      this.sfxHowls.set(
        name,
        new Howl({
          src: [SOFT_CHIME_URL],
          loop: false,
          rate: SFX_PLAYBACK[name],
          volume: 0,
          html5: false,
        }),
      )
    })

    this.unsubscribeSettings = useSettingsStore.subscribe((state, previousState) => {
      if (state.soundVolume !== previousState.soundVolume) {
        this.applySettingsVolumes()
      }
    })

    this.applySettingsVolumes()
    this.bindUnlockListeners()
  }

  unlock() {
    if (!this.initialized) {
      this.init()
    }

    if (this.unlocked) {
      return
    }

    void Howler.ctx?.resume()
    this.unlocked = true
  }

  isUnlocked() {
    return this.unlocked
  }

  playSfx(name: SfxName) {
    if (!this.initialized) {
      this.init()
    }

    if (!this.unlocked) {
      return
    }

    this.sfxHowls.get(name)?.play()
  }

  applySettingsVolumes() {
    const { soundVolume } = useSettingsStore.getState()
    const sfxRatio = toVolumeRatio(soundVolume)

    this.sfxHowls.forEach((howl, name) => {
      howl.volume(SFX_BASE_VOLUME[name] * sfxRatio)
    })
  }

  dispose() {
    this.unsubscribeSettings?.()
    this.unsubscribeSettings = undefined
    this.sfxHowls.forEach((howl) => howl.unload())
    this.sfxHowls.clear()
    this.initialized = false
    this.unlocked = false
    this.unlockListenersBound = false
  }

  private bindUnlockListeners() {
    if (this.unlockListenersBound || typeof window === 'undefined') {
      return
    }

    this.unlockListenersBound = true

    const unlock = () => {
      this.unlock()
    }

    window.addEventListener('pointerdown', unlock, { once: true, passive: true })
    window.addEventListener('keydown', unlock, { once: true })
    window.addEventListener('touchstart', unlock, { once: true, passive: true })
  }
}

export const audioService = new AudioService()
