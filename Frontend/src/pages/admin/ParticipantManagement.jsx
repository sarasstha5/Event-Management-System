import { useEffect, useState } from 'react'
import { Search, Trash2, Eye, AlertCircle, ShieldCheck } from 'lucide-react'
import AdminLayout from '../../layouts/AdminLayout'
import Table, { Td } from '../../components/Table'
import Input from '../../components/Input'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import Badge, { statusTone } from '../../components/Badge'
import { api } from '../../utils/api'
import { formatDate } from '../../data/mockData'

export default function ParticipantManagement() {
  const [users, setUsers] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const [query, setQuery] = useState('')
  const [historyFor, setHistoryFor] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  // promoteTarget stores the user object currently selected to be promoted to administrator
  const [promoteTarget, setPromoteTarget] = useState(null)

  const fetchUsersAndRegs = async () => {
    try {
      const [usersData, regsData] = await Promise.all([
        api.getUsers(),
        api.getRegistrations()
      ])
      // Filter out admins just in case, though backend getUsers already filters role = 'user'
      setUsers(usersData.filter((u) => u.role === 'user'))
      setRegistrations(regsData)
    } catch (err) {
      console.error('Error fetching participant management data:', err)
      setError(err.message || 'Failed to load participant data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsersAndRegs()
  }, [])

  const filtered = users.filter((u) => 
    [u.fullname, u.email].some((v) => v?.toLowerCase().includes(query.toLowerCase()))
  )

  const historyRegs = historyFor ? registrations.filter((r) => r.user_id === historyFor.id) : []

  const confirmDelete = async () => {
    if (!deleteTarget) return

    setError(null)
    setSubmitting(true)
    try {
      await api.deleteUser(deleteTarget.id)
      await fetchUsersAndRegs()
      setDeleteTarget(null)
    } catch (err) {
      console.error('Error deleting user:', err)
      setError(err.message || 'Failed to remove participant.')
    } finally {
      setSubmitting(false)
    }
  }

  // Handles updating the user's role to administrator in the database
  const confirmPromote = async () => {
    if (!promoteTarget) return

    setError(null)
    setSubmitting(true)
    try {
      // API call to backend PUT route to set role = 'admin'
      await api.updateUserRole(promoteTarget.id, 'admin')
      // Refresh the participant and registration records
      await fetchUsersAndRegs()
      // Close the promote modal
      setPromoteTarget(null)
    } catch (err) {
      console.error('Error promoting user:', err)
      setError(err.message || 'Failed to promote participant.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Participant management">
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border-4 border-cobalt-200 border-t-cobalt-600 animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Participant management">
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/25 text-danger flex items-start gap-3 text-sm">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="relative max-w-sm mb-6">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search participants" className="pl-9" />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-line p-12 text-center text-ink-soft">
          No participants found.
        </div>
      ) : (
        <Table columns={['Name', 'Email', 'Phone', 'Registrations', '']}>
          {filtered.map((u) => (
            <tr key={u.id}>
              <Td className="font-medium">{u.fullname}</Td>
              <Td className="text-ink-soft">{u.email}</Td>
              <Td className="text-ink-soft font-mono text-xs">{u.phone}</Td>
              <Td className="text-ink-soft">
                {registrations.filter((r) => r.user_id === u.id).length}
              </Td>
              <Td>
                <div className="flex items-center gap-1 justify-end">
                  <button onClick={() => setHistoryFor(u)} className="p-2 rounded-lg text-ink-soft hover:text-ink hover:bg-black/[0.04] focus-ring" title="View registration history">
                    <Eye size={15} />
                  </button>
                  <button onClick={() => setPromoteTarget(u)} className="p-2 rounded-lg text-ink-soft hover:text-amber-600 hover:bg-amber-50 focus-ring" title="Make Admin">
                    <ShieldCheck size={15} />
                  </button>
                  <button onClick={() => setDeleteTarget(u)} className="p-2 rounded-lg text-ink-soft hover:text-danger hover:bg-danger/5 focus-ring" title="Remove participant">
                    <Trash2 size={15} />
                  </button>
                </div>
              </Td>
            </tr>
          ))}
        </Table>
      )}

      <Modal open={!!historyFor} onClose={() => setHistoryFor(null)} title={`${historyFor?.fullname}'s registrations`}>
        {historyRegs.length === 0 ? (
          <p className="text-sm text-ink-soft py-4 text-center">No registrations yet.</p>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {historyRegs.map((r) => {
              return (
                <div key={r.id} className="flex items-center justify-between border border-line rounded-xl px-4 py-3 bg-white">
                  <div>
                    <p className="text-sm font-medium text-ink">{r.event_name}</p>
                    <p className="text-xs text-ink-faint mt-0.5">{formatDate(r.registration_date)}</p>
                  </div>
                  <Badge tone={statusTone(r.status)}>{r.status}</Badge>
                </div>
              )
            })}
          </div>
        )}
      </Modal>

      <Modal open={!!promoteTarget} onClose={() => setPromoteTarget(null)} title="Promote to administrator">
        <p className="text-sm text-ink-soft mb-6">
          Are you sure you want to promote <span className="font-medium text-ink">{promoteTarget?.fullname}</span> to an administrator?
          <br /><br />
          <strong className="text-ink">Warning:</strong> They will gain access to the administration dashboard and full management permissions. This action can only be undone by another administrator.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setPromoteTarget(null)} disabled={submitting}>Cancel</Button>
          <Button variant="primary" onClick={confirmPromote} disabled={submitting}>{submitting ? 'Promoting...' : 'Make Admin'}</Button>
        </div>
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Remove participant">
        <p className="text-sm text-ink-soft mb-6">
          Remove <span className="font-medium text-ink">{deleteTarget?.fullname}</span> from the system? Their registration history will be lost.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)} disabled={submitting}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete} disabled={submitting}>{submitting ? 'Removing...' : 'Remove'}</Button>
        </div>
      </Modal>
    </AdminLayout>
  )
}
