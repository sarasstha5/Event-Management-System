import { useEffect, useState } from 'react'
import { CalendarRange, Users, ClipboardList, CalendarCheck, CalendarClock } from 'lucide-react'
import AdminLayout from '../../layouts/AdminLayout'
import StatCard from '../../components/StatCard'
import Badge, { statusTone } from '../../components/Badge'
import { api } from '../../utils/api'
import { formatDate } from '../../data/mockData'

export default function AdminDashboard() {
  const [events, setEvents] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [participantsCount, setParticipantsCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsData, regsData, usersData] = await Promise.all([
          api.getEvents(),
          api.getRegistrations(),
          api.getUsers()
        ])
        setEvents(eventsData)
        setRegistrations(regsData)
        // Participants are users with role = 'user'
        const parts = usersData.filter((u) => u.role === 'user')
        setParticipantsCount(parts.length)
      } catch (err) {
        console.error('Error fetching admin dashboard data:', err)
        setError(err.message || 'Failed to load dashboard data.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const upcoming = events.filter((e) => {
    if (!e.event_date) return false
    const dateStr = typeof e.event_date === 'string' ? e.event_date.substring(0, 10) : new Date(e.event_date).toISOString().substring(0, 10)
    const date = new Date(dateStr + 'T00:00:00')
    return date >= today
  }).length
  const completed = events.length - upcoming

  if (loading) {
    return (
      <AdminLayout title="Overview">
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border-4 border-cobalt-200 border-t-cobalt-600 animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Overview">
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-danger/10 text-danger text-sm">
          {error}
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
        <StatCard label="Total events" value={events.length} icon={CalendarRange} tone="cobalt" />
        <StatCard label="Participants" value={participantsCount} icon={Users} tone="ink" />
        <StatCard label="Registrations" value={registrations.length} icon={ClipboardList} tone="amber" />
        <StatCard label="Upcoming" value={upcoming} icon={CalendarClock} tone="cobalt" />
        <StatCard label="Completed" value={completed} icon={CalendarCheck} tone="success" />
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white rounded-2xl border border-line">
          <div className="px-5 py-4 border-b border-line">
            <h2 className="font-display text-lg font-medium text-ink">Recent registrations</h2>
          </div>
          {registrations.length === 0 ? (
            <div className="p-8 text-center text-sm text-ink-soft">
              No registrations found.
            </div>
          ) : (
            <div className="divide-y divide-line max-h-[400px] overflow-y-auto">
              {registrations.slice(0, 10).map((r) => (
                <div key={r.id} className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <p className="text-sm font-medium text-ink">{r.fullname}</p>
                    <p className="text-xs text-ink-faint">
                      {r.event_name} · {formatDate(r.registration_date)}
                    </p>
                  </div>
                  <Badge tone={statusTone(r.status)}>{r.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-line">
          <div className="px-5 py-4 border-b border-line">
            <h2 className="font-display text-lg font-medium text-ink">Events by capacity</h2>
          </div>
          {events.length === 0 ? (
            <div className="p-8 text-center text-sm text-ink-soft">
              No events found.
            </div>
          ) : (
            <div className="p-5 space-y-4 max-h-[400px] overflow-y-auto">
              {events.map((e) => {
                const pct = e.max_participants > 0 
                  ? Math.min(100, Math.round((e.registered_count / e.max_participants) * 100))
                  : 0
                return (
                  <div key={e.id}>
                    <div className="flex justify-between text-xs text-ink-soft mb-1.5">
                      <span className="font-medium text-ink truncate pr-2" title={e.event_name}>{e.event_name}</span>
                      <span className="shrink-0">{e.max_participants > 0 ? `${pct}%` : 'Unlimited'}</span>
                    </div>
                    {e.max_participants > 0 && (
                      <div className="h-1.5 rounded-full bg-black/[0.06] overflow-hidden">
                        <div className="h-full bg-cobalt-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
