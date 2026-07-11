export default function Button({
  as: Tag = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-body font-medium rounded-lg transition-colors duration-150 focus-ring disabled:opacity-50 disabled:pointer-events-none'

  const variants = {
    primary: 'bg-ink text-paper hover:bg-cobalt-600',
    secondary: 'bg-white text-ink border border-line hover:border-ink',
    ghost: 'text-ink-soft hover:text-ink hover:bg-black/[0.03]',
    danger: 'bg-white text-danger border border-danger/30 hover:bg-danger/5',
    accent: 'bg-amber-500 text-ink hover:bg-amber-600',
  }

  const sizes = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2.5',
    lg: 'text-base px-6 py-3',
  }

  return (
    <Tag className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </Tag>
  )
}
