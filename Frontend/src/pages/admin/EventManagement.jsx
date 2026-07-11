import { useEffect, useRef, useState } from 'react'
import { Plus, Search, Pencil, Trash2, ImagePlus, AlertCircle } from 'lucide-react'
import AdminLayout from '../../layouts/AdminLayout'
import Table, { Td } from '../../components/Table'
import Button from '../../components/Button'
import Input, { Field, Select, Textarea } from '../../components/Input'
import Modal from '../../components/Modal'
import Badge from '../../components/Badge'
import { api } from '../../utils/api'
import { formatDate } from '../../data/mockData'

export default function EventManagement() {
  const fileInputRef = useRef(null)

  const [events, setEvents] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const [query, setQuery] = useState('')
  const [modal, setModal] = useState(null) // 'add' | 'edit' | 'delete' | null
  const [active, setActive] = useState(null)

  // Form states
  const [eventName, setEventName] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [organizer, setOrganizer] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [eventTime, setEventTime] = useState('')
  const [venue, setVenue] = useState('')
  const [registrationFee, setRegistrationFee] = useState(0)
  const [maxParticipants, setMaxParticipants] = useState(0)
  const [description, setDescription] = useState('')
  const [bannerFile, setBannerFile] = useState(null)
  const [bannerFileName, setBannerFileName] = useState('')

  const fetchEventsAndCategories = async () => {
    try {
      const [eventsData, catsData] = await Promise.all([
        api.getEvents(),
        api.getCategories()
      ])
      setEvents(eventsData)
      setCategories(catsData)
    } catch (err) {
      console.error('Error fetching event management data:', err)
      setError(err.message || 'Failed to load event data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEventsAndCategories()
  }, [])

  const filtered = events.filter((e) =>
    [e.event_name, e.organizer, e.venue].some((v) => v?.toLowerCase().includes(query.toLowerCase()))
  )

  const resetForm = (eObj = null) => {
    setEventName(eObj?.event_name || '')
    setCategoryId(eObj?.category_id || (categories[0]?.id || ''))
    setOrganizer(eObj?.organizer || '')
    
    // Extract YYYY-MM-DD from event_date
    let dateStr = ''
    if (eObj?.event_date) {
      dateStr = new Date(eObj.event_date).toISOString().split('T')[0]
    }
    setEventDate(dateStr)

    // Extract HH:MM from event_time (backend might return HH:MM:SS)
    let timeStr = ''
    if (eObj?.event_time) {
      timeStr = eObj.event_time.slice(0, 5)
    }
    setEventTime(timeStr)

    setVenue(eObj?.venue || '')
    setRegistrationFee(eObj?.registration_fee || 0)
    setMaxParticipants(eObj?.max_participants || 0)
    setDescription(eObj?.description || '')
    setBannerFile(null)
    setBannerFileName('')
  }

  const openAdd = () => {
    resetForm(null)
    setActive(null)
    setModal('add')
  }

  const openEdit = (eventObj) => {
    resetForm(eventObj)
    setActive(eventObj)
    setModal('edit')
  }

  const openDelete = (eventObj) => {
    setActive(eventObj)
    setModal('delete')
  }

  const handleBannerClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setBannerFile(file)
      setBannerFileName(file.name)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const formData = new FormData()
    formData.append('event_name', eventName)
    formData.append('category_id', categoryId)
    formData.append('organizer', organizer)
    formData.append('event_date', eventDate)
    formData.append('event_time', eventTime)
    formData.append('venue', venue)
    formData.append('registration_fee', registrationFee)
    formData.append('max_participants', maxParticipants)
    formData.append('description', description)

    if (bannerFile) {
      formData.append('banner', bannerFile)
    }

    try {
      if (modal === 'add') {
        await api.createEvent(formData)
      } else if (modal === 'edit') {
        await api.editEvent(active.id, formData)
      }
      await fetchEventsAndCategories()
      setModal(null)
    } catch (err) {
      console.error('Error saving event:', err)
      setError(err.message || 'Failed to save event.')
    } finally {
      setSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    if (!active) return

    setError(null)
    setSubmitting(true)
    try {
      await api.deleteEvent(active.id)
      await fetchEventsAndCategories()
      setModal(null)
    } catch (err) {
      console.error('Error deleting event:', err)
      setError(err.message || 'Failed to delete event.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Event management">
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border-4 border-cobalt-200 border-t-cobalt-600 animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Event management">
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/25 text-danger flex items-start gap-3 text-sm">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search events" className="pl-9" />
        </div>
        <Button className="sm:ml-auto" onClick={openAdd}>
          <Plus size={16} /> Add event
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-line p-12 text-center text-ink-soft">
          No events found matching search criteria.
        </div>
      ) : (
        <Table columns={['Event', 'Category', 'Date', 'Venue', 'Seats', 'Fee', '']}>
          {filtered.map((e) => (
            <tr key={e.id}>
              <Td className="font-medium">{e.event_name}</Td>
              <Td><Badge tone="neutral">{e.category_name}</Badge></Td>
              <Td className="text-ink-soft font-mono text-xs">{formatDate(e.event_date)}</Td>
              <Td className="text-ink-soft">{e.venue}</Td>
              <Td className="text-ink-soft">{e.registered_count}/{e.max_participants > 0 ? e.max_participants : '∞'}</Td>
              <Td className="text-ink-soft">{Number(e.registration_fee) > 0 ? `₹${e.registration_fee}` : 'Free'}</Td>
              <Td>
                <div className="flex items-center gap-1 justify-end">
                  <button onClick={() => openEdit(e)} className="p-2 rounded-lg text-ink-soft hover:text-ink hover:bg-black/[0.04] focus-ring">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => openDelete(e)} className="p-2 rounded-lg text-ink-soft hover:text-danger hover:bg-danger/5 focus-ring">
                    <Trash2 size={15} />
                  </button>
                </div>
              </Td>
            </tr>
          ))}
        </Table>
      )}

      <Modal open={modal === 'add' || modal === 'edit'} onClose={() => setModal(null)} title={modal === 'edit' ? 'Edit event' : 'Add event'} size="lg">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <Field label="Event name">
            <Input value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="e.g. Frontend Systems Workshop" required />
          </Field>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Category">
              <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.category_name}</option>)}
              </Select>
            </Field>
            <Field label="Organizer">
              <Input value={organizer} onChange={(e) => setOrganizer(e.target.value)} placeholder="Department or committee" required />
            </Field>
            <Field label="Event date">
              <Input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
            </Field>
            <Field label="Event time">
              <Input type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} required />
            </Field>
            <Field label="Venue">
              <Input value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="e.g. Main Auditorium" required />
            </Field>
            <Field label="Registration fee (₹)">
              <Input type="number" min="0" value={registrationFee} onChange={(e) => setRegistrationFee(Number(e.target.value))} required />
            </Field>
            <Field label="Maximum participants" hint="Set to 0 for unlimited spots.">
              <Input type="number" min="0" value={maxParticipants} onChange={(e) => setMaxParticipants(Number(e.target.value))} required />
            </Field>
            <Field label="Banner image">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              <button 
                type="button" 
                onClick={handleBannerClick}
                className="w-full flex items-center gap-2 justify-center rounded-lg border border-dashed border-line px-3.5 py-2.5 text-sm text-ink-soft hover:border-ink/30 focus-ring"
              >
                <ImagePlus size={15} /> 
                {bannerFileName ? bannerFileName : 'Upload banner'}
              </button>
            </Field>
          </div>
          <Field label="Description">
            <Textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What should participants know?" required />
          </Field>
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="secondary" onClick={() => setModal(null)} disabled={submitting}>Cancel</Button>
            <Button type="submit" disabled={submitting}>{submitting ? 'Processing...' : modal === 'edit' ? 'Save changes' : 'Create event'}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={modal === 'delete'} onClose={() => setModal(null)} title="Delete event">
        <p className="text-sm text-ink-soft mb-6">
          Are you sure you want to delete <span className="font-medium text-ink">{active?.event_name}</span>? This can't be undone, and existing registrations will be cancelled.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setModal(null)} disabled={submitting}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete} disabled={submitting}>{submitting ? 'Deleting...' : 'Delete event'}</Button>
        </div>
      </Modal>
    </AdminLayout>
  )
}
