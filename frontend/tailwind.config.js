/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Include all files in the src directory
  ],
  theme: {
    extend: {
      fontFamily: {
        'logo': ['AldransAltW00-Medium', 'sans-serif'], // Add your custom font
    },
    colors: {
      lavender: '#E6E6FA',
      orchid: '#DA70D6',
      amethyst: '#9966CC',
      darkViolet: '#9400D3',
      electricPurple: '#BF00FF',
    },
  },
},
  plugins: [],
};

