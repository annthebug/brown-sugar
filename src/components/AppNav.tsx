import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/game', label: 'Game' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/settings', label: 'Settings' },
  { to: '/ending', label: 'Ending' },
]

export function AppNav() {
  return (
    <nav className="app-nav" aria-label="Primary navigation">
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
