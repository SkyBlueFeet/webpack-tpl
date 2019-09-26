import _black from './tpl/blank.ejs';
import _withHeader from './tpl/withHeader.ejs';
import header from 'app/components/header.ejs';
/**
 *
 * @param  {} title
 * @param  {} body
 */
const initblock = (title, body) => _black({
    title: title,
    body: body
});
/**
 * @param  {} title='我的世界'
 * @param  {} content
 */
const initWithHeader = (title = '我的世界', content) => _withHeader({
    title: title,
    header: header(),
    content: content()
});


export default { initblock, initWithHeader };