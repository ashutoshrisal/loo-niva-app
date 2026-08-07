/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  darkMode: 'class',

  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#1E3A8A',
          'blue-light': '#2C4FB5',
          green: '#16A34A',
          'green-light': '#22C55E',
        },
      },

      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },

      boxShadow: {
        soft: '0 4px 20px rgba(30, 58, 138, 0.08)',
      },
    },
  },

  plugins: [],
};