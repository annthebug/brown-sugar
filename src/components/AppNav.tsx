import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: '首頁' },
  { to: '/game', label: '遊戲' },
  { to: '/gallery', label: '相簿' },
  { to: '/settings', label: '設定' },
  { to: '/ending', label: '結局' },
]

export function AppNav() {
  return (
    <nav className="app-nav" aria-label="主要導覽">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => (isActive ? 'active' : undefined)}
          end={item.to === '/'}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
