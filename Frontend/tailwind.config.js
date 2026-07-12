/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: 'var(--color-paper)',
        ink: {
          DEFAULT: 'var(--color-ink)',
          soft: 'var(--color-ink-soft)',
          faint: 'var(--color-ink-faint)',
        },
        cobalt: {
          50: 'var(--color-cobalt-50)',
          100: 'var(--color-cobalt-100)',
          400: '#8EABC3',
          500: '#0F2A4A',
          600: '#1E4A7A',
          700: '#1E4A7A',
        },
        amber: {
          50: '#FFF2EE',
          100: '#FFE0D5',
          400: '#FF885E',
          500: '#FF6A39',
          600: '#E05226',
        },
        line: 'var(--color-line)',
        success: '#16A34A',
        danger: '#E5484D',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
