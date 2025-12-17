/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Defining the custom colors used in your components
        rabuste: {
          bg: '#050505',       // Very dark background for "Bold" look
          surface: '#121212',  // Slightly lighter for cards/sections
          text: '#e5e5e5',     // Main text color
          muted: '#a3a3a3',    // Secondary text
          gold: '#D4AF37',     // Accent for luxury/art feel
          orange: '#C25E00',   // "Robusta" rust/energy color
        }
      },
      fontFamily: {
        // Matching the "font-serif" and "font-sans" usage
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}