import { createBrowserRouter } from 'react-router-dom';
import App from '@/App';
import { HomePage } from '@/routes/pages/HomePage';
import { GamePage } from '@/routes/pages/GamePage';
import { GalleryPage } from '@/routes/pages/GalleryPage';
import { SettingsPage } from '@/routes/pages/SettingsPage';
import { EndingPage } from '@/routes/pages/EndingPage';

// 路由對照見 docs/11_TechnicalArchitecture.md
export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'game', element: <GamePage /> },
      { path: 'gallery', element: <GalleryPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'ending', element: <EndingPage /> },
    ],
  },
]);
