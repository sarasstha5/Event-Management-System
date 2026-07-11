import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, CalendarDays, Users, Ticket as TicketIcon, Search } from 'lucide-react'
import PublicLayout from '../../layouts/PublicLayout'
import Button from '../../components/Button'
import EventCard from '../../components/EventCard'
import { api } from '../../utils/api'

export default function Home() {
  const [events, setEvents] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
        console.error('Error fetching home data:', err)
        setError(err.message || 'Failed to load events.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const featured = events.slice(0, 3)

  return (
    <PublicLayout>
      {/* Hero: a large ticket stub is the thesis of the page */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-cobalt-500 mb-5">
            <TicketIcon size={13} /> Campus events, one system
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-medium leading-[1.05] text-ink mb-6">
            Every event,<br /> one clean ticket.
          </h1>
          <p className="text-lg text-ink-soft leading-relaxed mb-8 max-w-md">
            Browse seminars, hackathons, and fests across your organization — register in a
            few taps, and keep every confirmation in one place.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button as={Link} to="/events" size="lg">
              Browse events <ArrowUpRight size={16} />
            </Button>
            <Button as={Link} to="/register" variant="secondary" size="lg">
              Create an account
            </Button>
          </div>
          <div className="flex gap-8 mt-10 pt-8 border-t border-line">
            <div>
              <p className="font-display text-2xl font-medium text-ink">{loading ? '...' : events.length}</p>
              <p className="text-xs text-ink-faint font-mono uppercase tracking-wide">Live events</p>
            </div>
            <div>
              <p className="font-display text-2xl font-medium text-ink">{loading ? '...' : categories.length}</p>
              <p className="text-xs text-ink-faint font-mono uppercase tracking-wide">Categories</p>
            </div>
            <div>
              <p className="font-display text-2xl font-medium text-ink">{loading ? '...' : '12'}+</p>
              <p className="text-xs text-ink-faint font-mono uppercase tracking-wide">Registrations</p>
            </div>
          </div>
        </div>

        {/* Hero ticket illustration */}
        <div className="relative mx-auto">
          <div className="w-full max-w-sm bg-white rounded-2xl border border-line shadow-xl overflow-hidden rotate-2">
            <div className="h-3 bg-gradient-to-r from-cobalt-500 to-amber-500" />
            <div className="p-6">
              <p className="font-mono text-[11px] tracking-widest text-ink-faint uppercase mb-2">Admit one</p>
              <h3 className="font-display text-2xl font-medium text-ink mb-1">National Hackathon 2026</h3>
              <p className="text-sm text-ink-soft mb-5">Main Auditorium · 09:00 AM</p>
              <div className="flex items-center justify-between border-t border-dashed border-line pt-4">
                <div>
                  <p className="font-display text-3xl font-semibold text-ink leading-none">03</p>
                  <p className="font-mono text-[11px] text-cobalt-500 mt-1">AUG 2026</p>
                </div>
                <span className="font-mono text-xs text-ink-faint">SEAT G-178</span>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 -left-6 w-full max-w-sm bg-white rounded-2xl border border-line shadow-md -z-10 -rotate-3" />
        </div>
      </section>

      {/* Featured events */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-line">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-ink-faint mb-2">Happening soon</p>
            <h2 className="font-display text-3xl font-medium text-ink">Featured events</h2>
          </div>
          <Link to="/events" className="text-sm font-medium text-cobalt-600 hover:text-cobalt-700 inline-flex items-center gap-1">
            View all <ArrowUpRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-4 border-cobalt-200 border-t-cobalt-600 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-danger">{error}</div>
        ) : featured.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-line rounded-2xl">
            <p className="font-display text-xl text-ink">No upcoming events yet</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {featured.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-line grid md:grid-cols-3 gap-10">
        {[
          { icon: Search, title: 'Find your event', copy: 'Search by name, category, venue, or date across every event on campus.' },
          { icon: TicketIcon, title: 'Reserve your seat', copy: 'Register in one step. Free or paid events, capacity tracked in real time.' },
          { icon: CalendarDays, title: 'Track it all', copy: 'Every registration lands in your dashboard — cancel anytime before check-in.' },
        ].map((s) => (
          <div key={s.title}>
            <div className="w-10 h-10 rounded-xl bg-ink/[0.04] flex items-center justify-center mb-4 text-ink">
              <s.icon size={18} strokeWidth={2} />
            </div>
            <h3 className="font-display text-lg font-medium text-ink mb-2">{s.title}</h3>
            <p className="text-sm text-ink-soft leading-relaxed">{s.copy}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="bg-ink rounded-3xl px-10 py-14 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-medium text-paper mb-4">
            Organizing an event? Bring it into EventFlow.
          </h2>
          <p className="text-paper/60 mb-8 max-w-lg mx-auto">
            Admins get a dashboard for categories, banners, capacity, and every registration —
            no spreadsheets required.
          </p>
          <Button as={Link} to="/register" variant="accent" size="lg">
            Get started <Users size={16} />
          </Button>
        </div>
      </section>
    </PublicLayout>
  )
}
