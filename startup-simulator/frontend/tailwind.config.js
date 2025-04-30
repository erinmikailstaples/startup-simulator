/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        'pulse': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.3 },
        },
      },
      colors: {
        // Custom colors for the app
        'startup-purple': {
          DEFAULT: '#6C2BD9',
          50: '#F1EBFD',
          100: '#E2D6FB',
          200: '#C5ADF7',
          300: '#A883F3',
          400: '#8A59EF',
          500: '#6C2BD9',
          600: '#5721AE',
          700: '#411882',
          800: '#2B1056',
          900: '#16082B',
        },
      }
    },
  },
  plugins: [],
} 