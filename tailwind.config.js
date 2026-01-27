/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'jo-purple': '#A62DC9', // اللون البنفسجي الخاص ببراند JO Store
      },
      animation: {
        'fade-in': 'fadeIn 1.2s ease-out forwards',
        'glow-pulse': 'glowPulse 3s infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%': { boxShadow: '0 0 5px rgba(166, 45, 201, 0.2)' },
          '100%': { boxShadow: '0 0 25px rgba(166, 45, 201, 0.5)' },
        }
      },
    },
  },
  plugins: [],
}
