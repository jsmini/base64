const charMap = (() => {
    let mapStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    let encodingMap = new Map(),
        decodingMap = new Map()
    for (let i = 0; i < mapStr.length; i++) {
      const el = mapStr[i]
      encodingMap.set(i, el)
      decodingMap.set(el, i)
    }
    return { encodingMap, decodingMap }
})()

const atob = str => {
  str = String(str)
  let strBin = '',
      equalFix = ''
  for (let i = 0; i < str.length; i++) {
    strBin += str[i]
      .charCodeAt()
      .toString(2)
      .padStart(8, '0')
  }
  if (strBin.length % 24 !== 0) {
    if (strBin.length % 16 === 0) {
      strBin += '00'
      equalFix = '='
    } else if (strBin.length % 8 === 0) {
      strBin += '0000'
      equalFix = '=='
    } else throw new SyntaxError('Binary parse error')
  }

  return (
    strBin
      .split(/(?<=^(?:[01]{24})+)/g)
      .map(el => {
        const { encodingMap } = charMap
        return el
          .split(/(?=(?:[01]{6})+$)/)
          .map(el => encodingMap.get(Number.parseInt(el, 2)))
          .join('')
      })
      .join('') + equalFix
  )
}

const btoa = base64Str => {
  base64Str = String(base64Str)
}

console.log(atob('Ma'))
