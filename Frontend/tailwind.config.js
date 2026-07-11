/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FAFBFC',
        ink: {
          DEFAULT: '#12141A',
          soft: '#5B6472',
          faint: '#9AA2AE',
        },
        cobalt: {
          50: '#EEF2FF',
          100: '#DCE4FF',
          400: '#5B7CF0',
          500: '#2451E0',
          600: '#1B3EB8',
          700: '#152F8C',
        },
        amber: {
          50: '#FFF8EB',
          100: '#FEEDC7',
          400: '#F8B84D',
          500: '#F5A524',
          600: '#D6870F',
        },
        line: '#E4E7EC',
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
