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
  stories: ['../bs-components/**/*.stories.js', '../*.stories.js'],
  addons: ['@storybook/addon-essentials'],
  webpackFinal: async function (config) {
    config.module.rules.push(sassRule)
    return config
  },
  framework: {
    name: '@storybook/web-components-webpack5',
    options: {},
  },
}
