import { LayoutGrid, CalendarRange, Tags, Users, ClipboardList } from 'lucide-react'
import DashboardShell from '../components/DashboardShell'
import { useAuth } from '../context/AuthContext'

const nav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/admin/events', label: 'Events', icon: CalendarRange },
  { to: '/admin/categories', label: 'Categories', icon: Tags },
  { to: '/admin/participants', label: 'Participants', icon: Users },
  { to: '/admin/registrations', label: 'Registrations', icon: ClipboardList },
]

export default function AdminLayout({ title, children }) {
  const { user } = useAuth()

  return (
    <DashboardShell title={title} nav={nav} user={user}>
      {children}
    </DashboardShell>
  )
}
