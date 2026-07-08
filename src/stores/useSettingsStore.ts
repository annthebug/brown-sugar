import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language } from '@/data/types';

interface SettingsState {
  bgmVolume: number; // 0..1
  soundVolume: number; // 0..1
  language: Language;
  setBgmVolume: (v: number) => void;
  setSoundVolume: (v: number) => void;
  setLanguage: (l: Language) => void;
}

// 設定：BGM / Sound / Language（見 docs/08_UIUX.md），持久化於 LocalStorage。
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      bgmVolume: 0.6,
      soundVolume: 0.8,
      language: 'zh-Hant',
      setBgmVolume: (v) => set({ bgmVolume: clamp01(v) }),
      setSoundVolume: (v) => set({ soundVolume: clamp01(v) }),
      setLanguage: (language) => set({ language }),
    }),
    { name: 'qftpb:settings' },
  ),
);

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}
