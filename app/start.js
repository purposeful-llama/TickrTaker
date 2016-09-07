process.env.NODE_ENV = 'development';

// var path = require('path');
// var chalk = require('chalk');
var config = require('./webpack.config.js');
var webpack = require('webpack');
// var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackDevServer = require('webpack-dev-server');
// var config = require('./config/webpack.config.js');
var opn = require('opn');

/********** HELPER FUNCTIONS ************/
//none

/********** INIT ************/
var compiler = webpack(config);

var server = new WebpackDevServer(compiler, {
  contentBase: 'http://localhost/',
  filename: 'bundle.js',
  stats: {
    colors: true
  },
  publicPath: '/compiled/',
});

server.listen(8080, 'localhost', function() {
  opn('http://localhost:3000');
});