import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import PublicLayout from '../../layouts/PublicLayout'
import EventCard from '../../components/EventCard'
import Input from '../../components/Input'
import { Select } from '../../components/Input'
import { api } from '../../utils/api'

export default function UpcomingEvents() {
  const [events, setEvents] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsData, categoriesData] = await Promise.all([
          api.getEvents(),
          api.getCategories()
        ])
        setEvents(eventsData)
        setCategories(categoriesData)
      } catch (err) {
        console.error('Error fetching upcoming events data:', err)
        setError(err.message || 'Failed to load events.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filtered = useMemo(() => {
    return events.filter((e) => {
      const matchesQuery =
        query.trim() === '' ||
        [e.event_name, e.organizer, e.venue].some((v) => v?.toLowerCase().includes(query.toLowerCase()))
      const matchesCategory = category === 'all' || String(e.category_id) === category
      return matchesQuery && matchesCategory
    })
  }, [events, query, category])

  return (
    <PublicLayout>
      <section className="max-w-6xl mx-auto px-6 pt-14 pb-6">
        <p className="text-xs font-mono uppercase tracking-widest text-cobalt-500 mb-2">All events</p>
        <h1 className="font-display text-4xl font-medium text-ink mb-8">Upcoming events</h1>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, organizer, or venue"
              className="pl-9"
            />
          </div>
          <Select value={category} onChange={(e) => setCategory(e.target.value)} className="sm:w-56">
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.category_name}</option>
            ))}
          </Select>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-4 border-cobalt-200 border-t-cobalt-600 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-danger">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-line rounded-2xl">
            <p className="font-display text-xl text-ink mb-2">No events match your search</p>
            <p className="text-sm text-ink-soft">Try a different keyword or clear the category filter.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {filtered.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </section>
    </PublicLayout>
  )
}
