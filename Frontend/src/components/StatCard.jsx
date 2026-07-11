export default function StatCard({ label, value, icon: Icon, tone = 'ink' }) {
  const tones = {
    ink: 'text-ink bg-ink/[0.04]',
    cobalt: 'text-cobalt-600 bg-cobalt-50',
    amber: 'text-amber-600 bg-amber-50',
    success: 'text-success bg-success/10',
  }
  return (
    <div className="bg-white rounded-2xl border border-line p-5 flex items-start justify-between">
      <div>
        <p className="text-xs font-mono uppercase tracking-wide text-ink-faint mb-2">{label}</p>
        <p className="font-display text-3xl font-medium text-ink">{value}</p>
      </div>
      {Icon && (
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tones[tone]}`}>
          <Icon size={18} strokeWidth={2} />
        </div>
      )}
    </div>
  )
}
