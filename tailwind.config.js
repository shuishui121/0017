/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        'opera-red': '#8B0000',
        'opera-gold': '#D4AF37',
        'opera-cream': '#FFF8E7',
        'opera-dark': '#2D2D2D',
        'opera-brown': '#6B4423',
      },
      fontFamily: {
        'opera-display': ['"Noto Serif SC"', '"Ma Shan Zheng"', 'serif'],
        'opera-body': ['"Noto Sans SC"', 'sans-serif'],
      },
      boxShadow: {
        'opera': '0 4px 20px rgba(139, 0, 0, 0.15)',
        'opera-hover': '0 8px 30px rgba(139, 0, 0, 0.25)',
      },
      backgroundImage: {
        'opera-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238B0000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
