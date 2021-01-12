const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  entry: {
    "assets/main": path.resolve(__dirname, './scripts/main.js'),
    "service-worker": path.resolve(__dirname, './scripts/service-worker.js')
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '_site/')
  },
  plugins: [
    new MiniCssExtractPlugin()    
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