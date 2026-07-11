import { useEffect, useState } from 'react'
import { X, AlertCircle } from 'lucide-react'
import UserLayout from '../../layouts/UserLayout'
import Table, { Td } from '../../components/Table'
import Badge, { statusTone } from '../../components/Badge'
import Button from '../../components/Button'
import { api } from '../../utils/api'
import { formatDate } from '../../data/mockData'

export default function MyRegistrations() {
  const [regs, setRegs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cancellingId, setCancellingId] = useState(null)

  const fetchRegs = async () => {
    try {
      const data = await api.getRegistrations()
      setRegs(data)
    } catch (err) {
      console.error('Error fetching registrations:', err)
      setError(err.message || 'Failed to load registrations.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRegs()
  }, [])

  const cancel = async (id) => {
    setError(null)
    setCancellingId(id)
    try {
      await api.updateRegistrationStatus(id, 'Cancelled')
      // Refresh list
      await fetchRegs()
    } catch (err) {
      console.error('Error cancelling registration:', err)
      setError(err.message || 'Failed to cancel registration.')
    } finally {
      setCancellingId(null)
    }
  }

  if (loading) {
    return (
      <UserLayout title="My registrations">
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border-4 border-cobalt-200 border-t-cobalt-600 animate-spin" />
        </div>
      </UserLayout>
    )
  }

  return (
    <UserLayout title="My registrations">
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-danger/10 text-danger text-sm flex gap-2 items-start">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {regs.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-line rounded-2xl">
          <p className="font-display text-xl text-ink mb-2">No registrations yet</p>
          <p className="text-sm text-ink-soft">Once you register for an event, it'll show up here.</p>
        </div>
      ) : (
        <Table columns={['Event', 'Date', 'Registered on', 'Status', '']}>
          {regs.map((r) => {
            return (
              <tr key={r.id}>
                <Td className="font-medium">{r.event_name}</Td>
                <Td className="text-ink-soft">{formatDate(r.event_date)}</Td>
                <Td className="text-ink-soft font-mono text-xs">{formatDate(r.registration_date)}</Td>
                <Td><Badge tone={statusTone(r.status)}>{r.status}</Badge></Td>
                <Td className="text-right">
                  {r.status.toLowerCase() !== 'cancelled' && (
                    <Button 
                      variant="danger" 
                      size="sm" 
                      onClick={() => cancel(r.id)}
                      disabled={cancellingId === r.id}
                    >
                      <X size={14} /> {cancellingId === r.id ? 'Cancelling...' : 'Cancel'}
                    </Button>
                  )}
                </Td>
              </tr>
            )
          })}
        </Table>
      )}
    </UserLayout>
  )
}
