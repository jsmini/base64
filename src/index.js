import { isString } from '@jsmini/is'

var padChar = '='
var StdEncoding = getEncodingMap('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/')
var URLEncoding = getEncodingMap('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_')

function encodeBinary(binary, opt) {
    opt = opt || {}
    var encoding = StdEncoding
    if (opt.useURL) {
        encoding = URLEncoding
    }
    var arr = []
    for (var i = 0; i < binary.length; i += 3) {
        arr.push.apply(arr, arr4to3(binary.slice(i, i + 3)))
    }
    arr = arr.map(function(i) {
        return encoding.encodeMap[i] || padChar
    })
    return arr.join('')
}

function arr4to3(arr) {
    // 4 * 6 => 3 * 8
    // 从3到0，因为3可能有变化
    var ret = []

    if (null == arr[2]) {
        ret[3] = 64
    } else {
        ret[3] = arr[2] & 0x3f
    }

    if (null == arr[1]) {
        ret[2] = 64
    } else {
        ret[2] = ((arr[1] & 0x0f) << 2) | (arr[2] >> 6)
    }

    ret[1] = ((arr[0] & 0x03) << 4) | (arr[1] >> 4)
    ret[0] = arr[0] >> 2 // 肯定有 arr[0]
    return ret
}

function arr3to4(arr) {
    // 3 * 8 => 4 * 6
    var ret = []

    if (null != arr[3]) {
        ret[2] = ((arr[2] & 0x03) << 6) + arr[3]
    }
    if (null != arr[2]) {
        ret[1] = ((arr[1] & 0x0f) << 4) + ((arr[2] & 0x3c) >> 2)
    }
    if (null != arr[1]) {
        ret[0] = (arr[0] << 2) + ((arr[1] & 0x30) >> 4)
    }

    return ret
}

function getEncodingMap(str) {
    var encodeMap = str2obj(str)
    var decodeMap = [].slice.call(encodeMap).reverse()
    return {
        encodeMap: encodeMap,
        decodeMap: decodeMap
    }
}

function str2obj(str) {
    var ret = {}
    for (var i = 0; i < str.length; i++) {
        ret[i] = str.charAt(i)
    }
    return ret
}

function isURLBase64(text) {
    return /[-_]/.test(text)
}

function _decode(str) {
    // copy from http://stackoverflow.com/questions/12518830/java-string-getbytesutf8-javascript-analog
    str = String(str)
    var charCode
    var byteCodes = []

    for (var i = 0; i < str.length; i++) {
        charCode = str.charCodeAt(i)
        if (charCode < 0x80) {
            byteCodes.push(charCode)
        } else if (charCode < 0x800) {
            byteCodes.push(0xc0 | (charCode >> 6), 0x80 | (charCode & 0x3f))
        } else if (charCode < 0xd800 || charCode >= 0xe000) {
            byteCodes.push(
                0xe0 | (charCode >> 12),
                0x80 | ((charCode >> 6) & 0x3f),
                0x80 | (charCode & 0x3f)
            )
        } else {
            // let's keep things simple and only handle chars up to U+FFFF...
            byteCodes.push(0xef, 0xbf, 0xbd) // U+FFFE 'replacement character'
        }
    }

    return byteCodes
}

function _encode(byteCodes) {
    // http://www.oschina.net/code/snippet_121125_19984 but it is wrong
    var arr = []
    var byteCode = 0
    var charCode = 0

    for (var i = 0; i < byteCodes.length; i++) {
        byteCode = byteCodes[i]
        if (byteCode > 0xe0) {
            // 224
            charCode = (byteCode & 0x0f) << 12
            byteCode = byteCodes[++i]
            charCode |= (byteCode & 0x3f) << 6
            byteCode = byteCodes[++i]
            charCode |= byteCode & 0x3f
        } else if (byteCode > 0xc0) {
            // 192
            charCode = (byteCode & 0x1f) << 6
            byteCode = byteCodes[++i]
            charCode |= (byteCode & 0x3f) << 6
        } else if (byteCode > 0x80) {
            // 128
            throw new Error('InvalidCharacterError')
        } else {
            // 0-128
            charCode = byteCode
        }
        arr.push(String.fromCharCode(charCode))
    }

    return arr.join('')
}

export function decode(text, opt) {
    opt = opt || {}
    var encoding = StdEncoding
    if (opt.useURL) {
        encoding = URLEncoding
    } else if (null == opt.useURL && isURLBase64(text)) {
        encoding = URLEncoding
    }
    text = text
        .replace(/\s+$/, '')
        .replace(/=+$/, '')
        .replace(/[\n\r]/g, '') // skip empty line
    var buf = text.split('').map(function(char) {
        return ~~encoding.decodeMap[char]
    })
    var arr = []
    for (var i = 0; i < buf.length; i += 4) {
        var bytes = arr3to4(buf.slice(i, i + 4))
        arr.push.apply(arr, bytes)
    }
    return _encode(arr)
}

export function encode(binary, opt) {
    if (isString(binary)) {
        binary = _decode(binary)
    }
    return encodeBinary(binary, opt)
}

export const btoa = encode
export const atob = encode
