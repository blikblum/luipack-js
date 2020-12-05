
const sassRule = {
  test: /\.(sass|scss)$/,
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      options: {
        sourceMap: true,
      },
    },
    {
      loader: 'sass-loader',
      options: {
        sourceMap: true,
      },
    },
  ],
}

module.exports = {
  stories: ['../stories/**/*.stories.js'],
  addons: ['@storybook/addon-essentials'],
  webpackFinal: async function (config) {
    if (config.name !== 'manager') {
      // remove web-components babel rule 
      const ruleIndex = config.module.rules.findIndex(
        (rule) => rule.use && rule.use.options && rule.use.options.babelrc === false
      )
      if (ruleIndex !== -1) {
        config.module.rules.splice(ruleIndex, 1)
      }
    }
    config.module.rules.push(sassRule)
    return config
  },
}
