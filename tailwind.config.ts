import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: { ink: '#171313', rose: '#d94e72', blush: '#f8e8e9', paper: '#fbf8f5', plum: '#68404c' },
      fontFamily: { display: ['Georgia', 'serif'], sans: ['Arial', 'sans-serif'] }
    }
  },
  plugins: []
};

export default config;