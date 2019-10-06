'use strict';
const fs = require('fs');
const path = require('path');
const hash = require('hash-sum');
const LRU = require('lru-cache');
const hljs = require('highlight.js');

// markdown-it 插件
const emoji = require('markdown-it-emoji');
const anchor = require('markdown-it-anchor');
const toc = require('markdown-it-table-of-contents');
const container = require('markdown-it-container');

const utils = require('./utils');
const func = require('../utils/func');

// 自定义块

const md = require('markdown-it')({
        html: true,
        // 代码高亮
        highlight: function(str, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return '<pre class="hljs"><code>' +
                        hljs.highlight(lang, str, true).value +
                        '</code></pre>';
                } catch (__) {
                    console.error(__);
                }
            }

            return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
        },
        linkify: true,
        typographer: true,

    })
    // 使用 emoji 插件渲染 emoji
    .use(emoji)
    // 使用 anchor 插件为标题元素添加锚点
    .use(anchor, {
        permalink: true,
        permalinkBefore: true,
        permalinkSymbol: '#'
    })
    // 使用 table-of-contents 插件实现自动生成目录,网上抄来的,目前无效
    .use(toc, {
        includeLevel: [2, 3]
    })
    .use(container, 'block', {
        validate: params => params.trim().match(/^block\s*(.*)$/),
        render: (tokens, idx) => {
            var m = tokens[idx].info.trim().match(/^block\s*(.*)$/);

            if (tokens[idx].nesting === 1) {
                // 给::: demo标记上头的代码添加代码块
                return `<div class='codeblock'>${tokens[idx].content}`;
            }
            tokens[idx + 1].children = [];
            return '</div>\n';
        }
    })
    .use(container, 'demo', {
        validate: params => params.trim().match(/^demo\s*(.*)$/),
        render: function(tokens, idx) {
            var m = tokens[idx].info.trim().match(/^demo\s*(.*)$/);

            if (tokens[idx].nesting === 1) {
                var desc = tokens[idx + 2].content;
                const html = func.convertHtml(
                    func.stripTags(tokens[idx].content, 'script')
                );
                // 移除描述，防止被添加到代码块
                tokens[idx + 2].children = [];

                return `<demo-block>
                        <div slot="desc">${html}</div>
                        <div slot="highlight">`;
            }
            return '</div></demo-block>\n';
        }
    });
// 定义自定义的块容器


const cache = LRU({ max: 1000 });



module.exports = function(src) {
    const isProd = process.env.NODE_ENV === 'production';

    const file = this.resourcePath;
    const key = hash(file + src);
    const cached = cache.get(key);

    // 重新模式下构建时使用缓存以提高性能
    if (cached && (isProd || /\?vue/.test(this.resourceQuery))) {
        return cached;
    }

    const html = md.render(src);

    const res = (
        '<div class=\'template\'>\n' +
        `<div class="content">${html}</div>\n` +
        '</div>\n'
    );
    cache.set(key, html);
    return html;
};