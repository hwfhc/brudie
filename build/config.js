const webpack = require('webpack');

module.exports = {
    entry: `${__dirname}/../index.js`,
    output: {
        path: `${__dirname}/../dist`,
        filename: 'interpreter.min.js'
    },
    module: {
        rules: [{
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['es2015']
                }
            }
        }]
    },
    plugins: [
        new webpack.BannerPlugin('hwfhc'),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin()
    ]
};