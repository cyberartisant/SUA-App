import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const { user } = useAuth()
  return (
    <header className="header">
      <Link to="/" className="header-logo">
        <img src="/logo.png" alt="SUA Fishing" className="header-logo-img" />
        SUA Fishing
      </Link>
      <div className="header-right">
        {user && <span className="header-greeting">Hey, {user.name.split(' ')[0]}!</span>}
        <a
          href="https://suafishing.com"
          target="_blank"
          rel="noopener noreferrer"
          className="header-site-link"
        >
          suafishing.com ↗
        </a>
      </div>
    </header>
  )
}
