// var webpack = require('webpack');

module.exports = {
  entry: `${__dirname}/app/components/index.tsx`,
  output: {
    path: `${__dirname}/public`,
    filename: 'bundle.js',
  },
  mode: 'development',
  devServer: {
    static: {
      directory: `${__dirname}/public`,
    },
    compress: true,
    port: 8000,
  },
  module: {
    rules: [
      { test: /\.[jt]{1}sx?$/, use: 'babel-loader', exclude: /(node_modules)/ },
      { test: /\.css$/i, use: ['style-loader', 'css-loader'], exclude: /(node_modules)/ },
      { test: /\.s[ac]ss$/i, use: ['style-loader', 'css-loader', 'sass-loader'], exclude: /(node_modules)/ },
      { test: /\.(txt|jl)$/i, use: 'raw-loader', exclude: /(node_modules)/ },
    ],
  },
};
