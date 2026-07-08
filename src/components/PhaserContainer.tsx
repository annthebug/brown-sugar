import { useEffect, useRef } from 'react';
import { createGame } from '@/game';
import type Phaser from 'phaser';

/**
 * 掛載 / 卸載 Phaser 遊戲實例的 React 容器。
 * React 只負責生命週期管理；遊戲內容由 Phaser Scene 負責（見 src/game/scenes）。
 */
export function PhaserContainer() {
  const hostRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!hostRef.current || gameRef.current) return;
    gameRef.current = createGame(hostRef.current);

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return <div ref={hostRef} className="phaser-container" />;
}
