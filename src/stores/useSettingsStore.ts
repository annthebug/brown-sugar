import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Language = 'zh-Hant' | 'en'

type SettingsState = {
  bgmVolume: number
  soundVolume: number
  language: Language
  fullscreen: boolean
  setBgmVolume: (volume: number) => void
  setSoundVolume: (volume: number) => void
  setLanguage: (language: Language) => void
  setFullscreen: (enabled: boolean) => void
  syncFullscreenFromDocument: () => void
  applyFullscreenPreference: () => Promise<void>
  toggleFullscreen: () => Promise<void>
}

const clampVolume = (volume: number) => Math.min(Math.max(volume, 0), 100)

async function requestAppFullscreen() {
  if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen()
  }
}

async function exitAppFullscreen() {
  if (document.fullscreenElement) {
    await document.exitFullscreen()
  }
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      bgmVolume: 70,
      soundVolume: 80,
      language: 'zh-Hant',
      fullscreen: false,
      setBgmVolume: (volume) => set({ bgmVolume: clampVolume(volume) }),
      setSoundVolume: (volume) => set({ soundVolume: clampVolume(volume) }),
      setLanguage: (language) => set({ language }),
      setFullscreen: (enabled) => set({ fullscreen: enabled }),
      syncFullscreenFromDocument: () => {
        set({ fullscreen: document.fullscreenElement !== null })
      },
      applyFullscreenPreference: async () => {
        const { fullscreen } = get()

        try {
          if (fullscreen) {
            await requestAppFullscreen()
          } else {
            await exitAppFullscreen()
          }

          set({ fullscreen: document.fullscreenElement !== null })
        } catch {
          set({ fullscreen: document.fullscreenElement !== null })
        }
      },
      toggleFullscreen: async () => {
        const wantsFullscreen = !get().fullscreen

        try {
          if (wantsFullscreen) {
            await requestAppFullscreen()
          } else {
            await exitAppFullscreen()
          }

          set({ fullscreen: document.fullscreenElement !== null })
        } catch {
          set({ fullscreen: document.fullscreenElement !== null })
        }
      },
    }),
    {
      name: 'perfect-bowl-settings',
    },
  ),
)
