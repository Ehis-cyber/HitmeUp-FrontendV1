/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Include all files in the src directory
  ],
  theme: {
    extend: {
      fontFamily: {
        'logo': ['AldransAltW00-Medium', 'sans-serif'], // Add your custom font
    },
  },
},
  plugins: [],
};

