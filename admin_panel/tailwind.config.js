/** @type {import('tailwindcss').Config} */
export default { 
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rabuste: {
          // Dynamic colors using CSS variables
          bg: 'rgb(var(--color-bg) / <alpha-value>)',       
          surface: 'rgb(var(--color-surface) / <alpha-value>)',  
          text: 'rgb(var(--color-text) / <alpha-value>)',     
          muted: 'rgb(var(--color-muted) / <alpha-value>)',    
          
          // Static brand colors
          gold: '#D4AF37',     
          orange: '#C25E00',   
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}