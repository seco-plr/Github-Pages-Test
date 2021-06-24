const path = require('path');
const webpack = require('webpack');

module.exports = function (compilerConfig, build) {

    const dest = (build !== undefined) ? build : compilerConfig.dest;

    const config = {
        entry: {
            'js/main': compilerConfig.src.script
        },
        output: {
            path: path.resolve(__dirname, dest, 'assets'),
            filename: '[name].js'
        }
    };

    const optimizationSettings = {
        minimize: true,
        runtimeChunk: true,
        splitChunks: {
            chunks: "async",
            minSize: 1000,
            minChunks: 2,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: false,
            cacheGroups: {
                default: {
                    minChunks: 1,
                    priority: -20,
                    reuseExistingChunk: true,
                },
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                }
            }
        }
    };

    if (!compilerConfig.dev) {
        config.optimization = optimizationSettings;
    }

    return config;
};
