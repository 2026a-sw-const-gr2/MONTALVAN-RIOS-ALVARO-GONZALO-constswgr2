export default [
  {
    ignores: ['node_modules', 'dist', 'coverage'],
  },
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 2020,
      globals: {
        __dirname: 'readonly',
        __filename: 'readonly',
        process: 'readonly',
        global: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': 'off',
    },
  },
];
