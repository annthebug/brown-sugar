import { useEffect } from 'react'
import type { AchievementToast } from '../stores/useAchievementStore'

type AchievementToastStackProps = {
  toasts: AchievementToast[]
  onDismiss: (id: AchievementToast['id']) => void
}

export function AchievementToastStack({ toasts, onDismiss }: AchievementToastStackProps) {
  useEffect(() => {
    if (toasts.length === 0) {
      return
    }

    const nextToast = toasts[0]
    const timer = window.setTimeout(() => {
      onDismiss(nextToast.id)
    }, 3200)

    return () => {
      window.clearTimeout(timer)
    }
  }, [onDismiss, toasts])

  if (toasts.length === 0) {
    return null
  }

  return (
    <div className="achievement-toast-stack" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <section key={toast.id} className="achievement-toast" aria-label={`Achievement unlocked: ${toast.title}`}>
          <p className="panel-label">Achievement unlocked</p>
          <strong>{toast.title}</strong>
          <p>{toast.description}</p>
          <button type="button" className="achievement-toast-close" onClick={() => onDismiss(toast.id)}>
            Close
          </button>
        </section>
      ))}
    </div>
  )
}
