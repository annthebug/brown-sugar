import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Language = 'zh-Hant' | 'en'

type SettingsState = {
  language: Language
  fullscreen: boolean
  setLanguage: (language: Language) => void
  setFullscreen: (enabled: boolean) => void
  syncFullscreenFromDocument: () => void
  applyFullscreenPreference: () => Promise<void>
  toggleFullscreen: () => Promise<void>
}

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
      language: 'zh-Hant',
      fullscreen: false,
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
