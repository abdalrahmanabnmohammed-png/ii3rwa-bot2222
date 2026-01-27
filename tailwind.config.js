/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'jo-purple': '#A62DC9', // لون متجرك JO Store
      },
      animation: {
        'fade-in': 'fadeIn 1.5s ease-out forwards',
        'glow': 'glowPulse 3s infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        glowPulse: {
          '0%': { boxShadow: '0 0 5px rgba(166, 45, 201, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(166, 45, 201, 0.6)' },
        }
      },
    },
  },
  plugins: [],
}
