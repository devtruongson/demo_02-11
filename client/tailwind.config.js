/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#243866',
          dark: '#1b2b4f',
          light: '#334b83',
          soft: '#eaf0fc'
        },
        gold: {
          DEFAULT: '#e6ad4c',
          light: '#f5d79a',
          dark: '#b88228'
        },
        heritage: {
          stone: '#5c5a53',
          bronze: '#8c6d3b',
          champa: '#7d6756'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Be Vietnam Pro', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

