var webpack = require('webpack');
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var HtmlWebpackPlugin = require('html-webpack-plugin');
var version = "1";

module.exports = {
    entry: {
        main: [
            'webpack-dev-server/client?http://localhost:3011',
            'webpack/hot/only-dev-server',
            './src/index.js'
        ]
    },
    output: {
        path: __dirname + '/build/',
        filename: version + '.bundle.js',
        publicPath: '/build/',
        chunkFilename: '[id].[hash].chunk.js',
    },
    module: {
        loaders:[
            {
                test: /\.js[x]?$/,
                exclude: /node_modules/,
                loaders: ['react-hot', 'babel'],
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader",
            },
            {
                test: /\.less$/,
                loader: "style-loader!css-loader!less-loader",
            }
        ]
    },
    resolve: {
        modulesDirectories: ["web_loaders", "web_modules", "node_loaders", "node_modules", "src", "lib_components", ""],
        extensions: ["", ".webpack-loader.js", ".web-loader.js", ".loader.js", ".js", ".jsx"],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        ]
}
