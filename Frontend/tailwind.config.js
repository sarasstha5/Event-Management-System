/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FFFFFF',
        ink: {
          DEFAULT: '#0F2A4A',
          soft: '#6B7C8E',
          faint: '#8EABC3',
        },
        cobalt: {
          50: '#F0F4F8',
          100: '#D2DFEA',
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
        line: '#E3E8EE',
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
