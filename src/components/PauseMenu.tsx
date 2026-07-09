import { Link } from 'react-router-dom'

type PauseMenuProps = {
  onResume: () => void
  onRestart: () => void
}

export function PauseMenu({ onResume, onRestart }: PauseMenuProps) {
  return (
    <section className="pause-overlay" aria-label="Pause menu">
      <article className="pause-menu">
        <p className="eyebrow">Paused</p>
        <h2>Take a gentle breath</h2>
        <p className="hero-copy">黑糖也在這裡等你，準備好再繼續旅程。</p>
        <div className="pause-menu-actions">
          <button type="button" onClick={onResume}>
            Resume
          </button>
          <Link to="/settings" className="secondary-action">
            Settings
          </Link>
          <button type="button" className="secondary-action" onClick={onRestart}>
            Restart
          </button>
          <Link to="/" className="secondary-action">
            Exit to Home
          </Link>
        </div>
      </article>
    </section>
  )
}
