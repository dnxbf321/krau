module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    }
  },
  rules: {
    'arrow-parens': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    indent: [2, 2],
    semi: [2, 'never'],
    'space-before-function-paren': [2, 'never'],
    'no-new': 0,
    'no-undef': 0
  },
  globals: {
    '$': true
  }
}
