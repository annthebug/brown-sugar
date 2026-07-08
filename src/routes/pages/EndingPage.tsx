import { useNavigate } from 'react-router-dom';
import { MenuButton } from '@/components/MenuButton';
import { useMbtiStore } from '@/stores/useMbtiStore';
import { getBowlForType } from '@/data/bowls';

/**
 * 結局頁：依 MBTI 結果顯示對應玻璃碗與 Credits（見 docs/07_MBTISystem.md）。
 * 目前為佔位；寶箱動畫與 Credits 捲動將於 Task 019 實作。
 */
export function EndingPage() {
  const navigate = useNavigate();
  const result = useMbtiStore((s) => s.result);
  const bowl = result ? getBowlForType(result) : undefined;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        textAlign: 'center',
        padding: 24,
      }}
    >
      <h2 style={{ margin: 0, color: 'var(--color-primary)' }}>結局 Ending</h2>
      {result ? (
        <p style={{ color: 'var(--color-text-dim)' }}>
          你的人格：{result}
          <br />
          專屬玻璃碗：{bowl?.name ?? '（待設計）'}
        </p>
      ) : (
        <p style={{ color: 'var(--color-text-dim)' }}>尚未完成旅程。</p>
      )}
      <p style={{ color: 'var(--color-text-dim)' }}>
        有些禮物，不用完美。真正重要的是：心意。
      </p>

      <MenuButton variant="ghost" onClick={() => navigate('/')}>
        ← Home
      </MenuButton>
    </div>
  );
}
