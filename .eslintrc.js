module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },

  extends: [
    'plugin:vue/recommended',
    'airbnb-base',
    'plugin:prettier/recommended'
  ],

  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: '@babel/eslint-parser',
  },

  plugins: ['vue', 'prettier',],

  rules: {
    'prettier/prettier': 'error',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },

  root: true,

  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true,
      },
    },
  ],
};
