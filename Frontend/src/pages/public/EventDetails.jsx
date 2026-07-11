import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { MapPin, Users, CalendarDays, Clock, ArrowLeft, AlertCircle } from 'lucide-react'
import PublicLayout from '../../layouts/PublicLayout'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../utils/api'
import { formatDate, formatTime } from '../../data/mockData'

const bannerTones = {
  Seminar: 'from-cobalt-500 to-cobalt-700',
  Workshop: 'from-amber-400 to-amber-600',
  Hackathon: 'from-ink to-cobalt-700',
  Conference: 'from-cobalt-400 to-ink',
  Sports: 'from-amber-500 to-danger',
  'Cultural Program': 'from-cobalt-500 to-amber-500',
}

export default function EventDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [event, setEvent] = useState(null)
  const [userRegistration, setUserRegistration] = useState(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const eventData = await api.getSingleEvent(id)
        setEvent(eventData)

        // If user logged in, check their registrations
        if (user && user.role !== 'admin') {
          const regs = await api.getRegistrations()
          const myReg = regs.find((r) => Number(r.event_id) === Number(id))
          setUserRegistration(myReg || null)
        }
      } catch (err) {
        console.error('Error fetching event details:', err)
        setError(err.message || 'Failed to load event details.')
      } finally {
        setLoading(false)
      }
    }

    fetchEventData()
  }, [id, user])

  const handleRegister = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    setError(null)
    setMessage(null)
    setRegistering(true)

    try {
      const res = await api.registerForEvent(id)
      setMessage(res.message || 'Registered successfully!')
      
      // Refresh event details to get updated approved counts, if any, and check registration status
      const eventData = await api.getSingleEvent(id)
      setEvent(eventData)

      const regs = await api.getRegistrations()
      const myReg = regs.find((r) => Number(r.event_id) === Number(id))
      setUserRegistration(myReg || null)
    } catch (err) {
      setError(err.message || 'Registration failed.')
    } finally {
      setRegistering(false)
    }
  }

  if (loading) {
    return (
      <PublicLayout>
        <div className="max-w-3xl mx-auto px-6 py-24 flex justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-cobalt-200 border-t-cobalt-600 animate-spin" />
        </div>
      </PublicLayout>
    )
  }

  if (error && !event) {
    return (
      <PublicLayout>
        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
          <p className="font-display text-2xl text-ink mb-2">Event not found</p>
          <p className="text-sm text-ink-soft mb-4">{error}</p>
          <Link to="/events" className="text-cobalt-600 font-medium">Back to all events</Link>
        </div>
      </PublicLayout>
    )
  }

  const cat = event.category_name
  const seatsLeft = event.max_participants - event.registered_count
  const full = event.max_participants > 0 && seatsLeft <= 0
  const pct = event.max_participants > 0 
    ? Math.min(100, Math.round((event.registered_count / event.max_participants) * 100))
    : 0

  return (
    <PublicLayout>
      <div 
        className={`h-56 md:h-72 bg-gradient-to-br ${bannerTones[cat] ?? 'from-cobalt-500 to-cobalt-700'} relative bg-cover bg-center`}
        style={event.banner ? { backgroundImage: `url(${api.getAssetUrl(event.banner)})` } : {}}
      >
        {/* Overlay to ensure readability on bright banners */}
        <div className="absolute inset-0 bg-black/30" />
        <div className="max-w-6xl mx-auto px-6 h-full flex items-end pb-6 relative z-10">
          <Link to="/events" className="absolute top-6 left-6 inline-flex items-center gap-1.5 text-sm font-medium text-white/90 hover:text-white">
            <ArrowLeft size={15} /> All events
          </Link>
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-6 -mt-10 pb-24 grid md:grid-cols-3 gap-8 relative z-20">
        <div className="md:col-span-2 bg-white rounded-2xl border border-line p-8">
          <Badge tone="neutral" className="mb-4">{cat}</Badge>
          <h1 className="font-display text-3xl md:text-4xl font-medium text-ink mb-4">{event.event_name}</h1>
          <p className="text-ink-soft leading-relaxed mb-8">{event.description}</p>

          <div className="grid sm:grid-cols-2 gap-5 pt-6 border-t border-line">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-black/[0.04] flex items-center justify-center text-ink-soft">
                <CalendarDays size={16} />
              </div>
              <div>
                <p className="text-xs text-ink-faint">Date</p>
                <p className="text-sm font-medium text-ink">{formatDate(event.event_date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-black/[0.04] flex items-center justify-center text-ink-soft">
                <Clock size={16} />
              </div>
              <div>
                <p className="text-xs text-ink-faint">Time</p>
                <p className="text-sm font-medium text-ink">{formatTime(event.event_time)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-black/[0.04] flex items-center justify-center text-ink-soft">
                <MapPin size={16} />
              </div>
              <div>
                <p className="text-xs text-ink-faint">Venue</p>
                <p className="text-sm font-medium text-ink">{event.venue}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-black/[0.04] flex items-center justify-center text-ink-soft">
                <Users size={16} />
              </div>
              <div>
                <p className="text-xs text-ink-faint">Organizer</p>
                <p className="text-sm font-medium text-ink">{event.organizer}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket stub sidebar */}
        <div className="md:sticky md:top-24 h-fit bg-white rounded-2xl border border-line overflow-hidden">
          <div className={`h-2.5 bg-gradient-to-r ${bannerTones[cat] ?? 'from-cobalt-500 to-cobalt-700'}`} />
          <div className="p-6">
            <p className="font-display text-3xl font-medium text-ink mb-1">
              {Number(event.registration_fee) > 0 ? `₹${event.registration_fee}` : 'Free'}
            </p>
            <p className="text-xs text-ink-faint mb-6">per participant</p>

            <div className="mb-6">
              <div className="flex justify-between text-xs text-ink-soft mb-1.5">
                <span>{event.registered_count} registered</span>
                <span>{event.max_participants > 0 ? `${event.max_participants} seats` : 'Unlimited spots'}</span>
              </div>
              {event.max_participants > 0 && (
                <div className="h-1.5 rounded-full bg-black/[0.06] overflow-hidden">
                  <div className="h-full bg-cobalt-500 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              )}
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-danger/10 text-danger text-xs flex gap-2 items-start">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div className="mb-4 p-3 rounded-lg bg-success/10 text-success text-xs">
                {message}
              </div>
            )}

            {user?.role === 'admin' ? (
              <div className="text-center py-2 px-3 bg-black/[0.02] border border-line rounded-lg text-xs text-ink-faint font-mono uppercase">
                Viewing as Admin
              </div>
            ) : userRegistration ? (
              <div className="text-center">
                <div className="w-full py-2.5 px-4 rounded-xl border border-line bg-black/[0.02] text-sm font-medium text-ink-soft capitalize mb-2">
                  Status: {userRegistration.status}
                </div>
                <p className="text-xs text-ink-faint">
                  {userRegistration.status === 'Pending' 
                    ? 'Registration pending admin approval.' 
                    : userRegistration.status === 'Approved'
                    ? 'Your ticket is confirmed! See you there.'
                    : 'Registration was cancelled.'}
                </p>
              </div>
            ) : (
              <>
                <Button 
                  className="w-full mb-3" 
                  size="lg" 
                  disabled={full || registering}
                  onClick={handleRegister}
                >
                  {registering ? 'Processing...' : full ? 'Event full' : 'Register now'}
                </Button>
                <p className="text-xs text-ink-faint text-center">
                  {full ? 'Registration is closed.' : `${event.max_participants > 0 ? `${seatsLeft} seats left — ` : ''}cancel anytime before the event.`}
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
