/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary-color)',
          hover: 'var(--primary-hover)',
          rgb: 'var(--primary-rgb)',
        },
        secondary: {
          DEFAULT: 'var(--secondary-color)',
          rgb: 'var(--secondary-rgb)',
        },
        darkBg: {
          DEFAULT: 'var(--bg-color)',
          card: 'var(--card-bg)',
          cardHover: 'var(--card-hover)',
        },
        neonGlow: 'var(--glow-color)',
      },
      borderRadius: {
        theme: 'var(--card-radius)',
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-hover': '0 8px 32px 0 rgba(var(--primary-rgb), 0.15)',
        glow: '0 0 15px var(--primary-color)',
      },
      backdropBlur: {
        glass: '12px',
      },
    },
  },
  plugins: [],
}
