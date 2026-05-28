import { NavLink } from 'react-router-dom'

const NAV = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/catches', label: 'Catches', icon: '🐟' },
  { to: '/add', label: 'Add', icon: '➕', isAdd: true },
  { to: '/map', label: 'Map', icon: '🗺️' },
  { to: '/profile', label: 'Profile', icon: '👤' },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {NAV.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            `nav-item${item.isAdd ? ' nav-item-add' : ''}${isActive ? ' nav-active' : ''}`
          }
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
