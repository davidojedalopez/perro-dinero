module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    '@csstools/postcss-oklab-function': {
      preserve: false,
      subFeatures: { displayP3: false },
    },
    autoprefixer: {},
  }
}