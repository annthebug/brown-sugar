import { ACHIEVEMENT_DEFINITIONS } from '../data/achievements'
import type { AchievementId } from '../data/achievements'

type AchievementPanelProps = {
  unlockedIds: AchievementId[]
}

export function AchievementPanel({ unlockedIds }: AchievementPanelProps) {
  return (
    <section className="page-card achievement-panel" aria-labelledby="achievement-panel-title">
      <div className="achievement-panel-header">
        <div>
          <p className="eyebrow">Achievements</p>
          <h2 id="achievement-panel-title">Gentle Milestones</h2>
        </div>
        <strong>
          {unlockedIds.length} / {ACHIEVEMENT_DEFINITIONS.length}
        </strong>
      </div>
      <div className="achievement-list">
        {ACHIEVEMENT_DEFINITIONS.map((achievement) => {
          const unlocked = unlockedIds.includes(achievement.id)

          return (
            <article
              key={achievement.id}
              className={`achievement-card ${unlocked ? 'achievement-card--unlocked' : 'achievement-card--locked'}`}
            >
              <p className="panel-label">{unlocked ? 'Unlocked' : 'Waiting'}</p>
              <strong>{achievement.title}</strong>
              <p>{achievement.description}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
