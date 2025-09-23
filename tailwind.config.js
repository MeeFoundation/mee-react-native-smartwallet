const primary = {
  DEFAULT: '#4F868E',
}

const red = {
  500: '#EF4444',
  700: '#B91C1C',
}

const semantic = {
  danger: red['500'],
}

const colors = {
  primary,
  red,
  ...semantic,
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  plugins: [
    ({ addBase }) =>
      addBase({
        ':root': {
          '--color-rgb': 'rgb(255 0 0)',
          '--color-values': '255 0 0',
        },
      }),
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors,
      spacing: {
        13: '52px',
      },
    },
  },
}
