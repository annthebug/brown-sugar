import { useNavigate } from 'react-router-dom';
import { MenuButton } from '@/components/MenuButton';
import { useGalleryStore } from '@/stores/useGalleryStore';
import { MEMORIES } from '@/data/memories';

/**
 * 相簿頁：顯示已解鎖回憶（日期、一句話）。
 * 目前 MEMORIES 為佔位資料，動畫與照片將於後續任務實作（Task 017）。
 */
export function GalleryPage() {
  const navigate = useNavigate();
  const unlocked = useGalleryStore((s) => s.unlockedMemories);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        padding: 24,
        gap: 16,
        overflow: 'auto',
      }}
    >
      <h2 style={{ margin: 0, color: 'var(--color-primary)' }}>相簿 Gallery</h2>

      {MEMORIES.length === 0 ? (
        <p style={{ color: 'var(--color-text-dim)' }}>尚未定義任何回憶內容。</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: 12,
          }}
        >
          {MEMORIES.map((m) => {
            const isUnlocked = unlocked.includes(m.id);
            return (
              <div
                key={m.id}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: 'var(--color-panel)',
                  opacity: isUnlocked ? 1 : 0.4,
                }}
              >
                <div style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>
                  {isUnlocked ? m.date : '？？？'}
                </div>
                <div style={{ marginTop: 6 }}>
                  {isUnlocked ? m.caption : '尚未解鎖'}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <MenuButton variant="ghost" onClick={() => navigate('/')}>
        ← Home
      </MenuButton>
    </div>
  );
}
