/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['./base.js'],
  env: {
    node: true,
    jest: true,
  },
  rules: {
    // NestJS specific
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    // Allow console in backend for logging
    'no-console': 'off',

    // Stricter rules for backend
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-misused-promises': 'error',
    '@typescript-eslint/await-thenable': 'error',

    // Import rules
    'import/no-cycle': 'error',
  },
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: process.cwd(),
  },
};
