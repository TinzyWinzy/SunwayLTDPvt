/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1f1a54',
          50: '#e8e7f0',
          100: '#c5c3db',
          200: '#9f9bc3',
          300: '#7a74ab',
          400: '#5e5799',
          500: '#1f1a54',
          600: '#1a1648',
          700: '#15123c',
          800: '#100e30',
          900: '#0b0a20',
        },
        accent: {
          DEFAULT: '#ec1d27',
          50: '#fde3e4',
          100: '#f9b9bc',
          200: '#f58b90',
          300: '#f15d64',
          400: '#ee3b43',
          500: '#ec1d27',
          600: '#d41923',
          700: '#b3151e',
          800: '#931119',
          900: '#6e0d12',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
