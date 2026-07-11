import { MapPin, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { categoryName, formatDate, formatTime } from '../data/mockData'
import Badge from './Badge'
import { api } from '../utils/api'

const bannerTones = {
  Seminar: 'from-cobalt-500 to-cobalt-700',
  Workshop: 'from-amber-400 to-amber-600',
  Hackathon: 'from-ink to-cobalt-700',
  Conference: 'from-cobalt-400 to-ink',
  Sports: 'from-amber-500 to-danger',
  'Cultural Program': 'from-cobalt-500 to-amber-500',
}

export default function EventCard({ event }) {
  const cat = event.category_name || categoryName(event.category_id)
  const dateStr = event.event_date 
    ? (typeof event.event_date === 'string' ? event.event_date.substring(0, 10) : new Date(event.event_date).toISOString().substring(0, 10))
    : new Date().toISOString().substring(0, 10)
  const date = new Date(dateStr + 'T00:00:00')
  const day = date.getDate()
  const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
  const seatsLeft = event.max_participants - event.registered_count
  const full = seatsLeft <= 0
  const hasBanner = !!event.banner
  const bannerUrl = hasBanner ? api.getAssetUrl(event.banner) : null

  return (
    <Link
      to={`/events/${event.id}`}
      className="group flex bg-white rounded-2xl border border-line hover:border-ink/20 hover:shadow-lg shadow-sm transition-all duration-200 overflow-hidden"
    >
      {/* Info side */}
      <div 
        className="flex-1 min-w-0 flex flex-col relative bg-cover bg-center"
        style={bannerUrl ? { backgroundImage: `url(${bannerUrl})` } : {}}
      >
        {bannerUrl && <div className="absolute inset-0 bg-black/45 z-0" />}
        {!bannerUrl && (
          <div className={`h-2.5 w-full bg-gradient-to-r ${bannerTones[cat] ?? 'from-cobalt-500 to-cobalt-700'}`} />
        )}
        <div className={`p-5 flex-1 flex flex-col gap-3 relative z-10 ${bannerUrl ? 'text-white' : ''}`}>
          <div className="flex items-center justify-between gap-2">
            <Badge tone="neutral" className={bannerUrl ? 'badge-banner' : ''}>{cat}</Badge>
            {full ? (
              <Badge tone="danger">Full</Badge>
            ) : (
              <span className={`text-xs font-mono ${bannerUrl ? 'text-white/80' : 'text-ink-faint'}`}>{seatsLeft} seats left</span>
            )}
          </div>
          <h3 className={`font-display text-xl font-medium leading-snug transition-colors ${bannerUrl ? 'text-white group-hover:text-white/90' : 'text-ink group-hover:text-cobalt-600'}`}>
            {event.event_name}
          </h3>
          <p className={`text-sm line-clamp-2 ${bannerUrl ? 'text-white/85' : 'text-ink-soft'}`}>{event.description}</p>
          <div className={`mt-auto pt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs ${bannerUrl ? 'text-white/70' : 'text-ink-soft'}`}>
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={13} strokeWidth={2} /> {event.venue}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users size={13} strokeWidth={2} /> {event.registered_count}/{event.max_participants}
            </span>
          </div>
        </div>
      </div>

      {/* Ticket stub / date stamp side */}
      <div className="relative w-24 shrink-0 flex flex-col items-center justify-center bg-paper tear-notch">
        <div className="tear-line absolute left-0 top-2 bottom-2" />
        <span className="font-mono text-xs text-ink-faint tracking-widest -rotate-90 mb-6 whitespace-nowrap">
          {event.registration_fee > 0 ? `₹${event.registration_fee}` : 'FREE'}
        </span>
        <div className="text-center">
          <div className="font-display text-3xl font-semibold text-ink leading-none">{day}</div>
          <div className="font-mono text-[11px] tracking-[0.2em] text-cobalt-500 mt-1">{month}</div>
        </div>
        <span className="mt-6 font-mono text-[10px] text-ink-faint">{formatTime(event.event_time)}</span>
      </div>
    </Link>
  )
}
