import { Howl, Howler } from 'howler'
import { useSettingsStore } from '../stores/useSettingsStore'

const SOFT_CHIME_URL = new URL(
  '../../assets/audio/soft-chime-placeholder.wav',
  import.meta.url,
).href

export type BgmTrack = 'forest'
export type SfxName = 'meow' | 'jump' | 'memoryCollect' | 'dialogueAdvance'

const BGM_BASE_VOLUME: Record<BgmTrack, number> = {
  forest: 0.2,
}

const BGM_PLAYBACK: Record<BgmTrack, { rate: number; loop: boolean }> = {
  forest: { rate: 0.58, loop: true },
}

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

const SCENE_BGM: Readonly<Record<string, BgmTrack | null>> = {
  ForestScene: 'forest',
  CityScene: 'forest',
  GameScene: 'forest',
}

function toVolumeRatio(value: number) {
  return Math.min(Math.max(value, 0), 100) / 100
}

class AudioService {
  private initialized = false
  private unlocked = false
  private unlockListenersBound = false
  private pendingBgm: BgmTrack | null = null
  private activeBgm: BgmTrack | null = null
  private readonly bgmHowls = new Map<BgmTrack, Howl>()
  private readonly sfxHowls = new Map<SfxName, Howl>()
  private unsubscribeSettings?: () => void

  init() {
    if (this.initialized) {
      return
    }

    this.initialized = true

    ;(Object.keys(BGM_BASE_VOLUME) as BgmTrack[]).forEach((track) => {
      const playback = BGM_PLAYBACK[track]
      this.bgmHowls.set(
        track,
        new Howl({
          src: [SOFT_CHIME_URL],
          loop: playback.loop,
          rate: playback.rate,
          volume: 0,
          html5: false,
        }),
      )
    })

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
      if (
        state.bgmVolume !== previousState.bgmVolume ||
        state.soundVolume !== previousState.soundVolume
      ) {
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

    if (this.pendingBgm) {
      const pending = this.pendingBgm
      this.pendingBgm = null
      this.playBgm(pending)
    }
  }

  isUnlocked() {
    return this.unlocked
  }

  playBgm(track: BgmTrack) {
    if (!this.initialized) {
      this.init()
    }

    if (!this.unlocked) {
      this.pendingBgm = track
      return
    }

    if (this.activeBgm === track) {
      return
    }

    this.stopBgm()

    const howl = this.bgmHowls.get(track)

    if (!howl) {
      return
    }

    howl.play()
    this.activeBgm = track
  }

  stopBgm() {
    if (!this.activeBgm) {
      return
    }

    this.bgmHowls.get(this.activeBgm)?.stop()
    this.activeBgm = null
  }

  playSceneBgm(sceneKey: string) {
    const track = SCENE_BGM[sceneKey] ?? null

    if (!track) {
      this.stopBgm()
      return
    }

    this.playBgm(track)
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
    const { bgmVolume, soundVolume } = useSettingsStore.getState()
    const bgmRatio = toVolumeRatio(bgmVolume)
    const sfxRatio = toVolumeRatio(soundVolume)

    this.bgmHowls.forEach((howl, track) => {
      howl.volume(BGM_BASE_VOLUME[track] * bgmRatio)
    })

    this.sfxHowls.forEach((howl, name) => {
      howl.volume(SFX_BASE_VOLUME[name] * sfxRatio)
    })
  }

  dispose() {
    this.unsubscribeSettings?.()
    this.unsubscribeSettings = undefined
    this.stopBgm()
    this.bgmHowls.forEach((howl) => howl.unload())
    this.sfxHowls.forEach((howl) => howl.unload())
    this.bgmHowls.clear()
    this.sfxHowls.clear()
    this.initialized = false
    this.unlocked = false
    this.pendingBgm = null
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
