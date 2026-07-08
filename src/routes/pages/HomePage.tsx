import { useNavigate } from 'react-router-dom';
import { MenuButton } from '@/components/MenuButton';
import { useGameStore } from '@/stores/useGameStore';

/** 首頁：Start / Continue / Gallery / Setting（見 docs/08_UIUX.md）。 */
export function HomePage() {
  const navigate = useNavigate();
  const hasSave = useGameStore((s) => s.hasSave());

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
      <h1 style={{ margin: 0, fontSize: 34, color: 'var(--color-primary)' }}>
        Quest for the Perfect Bowl
      </h1>
      <p style={{ margin: '0 0 12px', color: 'var(--color-text-dim)' }}>
        找回的不只是玻璃碗，而是一路走過的回憶。
      </p>

      <MenuButton onClick={() => navigate('/game')}>Start</MenuButton>
      <MenuButton
        variant="ghost"
        disabled={!hasSave}
        onClick={() => navigate('/game')}
        style={{ opacity: hasSave ? 1 : 0.5 }}
      >
        Continue
      </MenuButton>
      <MenuButton variant="ghost" onClick={() => navigate('/gallery')}>
        Gallery
      </MenuButton>
      <MenuButton variant="ghost" onClick={() => navigate('/settings')}>
        Setting
      </MenuButton>
    </div>
  );
}
