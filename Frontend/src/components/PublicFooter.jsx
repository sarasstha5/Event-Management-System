import { Link } from 'react-router-dom'
import { Ticket } from 'lucide-react'

export default function PublicFooter() {
  return (
    <footer className="border-t border-line mt-24">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-2 font-display text-base font-semibold text-ink">
          <span className="w-6 h-6 rounded-md bg-ink text-paper flex items-center justify-center">
            <Ticket size={13} />
          </span>
          EventFlow
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft">
          <Link to="/events" className="hover:text-ink">Upcoming Events</Link>
          <Link to="/about" className="hover:text-ink">About</Link>
          <Link to="/contact" className="hover:text-ink">Contact</Link>
          <Link to="/login" className="hover:text-ink">Log in</Link>
        </nav>
        <p className="text-xs font-mono text-ink-faint">© 2026 EventFlow. Built for campus events.</p>
      </div>
    </footer>
  )
}
