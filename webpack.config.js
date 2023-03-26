const path = require('path')

const nodeExternals = require('webpack-node-externals')
const WebpackShellPlugin = require('webpack-shell-plugin-next')

const { NODE_ENV = 'production' } = process.env

module.exports = {
  entry: './src/index.ts',
  mode: NODE_ENV,
  target: 'node',
  externals: [nodeExternals()],
  watch: NODE_ENV === 'development',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js'
  },
  resolve: {
    extensions: ['.ts']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader'
        }
      }
    ]
  },
  plugins: [
    new WebpackShellPlugin({
      onBuildEnd: ['yarn dev']
    })
  ]
}
