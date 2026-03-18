/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Material You Dark palette
        surface: '#1C1B1F',
        surfaceVar: '#2B2930',
        surfaceHigh: '#36343B',
        primary: '#D0BCFF',
        primaryDark: '#6750A4',
        secondary: '#CCC2DC',
        tertiary: '#EFB8C8',
        error: '#F2B8B5',
        errorDark: '#B3261E',
        onSurface: '#E6E1E5',
        onSurfaceVar: '#CAC4D0',
        outline: '#938F99',
        // Verdict colors
        safe: '#A8DAB5',
        safeBg: '#1B3726',
        warning: '#FFD599',
        warningBg: '#3D2E14',
        danger: '#FFB4AB',
        dangerBg: '#3B1B1B',
      },
      fontFamily: {
        sans: ['System'],
      },
    },
  },
  plugins: [],
};
