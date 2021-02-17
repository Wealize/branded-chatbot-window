require('dotenv').config()

const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const { version } = require('./package.json')
const bundleVersion = version.replace(/\./g, '')

module.exports = {
  entry: ['@babel/polyfill', './src/index.js'],
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
    minimizer: [new UglifyJsPlugin()],
  },
}
