import { NavLink, Link } from 'react-router-dom'
import { Ticket, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { api } from '../utils/api'

export default function DashboardShell({ title, nav, user, children }) {
  const { logout } = useAuth()

  // Avoid crash if user is still loading/null
  const fullname = user?.fullname || 'User'
  const role = user?.role || 'user'
  
  const initials = fullname
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const profileImageUrl = user?.profile_image ? api.getAssetUrl(user.profile_image) : null

  return (
    <div className="min-h-screen bg-paper flex">
      <aside className="w-64 shrink-0 border-r border-line bg-white flex flex-col">
        <Link to="/" className="h-16 flex items-center gap-2 px-6 border-b border-line font-display text-lg font-semibold text-ink">
          <span className="w-7 h-7 rounded-md bg-ink text-paper flex items-center justify-center">
            <Ticket size={15} />
          </span>
          EventFlow
        </Link>
        <nav className="flex-1 px-3 py-5 space-y-1">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-cobalt-50 text-cobalt-600' : 'text-ink-soft hover:bg-black/[0.03] hover:text-ink'
                }`
              }
            >
              <item.icon size={17} strokeWidth={2} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-line">
          <div className="flex items-center gap-3 px-2 py-2">
            {profileImageUrl ? (
              <img 
                src={profileImageUrl} 
                alt={fullname} 
                className="w-9 h-9 rounded-full object-cover border border-line" 
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-ink text-paper flex items-center justify-center font-display text-sm font-medium">
                {initials}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink truncate">{fullname}</p>
              <p className="text-xs text-ink-faint truncate capitalize">{role}</p>
            </div>
            <button 
              onClick={logout} 
              className="text-ink-faint hover:text-danger focus-ring rounded p-1 hover:bg-black/[0.03]"
              title="Log out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 border-b border-line bg-white/70 backdrop-blur flex items-center px-8 shrink-0">
          <h1 className="font-display text-xl font-medium text-ink">{title}</h1>
        </header>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}
