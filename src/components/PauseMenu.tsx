import { Link } from 'react-router-dom'

type PauseMenuProps = {
  onResume: () => void
  onRestart: () => void
}

export function PauseMenu({ onResume, onRestart }: PauseMenuProps) {
  return (
    <section className="pause-overlay" aria-label="暫停選單">
      <article className="pause-menu">
        <p className="eyebrow">已暫停</p>
        <h2>先慢慢呼吸一下</h2>
        <p className="hero-copy">黑糖也在這裡等你，準備好再繼續旅程。</p>
        <div className="pause-menu-actions">
          <button type="button" onClick={onResume}>
            繼續
          </button>
          <Link to="/settings" className="secondary-action">
            設定
          </Link>
          <button type="button" className="secondary-action" onClick={onRestart}>
            重新開始本章
          </button>
          <Link to="/" className="secondary-action">
            返回首頁
          </Link>
        </div>
      </article>
    </section>
  )
}
