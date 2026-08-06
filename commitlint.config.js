/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'chore',
        'refactor',
        'docs',
        'test',
        'style',
        'perf',
        'build',
        'ci',
        'revert',
      ],
    ],
    'subject-case': [0],
  },
};
