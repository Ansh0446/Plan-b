import nestjs from '@plan-b/config/eslint/nestjs';

export default [
  ...nestjs,
  {
    languageOptions: {
      sourceType: 'commonjs',
    },
  },
];
