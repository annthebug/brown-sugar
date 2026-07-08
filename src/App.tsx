import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { EndingPage } from './routes/EndingPage'
import { GalleryPage } from './routes/GalleryPage'
import { GamePage } from './routes/GamePage'
import { HomePage } from './routes/HomePage'
import { SettingsPage } from './routes/SettingsPage'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/ending" element={<EndingPage />} />
      </Routes>
    </BrowserRouter>
  )
}
