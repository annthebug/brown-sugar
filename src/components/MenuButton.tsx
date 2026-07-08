import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'ghost';

interface MenuButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

/** 選單按鈕，暖色 Pixel 風格。純樣式元件，行為由呼叫端提供。 */
export function MenuButton({
  variant = 'primary',
  style,
  ...props
}: MenuButtonProps) {
  const isPrimary = variant === 'primary';
  return (
    <button
      {...props}
      style={{
        minWidth: 200,
        padding: '12px 20px',
        fontSize: 18,
        letterSpacing: 1,
        color: isPrimary ? '#2b1d14' : 'var(--color-text)',
        background: isPrimary ? 'var(--color-primary)' : 'transparent',
        border: `2px solid ${isPrimary ? 'var(--color-primary-strong)' : 'var(--color-text-dim)'}`,
        borderRadius: 8,
        transition: 'transform 0.08s ease, background 0.15s ease',
        ...style,
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'translateY(2px)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {props.children}
    </button>
  );
}
