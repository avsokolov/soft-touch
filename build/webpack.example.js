const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common(true), {
    entry: {
        index: './example/index.js'
    },
    output: {
        filename: 'example.js'
    },
    devtool: 'inline-source-map',
    plugins: [
        new HtmlWebpackPlugin({
            template: './example/index.html',
            inject: 'body'
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
});