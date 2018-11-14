var expect = require('expect.js')

var base64 = require('../dist/index.js')

describe('单元测试', function() {
    this.timeout(1000)

    describe('encode测试', function() {
        it('数字', function() {
            expect(base64.encode('123')).to.equal('MTIz')
        })
        it('字符串', function() {
            expect(base64.encode('hello world')).to.equal('aGVsbG8gd29ybGQ=')
        })
        it('空', function() {
            expect(base64.encode('')).to.equal('')
        })
    })
    describe('decode测试', function() {
        it('数字', function() {
            expect(base64.encode('MTIz')).to.equal('123')
        })
        it('字符串', function() {
            expect(base64.encode('aGVsbG8gd29ybGQ=')).to.equal('hello world')
        })
        it('空', function() {
            expect(base64.encode('')).to.equal('')
        })
    })
})
