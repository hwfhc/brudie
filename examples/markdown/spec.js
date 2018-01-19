const generator = require('../../src/index');
const {
    TokGen,
    ModeGen,
    tokenStream,
    rule,
    ENV
} = generator;

const two = new TokGen({
    MATCH: /^(##)/,
    type: 'two',
    isStrictEqual: true,
    hidden: true
});
const ident = new TokGen({
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
        [two,ident]
    ]
});

// title : ## ident 
var title = rule('title').add(two('##')).add(ident).setEval(
function(){
        return `<h1>${this.getFirstChild().eval()}</h1>`;
    }
);

module.exports = async function (code,callback){
    var ts = new tokenStream(code,mode);

    if(isError(ts)){
        callback(ts);
        return;
    }

    var ast =  title.match(ts);
    
    if(isError(ast)){
        callback(ast);
        return;
    }

    callback(null,await ast.eval());
}

function isError(obj){
    return obj.__proto__ === Error.prototype;
}
