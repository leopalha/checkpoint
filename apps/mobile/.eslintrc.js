module.exports = {
  root: true,
  extends: [require.resolve('@checkpoint/config/eslint/react-native')],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
