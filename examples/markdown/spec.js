const generator = require('../../src/index');
const {
    TokGen,
    ModeGen,
    tokenStream,
    rule,
    ENV
} = generator;

const punc = new TokGen({
    MATCH: /^(##)/,
    type: 'punc',
    isStrictEqual: true,
    hidden: true
});
const str = new TokGen({
    MATCH: /^[a-zA-Z_]+/,
    type: 'ident',
    eval: function () {
        return this.value;
    }
});

const mode = new ModeGen({
    switch: function (char) {
    },
    rule: [
        [punc, str]
    ]
});

// title : ## str
var title = rule('title').add(punc('##')).add(str).setEval(
    function () {
        return `<h1>${this.getFirstChild().eval()}</h1>`;
    }
);

module.exports = async function (code, callback) {
    var ts = new tokenStream(code, mode);

    if (isError(ts)) {
        callback(ts);
        return;
    }

    var ast = title.match(ts);

    if (isError(ast)) {
        callback(ast);
        return;
    }

    callback(null, await ast.eval());
}

function isError(obj) {
    return obj.__proto__ === Error.prototype;
}
