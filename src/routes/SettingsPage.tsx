import { AppNav } from '../components/AppNav'
import { useSettingsStore } from '../stores/useSettingsStore'

export function SettingsPage() {
  const language = useSettingsStore((state) => state.language)
  const fullscreen = useSettingsStore((state) => state.fullscreen)
  const setLanguage = useSettingsStore((state) => state.setLanguage)
  const toggleFullscreen = useSettingsStore((state) => state.toggleFullscreen)

  return (
    <main className="page-shell" aria-labelledby="settings-title">
      <AppNav />
      <section className="page-card settings-card">
        <p className="eyebrow">Settings</p>
        <h1 id="settings-title">Gentle Controls</h1>

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

        <button
          type="button"
          onClick={() => {
            void toggleFullscreen()
          }}
        >
          Fullscreen: {fullscreen ? 'On' : 'Off'}
        </button>
      </section>
    </main>
  )
}
