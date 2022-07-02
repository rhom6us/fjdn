'use strict';

const BabiliPlugin = require("babili-webpack-plugin");
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

  module.exports = {
  entry: {
    fu: './src/index.ts'
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [{
      test: /.tsx?$/,
      exclude: [
        path.resolve(__dirname, 'node_modules'),
        path.resolve(__dirname, 'bower_components')
      ],
      use: {
        loader: 'awesome-typescript-loader',
        options: {}
      }
    }]
  },
  plugins: [
    new HtmlWebpackPlugin()
    //  new BabiliPlugin()
  ],
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src')
    ],
    extensions: ['.ts', 'tsx', '.json', '.js', '.jsx', '.css']
  },
  devtool: 'source-map'
};