/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'carousel-move': 'carousel-move var(--duration, 30s) linear infinite',
        'slide-down': 'slide-down 0.3s ease-out',
      },
      keyframes: {
        'carousel-move': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-50% - var(--carousel-offset, 0px)))' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}; 