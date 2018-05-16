const CleanWebpackPlugin = require('clean-webpack-plugin');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common(true), {
    devtool: 'inline-source-map',
    plugins: [
        new CleanWebpackPlugin(['dist'])
    ]
});