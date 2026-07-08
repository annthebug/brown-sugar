import { useNavigate } from 'react-router-dom';
import { PhaserContainer } from '@/components/PhaserContainer';

/**
 * 遊戲頁：掛載 Phaser 畫布。
 * 目前僅載入啟動 / 預載 / 主選單佔位場景，尚未實作玩法。
 */
export function GamePage() {
  const navigate = useNavigate();

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <PhaserContainer />
      <button
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          padding: '6px 12px',
          background: 'rgba(0,0,0,0.4)',
          color: 'var(--color-text)',
          border: '1px solid var(--color-text-dim)',
          borderRadius: 6,
          zIndex: 10,
        }}
      >
        ← Home
      </button>
    </div>
  );
}
