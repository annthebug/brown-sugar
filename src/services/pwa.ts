import { useEffect, useMemo, useState } from 'react'
import { registerSW } from 'virtual:pwa-register'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
}

const updateServiceWorker = registerSW({
  immediate: true,
  onRegistered(registration) {
    if (!registration) {
      return
    }

    registration.update().catch(() => {
      return
    })
  },
  onRegisterError(error) {
    console.error('PWA registration failed', error)
  },
})

export function usePwaInstall() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(() => {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    )
  })

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event as BeforeInstallPromptEvent)
    }

    const handleInstalled = () => {
      setInstallPrompt(null)
      setIsInstalled(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleInstalled)
    }
  }, [])

  const canInstall = useMemo(() => Boolean(installPrompt) && !isInstalled, [installPrompt, isInstalled])

  return {
    canInstall,
    isInstalled,
    install: async () => {
      if (!installPrompt) {
        return false
      }

      await installPrompt.prompt()
      const choice = await installPrompt.userChoice
      setInstallPrompt(null)
      return choice.outcome === 'accepted'
    },
    checkForUpdates: () => updateServiceWorker(true),
  }
}
