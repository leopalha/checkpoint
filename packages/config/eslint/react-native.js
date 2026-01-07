/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['./react.js'],
  plugins: ['react-native'],
  env: {
    'react-native/react-native': true,
  },
  rules: {
    // React Native specific
    'react-native/no-unused-styles': 'warn',
    'react-native/no-inline-styles': 'warn',
    'react-native/no-color-literals': 'off',
    'react-native/no-raw-text': 'off',
    'react-native/split-platform-components': 'warn',

    // Disable web-specific a11y rules for RN
    'jsx-a11y/accessible-emoji': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
  },
};
