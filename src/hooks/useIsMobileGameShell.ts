import { useEffect, useState } from 'react'

const MOBILE_GAME_SHELL_QUERY = '(max-width: 820px), (pointer: coarse)'

function getInitialMobileMatch() {
  if (typeof window === 'undefined') {
    return false
  }

  return window.matchMedia(MOBILE_GAME_SHELL_QUERY).matches
}

export function useIsMobileGameShell() {
  const [isMobileGameShell, setIsMobileGameShell] = useState(getInitialMobileMatch)

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_GAME_SHELL_QUERY)

    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobileGameShell(event.matches)
    }

    setIsMobileGameShell(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return isMobileGameShell
}
