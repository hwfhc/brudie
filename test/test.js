//test environment init
const expect = require('chai').expect;

describe('simple', function () {
    const exec = require('../examples/simple/spec');

    it('test1', function (done) {
        exec('##test').then(
            data => {
                expect(data).to.be.equal('<h1>test</h1>');
                done();
            },
            err => { throw err; }
        );
    });
    it('test2', function (done) {
        exec('##__A').then(
            data => {
                expect(data).to.be.equal('<h1>__A</h1>');
                done();
            },
            err => { throw err; }
        );
    });
});

describe('markdown', function () {
    const exec = require('../examples/markdown/spec');

    var str = `## adfas
heiheihei**wawa**\`\`\`$%heihei哇
adf\`\`\`
+ **asdf**
+ zdsf**eaf**eff
`;

    it('test1', function (done) {
        exec(str).then(
            data => {
                expect(data).to.be.equal(
                    '<h1>adfas</h1>heiheihei<b>wawa</b><code>$%heihei哇\n'+
                    'adf</code><ul><li><b>asdf</b></li><li>zdsf<b>eaf</b>eff</li></ul>');
                done();
            },
            err => { throw err; }
        );
    });
});