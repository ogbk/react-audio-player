// var webpack = require('webpack');

module.exports = {
  entry: `${__dirname}/app/components/index.js`,
  output: {
    path: `${__dirname}/public`,
    filename: 'bundle.js',
  },
  mode: 'none',
  devServer: {
    contentBase: `${__dirname}/public`,
    port: 8000,
  },
  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader', exclude: /(node_modules)/ },
      { test: /\.css$/i, use: ['style-loader', 'css-loader'] },
      { test: /\.s[ac]ss$/i, use: ['style-loader', 'css-loader', 'sass-loader'] },
      { test: /\.(txt|jl)$/i, use: 'raw-loader' },
    ],
  },
};
