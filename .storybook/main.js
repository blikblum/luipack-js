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
  core: {
    builder: 'webpack5',
  },
  stories: ['../stories/**/*.stories.js'],
  addons: ['@storybook/addon-essentials'],
  webpackFinal: async function (config) {
    config.module.rules.push(sassRule)
    return config
  },
}
