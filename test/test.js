//test environment init
const expect = require('chai').expect;
const exec = require('../examples/simple/spec')

describe('simple', function () {
    it('test1', function (done) {
        exec('##test').then(
            data => {
                expect(data).to.be.equal('<h1>test</h1>');
                done();
            },
            err => { throw err }
        )
    });
    it('test2', function (done) {
        exec('##__A').then(
            data => {
                expect(data).to.be.equal('<h1>__A</h1>');
                done();
            },
            err => { throw err }
        )
    });
});