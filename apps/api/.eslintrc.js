module.exports = {
  root: true,
  extends: [require.resolve('@checkpoint/config/eslint/nestjs')],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
