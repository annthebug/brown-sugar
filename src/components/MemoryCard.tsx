import type { MemoryEntry } from '../stores/useGalleryStore'

type MemoryCardProps = {
  memory: MemoryEntry
  onReplay: () => void
}

export function MemoryCard({ memory, onReplay }: MemoryCardProps) {
  const label = `Memory ${memory.order}`

  return (
    <article className={`memory-card${memory.unlocked ? '' : ' memory-card--locked'}`}>
      <button
        type="button"
        className="memory-card-button"
        disabled={!memory.unlocked}
        aria-label={memory.unlocked ? `Replay ${label}` : `${label} locked`}
        onClick={onReplay}
      >
        <div className="memory-photo-frame">
          {memory.unlocked ? (
            <img src={memory.photoUrl} alt={label} />
          ) : (
            <>
              {memory.photoUrl ? (
                <img
                  src={memory.photoUrl}
                  alt=""
                  aria-hidden
                  className="memory-photo-silhouette"
                />
              ) : null}
              <div className="memory-lock-badge" aria-hidden="true">
                <span className="memory-lock-icon" />
              </div>
            </>
          )}
        </div>
      </button>
    </article>
  )
}
