import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const { pathname } = useLocation()
  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/recipes', label: 'Recipes' },
    { to: '/calculator', label: 'Calculator' },
    { to: '/meal-planner', label: 'Planner' },
    { to: '/dashboard', label: 'Dashboard' },
  ]

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        🥗 Trophos
      </Link>
      <div className="navbar-links">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`navbar-link ${pathname === link.to ? 'active' : ''}`}>
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}