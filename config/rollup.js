var pkg = require('../package.json');

// 兼容 base64 和 @jsmini/base64，@jsmini/base64 替换为 jsmini_base64
var name = pkg.name.replace('@', '').replace(/\//g, '_');
var version = pkg.version;

var banner = 
`/*!
 * base64 ${version} (https://github.com/jsmini/base64)
 * API https://github.com/jsmini/base64/blob/master/doc/api.md
 * Copyright 2017-${(new Date).getFullYear()} jsmini. All Rights Reserved
 * Licensed under MIT (https://github.com/jsmini/base64/blob/master/LICENSE)
 */
`;

exports.name = name;
exports.banner = banner;
