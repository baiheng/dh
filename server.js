var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
var port = 3011;


new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    proxy: {  
            '/api/dh/': {  
            	changeOrigin: true,
                target: 'http://gp.xiaoshutech.com/',  
                secure: false  
            }  
        }  
}).listen(port, function (err, result) {
if (err) console.log(err);
    console.log('Listening at localhost:' + port);
});