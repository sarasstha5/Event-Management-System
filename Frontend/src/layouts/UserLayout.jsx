import { LayoutGrid, Compass, Ticket, UserRound } from 'lucide-react'
import DashboardShell from '../components/DashboardShell'
import { useAuth } from '../context/AuthContext'

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/dashboard/browse', label: 'Browse events', icon: Compass },
  { to: '/dashboard/registrations', label: 'My registrations', icon: Ticket },
  { to: '/dashboard/profile', label: 'Profile', icon: UserRound },
]

export default function UserLayout({ title, children }) {
  const { user } = useAuth()

  return (
    <DashboardShell title={title} nav={nav} user={user}>
      {children}
    </DashboardShell>
  )
}
