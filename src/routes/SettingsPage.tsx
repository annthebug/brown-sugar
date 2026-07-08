import { AppNav } from '../components/AppNav'
import { useSettingsStore } from '../stores/useSettingsStore'

export function SettingsPage() {
  const bgmVolume = useSettingsStore((state) => state.bgmVolume)
  const soundVolume = useSettingsStore((state) => state.soundVolume)
  const language = useSettingsStore((state) => state.language)
  const fullscreen = useSettingsStore((state) => state.fullscreen)
  const setBgmVolume = useSettingsStore((state) => state.setBgmVolume)
  const setSoundVolume = useSettingsStore((state) => state.setSoundVolume)
  const setLanguage = useSettingsStore((state) => state.setLanguage)
  const toggleFullscreen = useSettingsStore((state) => state.toggleFullscreen)

  return (
    <main className="page-shell" aria-labelledby="settings-title">
      <AppNav />
      <section className="page-card settings-card">
        <p className="eyebrow">Settings</p>
        <h1 id="settings-title">Gentle Controls</h1>

        <label>
          BGM Volume: {bgmVolume}
          <input
            type="range"
            min="0"
            max="100"
            value={bgmVolume}
            onChange={(event) => setBgmVolume(event.currentTarget.valueAsNumber)}
          />
        </label>

        <label>
          Sound Volume: {soundVolume}
          <input
            type="range"
            min="0"
            max="100"
            value={soundVolume}
            onChange={(event) => setSoundVolume(event.currentTarget.valueAsNumber)}
          />
        </label>

        <label>
          Language
          <select
            value={language}
            onChange={(event) =>
              setLanguage(event.currentTarget.value === 'en' ? 'en' : 'zh-Hant')
            }
          >
            <option value="zh-Hant">繁體中文</option>
            <option value="en">English</option>
          </select>
        </label>

        <button type="button" onClick={toggleFullscreen}>
          Fullscreen preference: {fullscreen ? 'On' : 'Off'}
        </button>
      </section>
    </main>
  )
}
