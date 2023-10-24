// Inspired by https://github.com/airbnb/javascript.

module.exports = {
  extends: 'eslint:recommended',
  env: {
    node: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['import'],
  overrides: [
    {
      files: ['**/*.ts'],
      extends: [
        'plugin:@typescript-eslint/recommended-type-checked',
        'plugin:@typescript-eslint/stylistic-type-checked',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
      plugins: ['@typescript-eslint'],
      settings: {
        'import/resolver': {
          typescript: {
            alwaysTryTypes: true,
            project: './tsconfig.json',
          },
        },
      },

      // Note: If adding a typescript-eslint version of an existing ESLint rule,
      // make sure to disable the ESLint rule here.
      rules: {
        // https://typescript-eslint.io/rules/
        'no-unused-expressions': 'off',
        '@typescript-eslint/no-unused-expressions': [
          'error',
          {
            allowShortCircuit: true,
            allowTernary: true,
            allowTaggedTemplates: true,
          },
        ],
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': [
          'warn',
          {
            functions: false,
            classes: false,
            variables: false,
            typedefs: false,
          },
        ],
        'no-useless-constructor': 'off',
        '@typescript-eslint/no-useless-constructor': 'error',
      },
    },
  ],

  // Note: When adding rules here, you need to make sure they are compatible with
  // `typescript-eslint`, as some rules such as `no-unused-expressions` aren't compatible.
  rules: {
    // https://eslint.org/docs/latest/rules/
    'array-callback-return': 'error',
    'default-case': ['error', {commentPattern: '^no default$'}],
    eqeqeq: ['error', 'smart'],
    'new-parens': 'warn',
    'no-caller': 'error',
    'no-eval': 'error',
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-extra-label': 'error',
    'no-iterator': 'error',
    'no-label-var': 'error',
    'no-labels': ['error'],
    'no-lone-blocks': 'error',
    'no-loop-func': 'error',
    'no-mixed-operators': [
      'error',
      {
        groups: [
          ['&', '|', '^', '~', '<<', '>>', '>>>'],
          ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
          ['&&', '||'],
          ['in', 'instanceof'],
        ],
        allowSamePrecedence: false,
      },
    ],
    'no-multi-str': 'error',
    'no-new-func': 'error',
    'no-object-constructor': 'error',
    'no-new-wrappers': 'error',
    'no-octal-escape': 'error',
    'no-script-url': 'error',
    'no-self-compare': 'error',
    'no-sequences': 'error',
    'no-template-curly-in-string': 'error',
    'no-throw-literal': 'error',
    'no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true,
      },
    ],
    'no-use-before-define': [
      'warn',
      {
        functions: true,
        classes: true,
        variables: true,
      },
    ],
    'no-useless-computed-key': 'error',
    'no-useless-concat': 'error',
    'no-useless-constructor': 'error',
    'no-useless-rename': [
      'warn',
      {
        ignoreDestructuring: false,
        ignoreImport: false,
        ignoreExport: false,
      },
    ],
    'no-whitespace-before-property': 'error',
    'rest-spread-spacing': ['warn', 'never'],
    strict: ['warn', 'never'],
    'unicode-bom': ['error', 'never'],

    // https://github.com/import-js/eslint-plugin-import/tree/main/docs/rules
    'import/no-unresolved': 'error',
    'import/named': 'error',
    'import/namespace': 'error',
    'import/default': 'error',
    'import/export': 'error',
    'import/first': 'error',
    'import/no-amd': 'error',
    'import/no-anonymous-default-export': 'warn',
    'import/no-named-as-default': 'warn',
    'import/no-named-as-default-member': 'warn',
    'import/no-duplicates': 'warn',
  },
};
