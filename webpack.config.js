const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  entry: './scripts/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '_site/assets')
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