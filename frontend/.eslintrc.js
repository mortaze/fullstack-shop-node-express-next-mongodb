module.exports = {
  extends: [
    'next',
    'next/core-web-vitals'
  ],
  parserOptions: {
    babelOptions: {
      presets: [require.resolve('next/babel')],
    },
  },
  rules: {
    // Add your custom rules here
  },
};
