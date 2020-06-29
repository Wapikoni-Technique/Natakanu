module.exports = {
  extends: 'erb',
  settings: {
    'import/resolver': {
      webpack: {
        config: require.resolve('./configs/webpack.config.eslint.js')
      }
    }
  },
  rules: {
    'flowtype/no-weak-types': 0,
    'no-restricted-syntax': 0,
    'no-await-in-loop': 0,
    'react/prop-types': 0,
    'react/jsx-props-no-spreading': 0,
    'react/button-has-type': 'warn',
    'react/jsx-no-literals': [
      'warn',
      {
        ignoreProps: true,
        allowedStrings: ['/', '📁', '📁 ../', '🔙', '🗑', '➕', '⚙']
      }
    ],
    'jsx-a11y/no-autofocus': 0,
    'jsx-a11y/label-has-associated-control': 'warn',
    'jsx-a11y/accessible-emoji': 'warn'
  }
};
