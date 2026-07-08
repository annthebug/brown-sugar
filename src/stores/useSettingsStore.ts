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
  toggleFullscreen: () => void
}

const clampVolume = (volume: number) => Math.min(Math.max(volume, 0), 100)

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      bgmVolume: 70,
      soundVolume: 80,
      language: 'zh-Hant',
      fullscreen: false,
      setBgmVolume: (volume) => set({ bgmVolume: clampVolume(volume) }),
      setSoundVolume: (volume) => set({ soundVolume: clampVolume(volume) }),
      setLanguage: (language) => set({ language }),
      toggleFullscreen: () => set((state) => ({ fullscreen: !state.fullscreen })),
    }),
    {
      name: 'perfect-bowl-settings',
    },
  ),
)
