const generator = require('../../src/index');
const {
    TokGen,
    ModeGen,
    rule,
    getInterpreter,
    ENV
} = generator;

const punc = new TokGen({
    MATCH: /^(##)/,
    type: 'punc',
    isStrictEqual: true,
    isHiddenInAST: true
});
const str = new TokGen({
    MATCH: /^[a-zA-Z_]+/,
    type: 'ident',
    eval: function () {
        return this.value;
    }
});

/*const mode = new ModeGen([
    {
        name: 'default',
        tokens: [punc, str, quo],
        transmit: [
            { token: '\`\`\`', target: 'inCode' }
        ]
    },
    {
        name: 'inCode',
        tokens: [quo, html],
        transmit: [
            { token: '\`\`\`', target: 'default' }
        ]
    }
]);*/
const mode = new ModeGen([
    {
        name: 'default',
        tokens: [punc, str],
        transmit: []
    }
]);

// title : ## str
var title = rule('title').add(punc('##')).add(str).setEval(
    function () {
        return `<h1>${this.getFirstChild().eval()}</h1>`;
    }
);


module.exports = getInterpreter(mode,title);