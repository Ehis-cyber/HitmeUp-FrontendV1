import { nextui } from "@nextui-org/theme";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      screens: {
        lg: '1024px',
        xl: '1024px',
        '2xl': '1280px',
      },
      center: true,
      padding: '1rem 1.5rem',

    },
    extend: {
      colors: { 
        'purple-heart': '#6A0DAD',
        'blue-ribbon': '#0066FF',
        'carrot-orange': '#ED9121',
        'malachite': '#0DF205',
        'royal-heath': {
          50: '#FBE9F2',
          100: '#F7CDE4',
          200: '#F09FCF',
          300: '#E56BB5',
          400: '#D5389B',
          500: '#BB1E81',
          600: '#951768',
          700: '#70114F',
          800: '#4B0A36',
          900: '#26051D',
        },
        'logo': '#172337',
        'brandcolor': '#382D9C',
      },
      fontFamily: {
        custom: ['AldransAltW00-Medium', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};

export default config;
