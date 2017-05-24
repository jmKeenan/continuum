import webpack from 'webpack'
import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
var CopyWebpackPlugin = require('copy-webpack-plugin')

const BUILD_ENV = process.env.BUILD_ENV

const isProduction = BUILD_ENV === 'production'
process.env.BABEL_ENV = BUILD_ENV

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'dist'),
  public: path.join(__dirname, 'app/public'),
}

const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: PATHS.app + '/index.html',
  filename: 'index.html',
  inject: 'body',
})

const params = {}
if (isProduction) {
  params.BUILD_DIR = path.resolve(__dirname, 'build/prod')
  params.SENTRY_FRONTEND_DSN = 'https://3a230323e0ea4079990d8a298ee89aab@sentry.io/154868'
} else {
  params.BUILD_DIR = path.resolve(__dirname, 'build/staging')
  params.SENTRY_FRONTEND_DSN = 'https://2149001d0b0342e0bcd5158a8602a038@sentry.io/154867'
}
const VarsPlugin = new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify(params.NODE_ENV),
  'process.env.SENTRY_FRONTEND_DSN': JSON.stringify(params.SENTRY_FRONTEND_DSN),
})

const CopyWebpackPluginConfig = new CopyWebpackPlugin([
  { from: 'app/public', to: 'public' },
])

const base = {
  entry: [
    PATHS.app,
  ],
  output: {
    path: params.BUILD_DIR,
    publicPath: '/',
    filename: 'index_bundle.js',
  },
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
      {
        test: /\.global\.css$/,
        loader: 'style!css',
        options: {
          modules: false,
        },
      },
      {
        test: /\.css$/,
        exclude: /\.global\.css$/,
        loader: 'style!css?modules&localIdentName=[local]___[hash:base64:5]',
      },
      {test: /\.json$/, loader: 'json'},
    ],
  },
  resolve: {
    root: path.resolve('./app'),
  },
}

const developmentConfig = {
  devtool: 'cheap-module-source-map',
  devServer: {
    contentBase: PATHS.build,
    hot: true,
    inline: true,
    progress: true,
    proxy: {
      '/api': 'http://127.0.0.1:5000',
    },
    historyApiFallback: true,
  },
  plugins: [HTMLWebpackPluginConfig, CopyWebpackPluginConfig, VarsPlugin, new webpack.HotModuleReplacementPlugin()],
}

const productionConfig = {
  devtool: 'cheap-module-source-map',
  plugins: [HTMLWebpackPluginConfig, CopyWebpackPluginConfig, VarsPlugin],
}

export default Object.assign({}, base, isProduction === true ? productionConfig : developmentConfig)
