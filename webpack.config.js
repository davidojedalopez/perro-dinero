const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { InjectManifest } = require('workbox-webpack-plugin')

module.exports = {
  entry: './scripts/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '_site/assets')
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new InjectManifest({
      swSrc: './scripts/service-worker.js'
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
      }
    ]
  }
}