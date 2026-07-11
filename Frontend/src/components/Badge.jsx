const tones = {
  neutral: 'bg-black/[0.04] text-ink-soft',
  cobalt: 'bg-cobalt-50 text-cobalt-600',
  amber: 'bg-amber-50 text-amber-600',
  success: 'bg-success/10 text-success',
  danger: 'bg-danger/10 text-danger',
}

export default function Badge({ tone = 'neutral', children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium font-mono uppercase tracking-wide ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}

export const statusTone = (status) =>
  ({ approved: 'success', pending: 'amber', cancelled: 'danger' }[status] ?? 'neutral')
