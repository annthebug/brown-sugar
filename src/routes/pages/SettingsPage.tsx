import { useNavigate } from 'react-router-dom';
import { MenuButton } from '@/components/MenuButton';
import { useSettingsStore } from '@/stores/useSettingsStore';
import type { Language } from '@/data/types';

/** 設定頁：BGM / Sound / Language / Fullscreen（見 docs/08_UIUX.md）。 */
export function SettingsPage() {
  const navigate = useNavigate();
  const { bgmVolume, soundVolume, language, setBgmVolume, setSoundVolume, setLanguage } =
    useSettingsStore();

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void document.documentElement.requestFullscreen();
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 20,
        padding: 32,
        maxWidth: 520,
        margin: '0 auto',
      }}
    >
      <h2 style={{ margin: 0, color: 'var(--color-primary)' }}>設定 Setting</h2>

      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span>BGM 音量：{Math.round(bgmVolume * 100)}%</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={bgmVolume}
          onChange={(e) => setBgmVolume(Number(e.target.value))}
        />
      </label>

      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span>Sound 音量：{Math.round(soundVolume * 100)}%</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={soundVolume}
          onChange={(e) => setSoundVolume(Number(e.target.value))}
        />
      </label>

      <label style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <span>Language</span>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
        >
          <option value="zh-Hant">繁體中文</option>
          <option value="en">English</option>
        </select>
      </label>

      <MenuButton variant="ghost" onClick={toggleFullscreen}>
        切換 Fullscreen
      </MenuButton>

      <MenuButton variant="ghost" onClick={() => navigate('/')}>
        ← Home
      </MenuButton>
    </div>
  );
}
