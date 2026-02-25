import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['node_modules/**', 'cucumber_report.json', 'cucumber_report.html', '**/*.md', '.sdd/**'] },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'warn',
      'no-debugger': 'error',
      'prefer-const': 'warn',
      'no-var': 'warn',
      'eqeqeq': ['warn', 'always'],
    },
  },
  {
    files: ['features/step_definitions/**/*.js', 'utils/**/*.js'],
    rules: {
      'no-console': 'off',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'MemberExpression[object.name="global"]',
          message: 'Do not use global; use Cucumber World (this) instead.',
        },
      ],
    },
  },
  {
    files: ['scripts/**/*.js'],
    rules: {
      'no-console': 'off',
    },
  },
];
