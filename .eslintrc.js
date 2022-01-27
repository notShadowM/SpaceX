module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'linebreak-style': 0,
    'no-nested-ternary': 'off',
    'react/jsx-props-no-multi-spaces': 0,
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'no-unused-vars': 'off',
    'no-param-reassign': 0,
    'max-len': 0,
    'no-mixed-operators': 0,
    'no-unused-expressions': 'off',
    'import/no-extraneous-dependencies': 'off',
    'jsx-a11y/anchor-is-valid': 0,
    'react/no-unstable-nested-components': 'off',
    'default-param-last': 'off',
    'react/no-array-index-key': 'off',
    'react/jsx-props-no-spreading': 'off',
  },
};
