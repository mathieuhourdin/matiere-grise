/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      width: {
        '250px': '250px',
        '80pt': '80%'
      },
      aspectRatio: {
        '1/2': '1 / 2'
      },
      fontFamily: {
        mplus: ["'M PLUS Rounded 1c'", 'Verdana', 'sans-sherif']
      },
      fontSize: {
        '2xs': '0.6rem',
        '3xs': '0.5rem'
      },
      minHeight: {
        96: '24rem'
      }
    }
  },
  plugins: []
}
