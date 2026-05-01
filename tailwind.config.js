/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f3ff',
          100: '#e0e8ff',
          200: '#c7d4fd',
          300: '#a3b5fc',
          400: '#7a8ef8',
          500: '#4F6EF7',
          600: '#3b56e8',
          700: '#2f44cc',
          800: '#2a3aa5',
          900: '#283682',
        },
        surface: {
          50: '#f8f9fc',
          100: '#f0f2f8',
          700: '#2a2d3e',
          800: '#1e2132',
          900: '#151826',
          950: '#0d0f1a',
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Syne', 'system-ui', 'sans-serif'],
      },
      borderColor: {
        border: 'rgb(229 231 235)',
      }
    }
  },
  plugins: []
}
