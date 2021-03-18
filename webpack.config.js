require('dotenv').config()

const path = require('path')
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { version } = require('./package.json')
const bundleVersion = version.replace(/\./g, '')

module.exports = {
  entry: ['@babel/polyfill', './index.js'],
  output: {
    filename: `branded-chatbot-window.min.js`,
    path: path.join(__dirname, `dist/${bundleVersion}`)
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
            options: { singleton: true },
          },
          {
            loader: 'css-loader',
          },
        ],
      },
      {
        test: /\.(png|svg|mp3)$/,
        use: ['url-loader'],
      },
    ],
  },
  resolve: {
    alias: {
      react: path.resolve('./node_modules/react')
    }
  },
  optimization: {
    minimizer: [new TerserPlugin()],
  },
  devServer: {
    host: 'localhost',
    port: 3000,
    open: true,
    historyApiFallback: true,
    watchOptions: {
      aggregateTimeout: 500,
      poll: 1000
    }
  },
  plugins: [new HtmlWebpackPlugin({
    template: './public/index.html',
  })]
}
