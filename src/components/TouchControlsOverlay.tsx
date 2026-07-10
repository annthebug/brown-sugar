import { useCallback, useEffect, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { resetTouchInput, setTouchInput, type TouchInputKey } from '../game/input/touchInputBridge'

type TouchControlsOverlayProps = {
  visible: boolean
}

type HoldButtonProps = {
  label: string
  touchKey: Extract<TouchInputKey, 'left' | 'right' | 'jump'>
  className?: string
  size?: 'normal' | 'large'
}

type TapButtonProps = {
  label: string
  touchKey: Extract<TouchInputKey, 'dash' | 'meow' | 'talk'>
  className?: string
}

function HoldButton({ label, touchKey, className, size = 'normal' }: HoldButtonProps) {
  const [active, setActive] = useState(false)

  const release = useCallback(() => {
    setActive(false)
    setTouchInput(touchKey, false)
  }, [touchKey])

  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    setActive(true)
    setTouchInput(touchKey, true)
  }

  const handlePointerUp = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    release()
  }

  return (
    <button
      type="button"
      className={[
        'touch-control-btn',
        'touch-control-btn--dpad',
        size === 'large' ? 'touch-control-btn--large' : '',
        active ? 'is-active' : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={label}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={release}
      onLostPointerCapture={release}
    >
      {label}
    </button>
  )
}

function TapButton({ label, touchKey, className }: TapButtonProps) {
  const [active, setActive] = useState(false)

  const pulse = useCallback(() => {
    setActive(true)
    setTouchInput(touchKey, true)
    window.setTimeout(() => {
      setTouchInput(touchKey, false)
      setActive(false)
    }, 80)
  }, [touchKey])

  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault()
    pulse()
  }

  return (
    <button
      type="button"
      className={[
        'touch-control-btn',
        'touch-control-btn--action',
        active ? 'is-active' : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={label}
      onPointerDown={handlePointerDown}
    >
      {label}
    </button>
  )
}

export function TouchControlsOverlay({ visible }: TouchControlsOverlayProps) {
  useEffect(() => {
    if (!visible) {
      resetTouchInput()
    }

    return () => {
      resetTouchInput()
    }
  }, [visible])

  if (!visible) {
    return null
  }

  return (
    <div className="touch-controls-overlay" aria-hidden="true">
      <div className="touch-controls-cluster touch-controls-cluster--left">
        <HoldButton label="◀" touchKey="left" />
        <HoldButton label="▶" touchKey="right" />
      </div>
      <div className="touch-controls-cluster touch-controls-cluster--right">
        <TapButton label="Talk" touchKey="talk" className="touch-btn-talk" />
        <HoldButton label="Jump" touchKey="jump" className="touch-btn-jump" size="large" />
        <TapButton label="Dash" touchKey="dash" className="touch-btn-dash" />
        <TapButton label="Meow" touchKey="meow" className="touch-btn-meow" />
      </div>
    </div>
  )
}
