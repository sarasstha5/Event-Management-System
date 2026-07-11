import { ShieldCheck, Database, Lock } from 'lucide-react'
import PublicLayout from '../../layouts/PublicLayout'

const points = [
  { icon: Database, title: 'One source of truth', copy: 'Every event, category, and registration lives in a single MySQL database instead of scattered spreadsheets.' },
  { icon: Lock, title: 'Secured by JWT', copy: 'Authenticated routes are protected end to end, and passwords are hashed with bcrypt before they ever touch storage.' },
  { icon: ShieldCheck, title: 'Built for organizers', copy: 'Admins get real-time capacity, category management, and full visibility into every registration.' },
]

export default function About() {
  return (
    <PublicLayout>
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-10">
        <p className="text-xs font-mono uppercase tracking-widest text-cobalt-500 mb-3">About EventFlow</p>
        <h1 className="font-display text-4xl md:text-5xl font-medium text-ink leading-tight mb-6">
          Built to replace the sign-up sheet.
        </h1>
        <p className="text-lg text-ink-soft leading-relaxed">
          EventFlow is a digital event management system for organizations running seminars,
          workshops, hackathons, conferences, sports meets, and cultural programs. It gives
          organizers one dashboard for everything, and gives participants one place to browse,
          register, and keep track of what they've signed up for.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-8 border-t border-line">
        {points.map((p) => (
          <div key={p.title}>
            <div className="w-10 h-10 rounded-xl bg-cobalt-50 text-cobalt-600 flex items-center justify-center mb-4">
              <p.icon size={18} strokeWidth={2} />
            </div>
            <h3 className="font-display text-lg font-medium text-ink mb-2">{p.title}</h3>
            <p className="text-sm text-ink-soft leading-relaxed">{p.copy}</p>
          </div>
        ))}
      </section>

      <section className="max-w-3xl mx-auto px-6 py-14 border-t border-line">
        <h2 className="font-display text-2xl font-medium text-ink mb-4">How it's organized</h2>
        <p className="text-ink-soft leading-relaxed mb-4">
          Admins manage events and categories, monitor every registration, and track participants
          from a single dashboard. Participants browse and search events, register in a step,
          and cancel a registration whenever plans change — with a full history saved to their profile.
        </p>
      </section>
    </PublicLayout>
  )
}
