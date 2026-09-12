/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#f5f5f5',
          soft: '#fafafa',
          deep: '#0c0a09',
        },
        ink: {
          DEFAULT: '#0c0a09',
          primary: '#292524',
          body: '#4e4e4e',
          muted: '#777169',
          soft: '#a8a29e',
        },
        hairline: {
          DEFAULT: '#e7e5e4',
          soft: '#f0efed',
          strong: '#d6d3d1',
        },
        surface: {
          card: '#ffffff',
          strong: '#f0efed',
          dark: '#0c0a09',
        },
        orb: {
          mint: '#a7e5d3',
          peach: '#f4c5a8',
          lavender: '#c8b8e0',
          sky: '#a8c8e8',
          rose: '#e8b8c4',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 12s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-15px) scale(1.03)' },
        }
      }
    },
  },
  plugins: [],
}
