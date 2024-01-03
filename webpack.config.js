const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

/**
 * This is the base configuration for webpack,
 * it's handling all typescript source code
 */
const config = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  devServer: {
    static: './',
    hot: false,
    liveReload: true
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle/index.min.js',
    path: path.resolve(__dirname, 'assets')
  }
};

/**
* We can add rules depending on the mode, i.e. 
* a live server on development and more. 
*/
module.exports = (_env, argv) => {
  // NOTE: webpack still automatically adds optimization depending on the mode flag
  if (argv.mode === 'development') {
    config.plugins = [
      new HTMLWebpackPlugin({ template: './index.html' })
    ]
  }

  if (argv.mode === 'production') {}

  return config;
}