const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const autoprefixer = require('autoprefixer')
const TerserPlugin = require('terser-webpack-plugin')
const WebpackBarPlugin = require('webpackbar')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('css-minimizer-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  mode: process.env.NODE_ENV,
  entry: path.resolve(__dirname, './src/index.tsx'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash:8].js'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    modules: ['node_modules']
  },
  devtool: isProd ? 'source-map' : 'cheap-module-source-map', // 生产source-map
  module: {
    rules: [
      // 处理LESS文件
      {
        test: /\.(css|less)$/,
        use: [
          'style-loader', // 将样式插入到DOM中
          {
            loader: 'css-loader',
            options: {
              modules: { localIdentName: '[local]___[hash:base64:5]' }
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [autoprefixer()]
              }
            }
          },
          'less-loader' // 将 LESS 编译成 CSS
        ],
        include: [path.resolve(__dirname, 'src')],
        exclude: [/node_modules/]
      },
      {
        test: /\.(tsx|jsx|ts|js)?$/,
        include: [path.resolve(__dirname, 'src')],
        exclude: /node_modules/,
        use: [
          {
            loader: 'swc-loader',
            options: {
              configFile: path.resolve(__dirname, '.swcrc')
            }
          }
        ]
      }
    ]
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        exclude: /node_modules/,
        include: path.resolve(__dirname, 'src'),
        terserOptions: {
          compress: {
            drop_console: true
          }
        }
      }),
      new OptimizeCSSAssetsPlugin()
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    },
    runtimeChunk: {
      // 打包运行时js
      name: (entrypoint) => `runtime-${entrypoint.name}`
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.html')
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      ignoreOrder: true,
      chunkFilename: '[name].chunk.css'
    }),
    new WebpackBarPlugin(),
    new FriendlyErrorsWebpackPlugin()
  ]
}
