# 文档
这是一个base64编码解码库

## Base64.encode

Base64生成函数

根据字符串或二进制流生成bese64串

函数参数和返回值

- param {string} str 传入的字符串。非 string 参数会被当作二进制流解析，这意味着传入普通object将会被解析为空，传入二进制stream会被解析成可用的base64串（例如image base64URL）。
- return {string} 生成的bese64码

举个例子

```js
var base64 = require('@jsmini/base64')

base64.encode('hello world')  // aGVsbG8gd29ybGQ=
```



## Base64.decode

Base64解析函数

根据bese64串解析出原始字符串

函数参数和返回值

- param {string} str 传入的base64串。传入其他类型参数会报错
- return {string} 生成的bese64码

举个例子

```js
var base64 = require('@jsmini/base64')

base64.decode('MTIz')  // 123

base64.decode('{ test: 'hello' }') // InvalidCharacterError
```

