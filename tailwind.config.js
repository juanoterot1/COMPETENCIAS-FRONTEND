// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        customPurple: {
          50: '#03002e',
          100: '#010048',
          200: '#010057',
          300: '#02006c',
          400: '#090088',
        },
        customWhite: {
          50: '#ffffff',
          100: '#f4f4f4',
          200: '#e0e0e0',
        },
      },
    },
  },
  plugins: [],
}
