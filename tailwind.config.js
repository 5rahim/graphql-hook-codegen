/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
    data: {
      checked: 'checked',
      selected: 'selected',
      disabled: 'disabled',
      highlighted: 'highlighted',
    },
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require('@tailwindcss/forms'), require('@headlessui/tailwindcss')],
}

