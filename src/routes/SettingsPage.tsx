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
        <p className="eyebrow">設定</p>
        <h1 id="settings-title">溫柔設定</h1>

        <label>
          語言
          <select
            value={language}
            onChange={() => setLanguage('zh-Hant')}
          >
            <option value="zh-Hant">繁體中文</option>
          </select>
        </label>

        <button
          type="button"
          onClick={() => {
            void toggleFullscreen()
          }}
        >
          全螢幕：{fullscreen ? '開啟' : '關閉'}
        </button>
      </section>
    </main>
  )
}
