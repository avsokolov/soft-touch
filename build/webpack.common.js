const path = require('path');

module.exports = function(dev) {
    return {
        mode: dev ? 'development' : 'production',
        entry: {
            index: './src/index.js'
        },
        output: {
            filename: `index${dev ? '' : '.min'}.js`,
            path: path.resolve('./dist')
        }
    };
};