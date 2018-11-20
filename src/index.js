const charMap = (() => {
    const mapStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    let encodingMap = {},
        decodingMap = {}
    for (let i = 0; i < mapStr.length; i++) {
        const el = mapStr[i]
        encodingMap[i] = el
        decodingMap[el] = i
    }
    return { encodingMap, decodingMap }
})()

const padZeroStart = function(str, tarNum) {
    let strLen = str.length
    for (let i = 0; i < tarNum - strLen; i++) {
        str = '0' + str
    }
    return str
}

export const encode = str => {
    if (typeof str === 'object' || typeof str === 'function') throw new Error('Invalid argument')

    str = String(str)
    let strBin = '',
        equalFix = ''
    for (let i = 0; i < str.length; i++) {
        strBin += padZeroStart(str[i].charCodeAt().toString(2), 8)
    }
    // 计算末尾余零
    if (strBin.length % 24 !== 0) {
        if ((strBin.length % 24) % 16 === 0) {
            strBin += '00'
            equalFix = '='
        } else if ((strBin.length % 24) % 8 === 0) {
            strBin += '0000'
            equalFix = '=='
        } else throw new SyntaxError('Binary parse error')
    }

    return (
        strBin
            .split(/(?=^(?:[01]{24})+)/g)
            .map(el => {
                const { encodingMap } = charMap
                return el
                    .split(/(?=(?:[01]{6})+$)/)
                    .map(el => encodingMap[Number.parseInt(el, 2)])
                    .join('')
            })
            .join('') + equalFix
    )
}

export const decode = base64Str => {
    if (typeof base64Str === 'object' || typeof base64Str === 'function')
        throw new Error('Invalid argument')
    base64Str = String(base64Str)
    const { decodingMap } = charMap
    let equalNum = 0,
        strBin = ''

    let b64rLength = base64Str.length
    // 判断长度
    if (b64rLength === 0) return ''
    if (b64rLength % 4 !== 0) throw new SyntaxError('Invalid base64 string')
    // 匹配末尾等号
    if (base64Str[b64rLength - 2] === '=') {
        equalNum = 2
        base64Str = base64Str.substring(0, b64rLength - 2)
    } else if (base64Str[b64rLength - 1] === '=') {
        equalNum = 1
        base64Str = base64Str.substring(0, b64rLength - 1)
    }

    // 转二进制串
    for (let i = 0; i < base64Str.length; i++) {
        const el = base64Str[i]
        let prevBin = padZeroStart(decodingMap[el].toString(2), 8)
            .substring(2)
        if (i === base64Str.length - 1) {
            strBin += prevBin.substring(0, 6 - equalNum * 2)
        } else {
            strBin += prevBin
        }
    }

    return String.fromCharCode.apply(
        null,
        strBin.split(/(?=(?:[01]{8})+$)/g).map(el => Number.parseInt(el, 2))
    )
}

export const atob = encode
export const btoa = decode
