import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`p-2 rounded-lg text-ink-soft hover:bg-black/[0.03] hover:text-ink dark:text-ink-faint dark:hover:bg-white/[0.05] dark:hover:text-paper transition-colors focus-ring ${className}`}
      aria-label="Toggle theme mode"
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  )
}
