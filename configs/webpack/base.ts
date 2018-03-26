import { Configuration } from 'webpack'
import * as ExtractTextPlugin from 'extract-text-webpack-plugin'
import * as FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin'
import { concat } from 'ramda'
import { getPath } from './utils'

const isProd = 'prod' === process.env.NODE_ENV

const commonPlugins = []
const concatCommon = concat(commonPlugins)

const prodPlugins = concatCommon([
  new ExtractTextPlugin({
    filename: 'common.[hash].css'
  })
])

const devPlugins = concatCommon([new FriendlyErrorsWebpackPlugin()])

const babelrc = {
  presets: [
    [
      'vue-app',
      {
        useBuiltIns: true
      }
    ],
    'env'
  ],
  "plugins": [
    ["ramda", {
      "useES": true
    }]
  ]
}

const publicPath = '/dist/'

const BaseConfiguration: Configuration = {
  devtool: isProd ? false : 'cheap-module-source-map',
  mode: isProd ? 'production' : 'development',
  output: {
    path: getPath('dist'),
    chunkFilename: '[name].[hash].bundle.js',
    filename: '[name].[hash].js'
  },
  resolve: {
    alias: {
      public: getPath('public'),
      '@components': getPath('src/components')
    },
    extensions: ['.ts', '.tsx', '.js', '.vue', '.json']
  },
  plugins: isProd ? prodPlugins : devPlugins,
  performance: {
    maxEntrypointSize: 300000,
    hints: isProd ? 'warning' : false
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          extractCSS: isProd
          // loaders: {
          //   scss: 'vue-style-loader!css-loader!sass-loader',
          //   sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
          //   styl: 'vue-style-loader!css-loader!stylus-loader'
          // }
        }
      },
      { test: /\.styl$/, loader: 'vue-style-loader!css-loader!stylus-loader' },
      { test: /\.pug$/, loader: 'pug-loader', options: { doctype: 'html' } },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: { appendTsSuffixTo: [/\.vue$/] }
      },
      {
        test: /\.tsx$/,
        exclude: /node_modules/,
        use: [{ loader: 'babel-loader', options: babelrc }, 'ts-loader']
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: { name: '[name].[ext]?[hash]' }
      }
    ]
  }
}

export default BaseConfiguration
