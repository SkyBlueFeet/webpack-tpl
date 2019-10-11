'use strict';

const HappyPack = require('happypack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const resolve = dir => path.resolve(__dirname, '..', dir);
const Global = require('./global');
const browserslist = require('../package.json').browserslist;

const IS_PRODUCTION = Global.IS_PRODUCTION;
exports.loader = [
{
    test: /\.js$/,
    loader: 'happypack/loader?id=babel',
    exclude: resolve('node_modules')
},
{
    test: /\.(c|le|pc|sa|sc)ss$/,
    use: [
        IS_PRODUCTION ? MiniCssExtractPlugin.loader : 'style-loader',
        'css-loader',
        'postcss-loader',
        'sass-loader'
    ]
},
{
    test: /\.ejs$/,
    loader: 'ejs-loader?variable=data'
},
{
    // 供iconfont方案使用，后面会带一串时间戳，需要特别匹配到
    test: /\.(woff|woff2|svg|eot|ttf)\??.*$/,
    // exclude: /glyphicons/,
    // loader: 'file-loader?name=vendor/fonts/[name].[ext]',
    loader: 'file-loader',
    options: {
        name: 'fonts/[name].[hash].[ext]'
    }
},
{
    test: /\.(gif|png|jpe?g|svg)$/i,
    use: [
    {
        loader: 'url-loader',
        options: {
            limit: 10000,
            name: 'img/[name].[hash:6].[ext]'
        }
    },
    {
        loader: 'image-webpack-loader',
        options: {
            mozjpeg: {
                progressive: true,
                quality: 65
            },
            // optipng.enabled: false will disable optipng
            optipng: {
                enabled: true
            },
            pngquant: {
                quality: [0.65, 0.9],
                speed: 4
            },
            gifsicle: {
                interlaced: false
            },
            // the webp option will enable WEBP
            webp: {
                quality: 75
            }
        }
    }]
},
{
    test: /\.md$/,
    use: [
    {
        loader: 'html-loader'
    },
    {
        loader: require.resolve('./md-loader.js')
    }],
    exclude: path.resolve(__dirname, '..', 'project')
},
{
    test: /\.md$/,
    use: [
        { loader: 'vue-loader' },
        {
            loader: require.resolve('./md-loader.js')
        }
    ],
    include: path.resolve(__dirname, '..', 'project') //处理使用Vue代码的md文件
},
{
    test: /\.vue$/,
    loader: 'vue-loader',
    options: {
        transformToRequire: {
            video: ['src', 'poster'],
            source: 'src',
            img: 'src',
            image: 'xlink:href'
        }
    }
}];

exports.happyPackPlugin = [
    new HappyPack({
        id: 'babel',
        loaders: [
        {
            loader: 'babel-loader'
        }]
    })
];