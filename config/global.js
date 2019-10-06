'use strict';

const path = require('path');

const RootDir = path.resolve(__dirname, '..');

/**
 * IS_PRODUCTION设置全局环境
 * alias全局假名路径
 *
 */

module.exports = {
    IS_PRODUCTION: false,
    alias: {
        root: RootDir,
        app: path.resolve(RootDir, 'app'),
        layout: path.resolve(RootDir, 'app/layout'),
        components: path.resolve(RootDir, 'app/components'),
        pages: path.resolve(RootDir, 'app/pages'),
        static: path.resolve(RootDir, 'app/static'),
    }
};