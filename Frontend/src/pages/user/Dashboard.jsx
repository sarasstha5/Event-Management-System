import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Ticket, CalendarCheck, Clock, ArrowUpRight } from 'lucide-react'
import UserLayout from '../../layouts/UserLayout'
import StatCard from '../../components/StatCard'
import EventCard from '../../components/EventCard'
import Badge, { statusTone } from '../../components/Badge'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../utils/api'
import { formatDate } from '../../data/mockData'

export default function UserDashboard() {
  const { user } = useAuth()
  const [regs, setRegs] = useState([])
  const [recommended, setRecommended] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [regsData, eventsData] = await Promise.all([
          api.getRegistrations(),
          api.getEvents()
        ])
        setRegs(regsData)
        // Recommend up to 2 events that the user is not yet registered for
        const registeredEventIds = new Set(regsData.map((r) => r.event_id))
        const unRegistered = eventsData.filter((e) => !registeredEventIds.has(e.id))
        setRecommended(unRegistered.slice(0, 2))
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError(err.message || 'Failed to load dashboard data.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const approved = regs.filter((r) => r.status.toLowerCase() === 'approved').length
  const pending = regs.filter((r) => r.status.toLowerCase() === 'pending').length

  const greetingName = user?.fullname ? user.fullname.split(' ')[0] : 'User'

  if (loading) {
    return (
      <UserLayout title={`Welcome back, ${greetingName}`}>
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border-4 border-cobalt-200 border-t-cobalt-600 animate-spin" />
        </div>
      </UserLayout>
    )
  }

  return (
    <UserLayout title={`Welcome back, ${greetingName}`}>
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-danger/10 text-danger text-sm">
          {error}
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-5 mb-10">
        <StatCard label="Total registrations" value={regs.length} icon={Ticket} tone="cobalt" />
        <StatCard label="Confirmed" value={approved} icon={CalendarCheck} tone="success" />
        <StatCard label="Pending" value={pending} icon={Clock} tone="amber" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-medium text-ink">Your registrations</h2>
        <Link to="/dashboard/registrations" className="text-sm font-medium text-cobalt-600 hover:text-cobalt-700 inline-flex items-center gap-1">
          View all <ArrowUpRight size={14} />
        </Link>
      </div>

      {regs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-line p-8 text-center mb-12">
          <p className="text-sm text-ink-soft">You haven't registered for any events yet.</p>
          <Link to="/dashboard/browse" className="text-sm text-cobalt-600 font-medium hover:underline mt-2 inline-block">
            Browse events
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-line divide-y divide-line mb-12">
          {regs.slice(0, 5).map((r) => (
            <div key={r.id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="font-medium text-ink text-sm">{r.event_name}</p>
                <p className="text-xs text-ink-faint mt-0.5">{formatDate(r.event_date)} · {r.venue}</p>
              </div>
              <Badge tone={statusTone(r.status)}>{r.status}</Badge>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-medium text-ink">Recommended for you</h2>
        <Link to="/dashboard/browse" className="text-sm font-medium text-cobalt-600 hover:text-cobalt-700 inline-flex items-center gap-1">
          Browse all <ArrowUpRight size={14} />
        </Link>
      </div>

      {recommended.length === 0 ? (
        <div className="bg-white rounded-2xl border border-line p-8 text-center">
          <p className="text-sm text-ink-soft">No new recommendations at the moment.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {recommended.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      )}
    </UserLayout>
  )
}
