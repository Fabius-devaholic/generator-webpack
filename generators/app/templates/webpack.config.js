const webpack                 = require('webpack')
const path                    = require('path')
const CleanWebpackPlugin      = require('clean-webpack-plugin')
const UglifyJsPlugin          = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin    = require('mini-css-extract-plugin')
<% if (stylelint) { %>
const StyleLintPlugin         = require('stylelint-webpack-plugin')
<% } %>
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CopyWebpackPlugin       = require('copy-webpack-plugin')

let config = {

  entry: [
    'babel-polyfill',
    './<%= srcDir %>/<%= srcScriptDir %>/main.js',
    './<%= srcDir %>/<%= srcStyleDir %>/main.scss'
  ],
  output: {
    path: path.resolve(__dirname, './<%= distDir %>'),
    publicPath: '/<%= distDir %>/',
    filename: '<%= distScriptDir %>/[name].js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            query: {
              presets: [
                [ 'env', { 'modules': false } ],
                'stage-3'
              ]
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|svg|woff|woff2|eot|ttf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // Inline files smaller than 10 kB (10240 bytes)
              // limit: 10 * 1024
            }
          }
        ]
      },
      {
        test: /\.svg(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              // Inline files smaller than 10 kB (10240 bytes)
              // limit: 10 * 1024,
              // Remove the quotes from the url
              // (they’re unnecessary in most cases)
              noquotes: true,
              iesafe: true
            }
          }
        ]
      },
      {
        test: /\.md/,
        use: [
          {
            loader: 'raw-loader'
          }
        ]
      },
    ]
  },

  plugins: [
    new CleanWebpackPlugin(['<%= distDir %>']),
    new CopyWebpackPlugin([
      { from: '<%= srcDir %>/<%= srcAssetsDir %>/', to: '<%= distAssetsDir %>/' },
    ], {}),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '<%= distStyleDir %>/[name].css',
      chunkFilename: '[id].css'
    }),
  ]

}

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    let rules = [
      <% if (eslint) { %>
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'eslint-loader'
          }
        ]
      },
      <% } %>
    ]
    rules.map(rule => {
      config.module.rules.push(rule)
    })

    let plugins = [
      <% if (stylelint) { %>
      new StyleLintPlugin(),
      <% } %>
      new webpack.HotModuleReplacementPlugin(),
    ]
    plugins.map(plugin => {
      config.plugins.push(plugin)
    })

    config.devServer = {
      historyApiFallback: true,
      noInfo: true,
      overlay: {
        warnings: true,
        errors: true
      },
      hot: true,
      host: '0.0.0.0',
      port: 8000,
      disableHostCheck: true,
      // open: true,
      // contentBase: './dist',
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    }

    config.stats = {
      colors: true
    }

    config.devtool = 'inline-source-map'

    console.log('Starting dev server...')
    console.log('Listening at http://localhost:8000')
  }

  if (argv.mode === 'production') {
    let plugins = [
      new webpack.HashedModuleIdsPlugin(),
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({}),
    ]
    plugins.map(plugin => {
      config.plugins.push(plugin)
    })

    config.devtool = 'source-map'
  }

  return config
}
