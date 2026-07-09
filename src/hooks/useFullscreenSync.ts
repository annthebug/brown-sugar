import { useEffect } from 'react'
import { useSettingsStore } from '../stores/useSettingsStore'

export function useFullscreenSync() {
  const syncFullscreenFromDocument = useSettingsStore((state) => state.syncFullscreenFromDocument)

  useEffect(() => {
    syncFullscreenFromDocument()

    const handleFullscreenChange = () => {
      syncFullscreenFromDocument()
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [syncFullscreenFromDocument])
}
