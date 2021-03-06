const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
const {resolve} = require('./utils');

module.exports = function webpackBaseConfig (NODE_ENV = 'development') {
    const config = require('./config')[NODE_ENV];
    let entry;
    let plugins = [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
        })
    ];

    // 开发环境
    if (NODE_ENV === 'development') {
        plugins.push(
            new webpack.HotModuleReplacementPlugin()
        );
        plugins.push(
            new webpack.HotModuleReplacementPlugin()
        );
        plugins.push(
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: resolve('examples', 'index.html'),
                chunks: ['index'],
                hash: false,
                inject: 'body',
                xhtml: false,
                minify: {
                    removeComments: true,
                }
            })
        );
        entry = {
            index: resolve('examples', 'index.js')
        };
    } else {
        plugins.push(
            new ExtractTextPlugin({
                filename: `css/${config.filenameHash ? '[name].[contenthash:8]' : '[name]'}.css`,
                allChunks: true
            })
        );
        // manifast
        // plugins.push(
        //     new ChunkManifestPlugin()
        // );
        plugins.push(
            new webpack.optimize.CommonsChunkPlugin({
                names: ['vendor', 'common']
            }),
        );
        plugins.push(
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: resolve('examples', 'index.html'),
                chunks: ['vendor', 'common', 'index'],
                hash: false,
                inject: 'body',
                xhtml: false,
                minify: {
                    removeComments: true,
                }
            }),
        );
        entry = {
            index: resolve('examples', 'index.js'),
            vendor: ['react', 'react-router-dom', 'react-dom'],
            common: ['prism-react-renderer', 'classnames', 'react-transition-group', 'styled-components', 'prop-types']
        };
    }

    const webpackConfig = {
        entry,
        output: {
            path: resolve('../coocssweb.github.io/react'),
            publicPath: config.staticPath,
            filename: `js/${config.filenameHash ? '[name].[chunkhash]': '[name]' }.js`,
            chunkFilename: `js/${config.filenameHash ? '[name].[chunkhash]': '[name]'}.js`
        },
        devtool: config.devtool,
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /(node_modules)/,
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        plugins: ['react-hot-loader/babel'],
                    },
                },
                {
                    test: /\.js$/,
                    enforce: 'pre',
                    exclude: /node_modules/,
                    loader: 'eslint-loader',
                    options: {
                        formatter: require('eslint-friendly-formatter')
                    }
                },
                {
                    test: /\.jsx$/,
                    enforce: 'pre',
                    exclude: /node_modules/,
                    loader: 'eslint-loader',
                    options: {
                        formatter: require('eslint-friendly-formatter')
                    }
                },
                {
                    test: /\.js$/,
                    enforce: 'pre',
                    exclude: /node_modules/,
                    loader: 'eslint-loader',
                    options: {
                        formatter: require('eslint-friendly-formatter')
                    }
                },
                {
                    test: /\.html$/,
                    loader: 'html-loader'
                },
                {
                    test: /\.ejs$/,
                    loader: 'ejs-loader'
                },
                {
                    test: /\.(png|jpg|gif|svg)$/,
                    loader: `url-loader?limit=1&name=${config.imagesFilePath}${config.filenameHash ? '[name].[hash:8]': '[name]'}.[ext]`
                },
                {
                    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                    loader: `file-loader?name=${config.fontsFilePath}${config.filenameHash ? '[name].[hash:8]': '[name]'}.[ext]`
                },
                {
                    test: /\.(scss|css)$/,
                    use: NODE_ENV === 'development' ? ['style-loader', 'css-loader', 'sass-loader', 'postcss-loader'] : ExtractTextPlugin.extract({
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: false,
                                    minimize: true,
                                }
                            },
                            'postcss-loader',
                            'sass-loader?sourceMap',
                        ],
                        fallback: 'style-loader'
                    })
                },
            ]
        },
        plugins,
        resolve: {
            alias: {
                components: resolve('components')
            },
            // 文件后缀自动补全
            extensions: ['.js', '.jsx']
        },
    };

    // 开发环境服务器配置
    if (NODE_ENV === 'development') {
        webpackConfig.devServer = {
            contentBase: resolve('dist'),
            compress: false,
            host: '127.0.0.1',
            port: config.port,
            hot: true,
            disableHostCheck: true,
            historyApiFallback: true
        };
    } else {
        webpackConfig.plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                    dead_code: true
                },
                sourceMap: false,
                output: {
                    comments: false
                }
            })
        );
    }

    return webpackConfig;
};
