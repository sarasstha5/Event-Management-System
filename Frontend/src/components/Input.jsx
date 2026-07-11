export function Field({ label, hint, children, id }) {
  return (
    <label htmlFor={id} className="block">
      {label && <span className="block text-sm font-medium text-ink mb-1.5">{label}</span>}
      {children}
      {hint && <span className="block text-xs text-ink-faint mt-1.5">{hint}</span>}
    </label>
  )
}

export default function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus-ring focus-visible:border-cobalt-500 transition-colors ${className}`}
      {...props}
    />
  )
}

export function Select({ className = '', children, ...props }) {
  return (
    <select
      className={`w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink focus-ring focus-visible:border-cobalt-500 transition-colors ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}

export function Textarea({ className = '', ...props }) {
  return (
    <textarea
      className={`w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus-ring focus-visible:border-cobalt-500 transition-colors resize-none ${className}`}
      {...props}
    />
  )
}
