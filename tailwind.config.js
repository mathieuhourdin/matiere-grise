/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      aspectRatio: {
        '1/2': '1 / 2'
      },
      fontFamily: {
        mplus: ["'M PLUS Rounded 1c'", 'Verdana', 'sans-sherif']
      }
    }
  },
  plugins: []
}