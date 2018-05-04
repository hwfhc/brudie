const generator = require('../../src/index');
const {
    Token,
    ModeGen,
    rule,
    getInterpreter
} = generator;

const punc = new Token({
    MATCH: [
        '##'
    ],
    type: 'punc',
    isStrictEqual: true,
    isHiddenInAST: true
});
const str = new Token({
    MATCH: '[a-zA-Z_]',
    type: 'ident',
    eval: function () {
        return this.value;
    }
});

const mode = new ModeGen([
    {
        name: 'default',
        tokens: [punc, str]
    }
]);

// title : ## str
var title = rule('title').add(punc('##')).add(str).setEval(
    function () {
        return `<h1>${this.getFirstChild().eval()}</h1>`;
    }
);


module.exports = getInterpreter(mode,title);