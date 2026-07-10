import { useEffect, useState } from 'react'
import { shouldShowTouchControlsInBrowser } from '../game/input/touchInputEnvironment'

export function useShouldShowTouchControls() {
  const [shouldShow, setShouldShow] = useState(shouldShowTouchControlsInBrowser)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 820px), (pointer: coarse)')

    const update = () => {
      setShouldShow(shouldShowTouchControlsInBrowser())
    }

    update()
    mediaQuery.addEventListener('change', update)
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)

    return () => {
      mediaQuery.removeEventListener('change', update)
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [])

  return shouldShow
}
