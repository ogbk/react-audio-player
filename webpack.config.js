var webpack = require('webpack');

module.exports = {
	entry: __dirname+"/app/index.js",
	output:{
		path: __dirname+"/public", filename: 'bundle.js'
	},
	module:{
		loaders: [
			{	test: /\.js$/, loader: 'babel-loader', exclude: /(node_modules)/ },
      { test: /\.sass$/, loader: 'style-loader!css-loader!sass-loader' }
		
		]
	}
}
