const path = require('path');
const { cache } = require('webpack');

module.exports = {
    entry: './src/indexAbuelo.ts',
    module : {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname,'dist'),
        publicPath: '/dist/',
    },
    cache : {
        type: 'filesystem',
    },
    mode: 'production',
}