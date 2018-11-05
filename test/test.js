var expect = require('expect.js');

var base64 = require('../dist/index.js');


console.log(base64.encode('12312312'))
describe('单元测试', function() {
    this.timeout(1000);

    describe('功能1', function() {
        it('相等', function() {
            expect(base.name).to.equal('base');
        });
    });

});
