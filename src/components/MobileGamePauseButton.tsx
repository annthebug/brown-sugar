type MobileGamePauseButtonProps = {
  visible: boolean
  onPause: () => void
}

export function MobileGamePauseButton({ visible, onPause }: MobileGamePauseButtonProps) {
  if (!visible) {
    return null
  }

  return (
    <button
      type="button"
      className="game-playfield-pause"
      onClick={onPause}
      aria-label="暫停"
    >
      暫停
    </button>
  )
}
