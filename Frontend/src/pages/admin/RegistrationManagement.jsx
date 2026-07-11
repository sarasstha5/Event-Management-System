import { useEffect, useState } from 'react'
import { Search, Check, X, AlertCircle } from 'lucide-react'
import AdminLayout from '../../layouts/AdminLayout'
import Table, { Td } from '../../components/Table'
import Input, { Select } from '../../components/Input'
import Badge, { statusTone } from '../../components/Badge'
import { api } from '../../utils/api'
import { formatDate } from '../../data/mockData'

export default function RegistrationManagement() {
  const [regs, setRegs] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

  const [query, setQuery] = useState('')
  const [eventFilter, setEventFilter] = useState('all')

  const fetchRegsAndEvents = async () => {
    try {
      const [regsData, eventsData] = await Promise.all([
        api.getRegistrations(),
        api.getEvents()
      ])
      setRegs(regsData)
      setEvents(eventsData)
    } catch (err) {
      console.error('Error fetching registrations:', err)
      setError(err.message || 'Failed to load registrations.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRegsAndEvents()
  }, [])

  const filtered = regs.filter((r) => {
    const matchesQuery = query.trim() === '' || r.fullname?.toLowerCase().includes(query.toLowerCase())
    const matchesEvent = eventFilter === 'all' || String(r.event_id) === eventFilter
    return matchesQuery && matchesEvent
  })

  const setStatus = async (id, status) => {
    setError(null)
    setUpdatingId(id)
    try {
      await api.updateRegistrationStatus(id, status)
      await fetchRegsAndEvents()
    } catch (err) {
      console.error('Error updating status:', err)
      setError(err.message || 'Failed to update registration status.')
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Registration management">
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border-4 border-cobalt-200 border-t-cobalt-600 animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Registration management">
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/25 text-danger flex items-start gap-3 text-sm">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by participant" className="pl-9" />
        </div>
        <Select value={eventFilter} onChange={(e) => setEventFilter(e.target.value)} className="sm:w-64">
          <option value="all">All events</option>
          {events.map((ev) => <option key={ev.id} value={ev.id}>{ev.event_name}</option>)}
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-line p-12 text-center text-ink-soft">
          No registrations found.
        </div>
      ) : (
        <Table columns={['Participant', 'Event', 'Registered on', 'Status', '']}>
          {filtered.map((r) => {
            const isPending = r.status.toLowerCase() === 'pending'
            return (
              <tr key={r.id}>
                <Td className="font-medium">{r.fullname}</Td>
                <Td className="text-ink-soft">{r.event_name}</Td>
                <Td className="text-ink-soft font-mono text-xs">{formatDate(r.registration_date)}</Td>
                <Td><Badge tone={statusTone(r.status)}>{r.status}</Badge></Td>
                <Td>
                  <div className="flex items-center gap-1 justify-end">
                    {r.status.toLowerCase() !== 'approved' && (
                      <button 
                        onClick={() => setStatus(r.id, 'Approved')} 
                        disabled={updatingId === r.id}
                        className="p-2 rounded-lg text-ink-soft hover:text-success hover:bg-success/10 focus-ring"
                        title="Approve registration"
                      >
                        <Check size={15} />
                      </button>
                    )}
                    {r.status.toLowerCase() !== 'cancelled' && (
                      <button 
                        onClick={() => setStatus(r.id, 'Cancelled')} 
                        disabled={updatingId === r.id}
                        className="p-2 rounded-lg text-ink-soft hover:text-danger hover:bg-danger/5 focus-ring"
                        title="Cancel registration"
                      >
                        <X size={15} />
                      </button>
                    )}
                  </div>
                </Td>
              </tr>
            )
          })}
        </Table>
      )}
    </AdminLayout>
  )
}
