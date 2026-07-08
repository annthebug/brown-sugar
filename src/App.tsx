import { Outlet } from 'react-router-dom';
import { Stage } from '@/components/Stage';

/**
 * 應用程式根佈局：提供置中的「舞台」外框，所有頁面透過 Outlet 呈現於其中。
 * 此處僅負責殼層排版；遊戲邏輯由 Phaser 層負責（見 src/game）。
 */
export default function App() {
  return (
    <Stage>
      <Outlet />
    </Stage>
  );
}
