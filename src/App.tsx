import { GamePage } from './routes/GamePage'
import { HomePage } from './routes/HomePage'

export function App() {
  if (window.location.pathname === '/game') {
    return <GamePage />
  }

  return <HomePage />
}
