import type { ReactNode } from 'react';

/**
 * 舞台外框：維持一致的置中排版與暖色背景。
 * 遊戲設計目標解析度為 16:9，這裡以彈性容器包裹頁面內容。
 */
export function Stage({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 960,
          aspectRatio: '16 / 9',
          maxHeight: '100%',
          position: 'relative',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.45)',
          background: 'var(--color-bg-soft)',
        }}
      >
        {children}
      </div>
    </div>
  );
}
