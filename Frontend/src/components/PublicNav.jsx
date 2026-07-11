import { NavLink, Link } from 'react-router-dom'
import { Ticket } from 'lucide-react'
import Button from './Button'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/', label: 'Home' },
  { to: '/events', label: 'Events' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function PublicNav() {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-40 bg-paper/90 backdrop-blur border-b border-line">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
          <span className="w-7 h-7 rounded-md bg-ink text-paper flex items-center justify-center">
            <Ticket size={15} />
          </span>
          EventFlow
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'text-ink bg-black/[0.04]' : 'text-ink-soft hover:text-ink'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <Button 
              as={Link} 
              to={user.role === 'admin' ? '/admin' : '/dashboard'} 
              variant="primary" 
              size="sm"
            >
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button as={Link} to="/login" variant="ghost" size="sm">Log in</Button>
              <Button as={Link} to="/register" variant="primary" size="sm">Register</Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
