import baseConfig from '@workspace/eslint-config/base';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...baseConfig,
  {
    files: ['src/**/*.ts'],
    ignores: ['node_modules/**'],
  },
];
