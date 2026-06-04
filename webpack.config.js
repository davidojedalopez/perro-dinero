const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const assetManifestName = 'assets/manifest.json'

class AssetManifestPlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('AssetManifestPlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'AssetManifestPlugin',
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
        },
        () => {
          const manifest = {}

          for (const asset of compilation.getAssets()) {
            if (/^assets\/main\.[a-f0-9]+\.css$/.test(asset.name)) {
              manifest.mainCss = `/${asset.name}`
              manifest['/assets/main.css'] = `/${asset.name}`
            }

            if (/^assets\/main\.[a-f0-9]+\.js$/.test(asset.name)) {
              manifest.mainJs = `/${asset.name}`
              manifest['/assets/main.js'] = `/${asset.name}`
            }
          }

          compilation.emitAsset(
            assetManifestName,
            new compiler.webpack.sources.RawSource(`${JSON.stringify(manifest, null, 2)}\n`)
          )
        }
      )
    })
  }
}

module.exports = {
  entry: {
    "assets/main": path.resolve(__dirname, './scripts/main.js'),
    "service-worker": path.resolve(__dirname, './scripts/service-worker.js')
  },
  output: {
    filename: (pathData) => pathData.chunk.name === 'service-worker'
      ? '[name].js'
      : '[name].[contenthash:12].js',
    chunkFilename: 'assets/[name].[contenthash:12].js',
    path: path.resolve(__dirname, '_site/')
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'assets/main.[contenthash:12].css'
    }),
    new AssetManifestPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: [/node_modules/, /newsletters/, /_site\/newsletters/],
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
      }
    ]
  }
}
