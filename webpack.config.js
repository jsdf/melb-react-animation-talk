var path = require('path');
var webpack = require('webpack');

var entries = {};
['1','2','3','4'].forEach(n => 
  entries[n] = [
    'webpack-hot-middleware/client',
    './demos/'+n+'/index',
  ]
);

module.exports = {
  // devtool: 'eval',
  entry: entries,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: "[name].js",
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: path.join(__dirname, 'demos')
    }]
  }
};