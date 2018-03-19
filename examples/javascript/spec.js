const generator = require('../../src/index');
const {
    TokGen,
    ModeGen,
    rule,
    getInterpreter,
    ENV
} = generator;

const punc = new TokGen({
    MATCH: /^(=)/,
    type: 'punc',
    isStrictEqual: true,
    isHiddenInAST: true
});
const ident = new TokGen({
    MATCH: /^[a-zA-Z_]+/,
    type: 'ident',
    eval: function () {
        return this.value;
    }
});

const mode = new ModeGen({
    rule: {
        default: [ident, punc]
    }
});

// assign : ident = ident
var assign = rule('assign').add(ident).add(punc('=')).add(ident).setEval(
    function () {
        var arr = this.getChildren();
        var str = `${arr[0].eval()} is assign to ${arr[1].eval()}`;

        return str;
    }
);
// line : ident punc ident
var line = rule('line').add(assign).setEval(
    function () {
        return `${this.getFirstChild().eval()}`;
    }
);


module.exports = getInterpreter(mode,line);