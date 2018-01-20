const generator = require('../../index');
const {
    TokGen,
    ModeGen,
    tokenStream,
    rule,
    ENV
} = generator;

const sep = new TokGen({
    MATCH: /^(\(|\)|,|\.)/,
    type: 'sep',
    isStrictEqual: true
});
const ident = new TokGen({
    MATCH: /^[a-zA-Z_]+/,
    type: 'ident',
    eval: function () {
        return this.value;
    }
});
const html = new TokGen({
    MATCH: /^[^(`|{{|}})]+/,
    type: 'html',
    eval: function () {
        return this.value;
    }
});
const num = new TokGen({
    MATCH: /^[0-9]+/,
    type: 'num',
    eval: function () {
        return this.value;
    }
});

const code = new TokGen({
    MATCH: /^({{|}})/,
    type: 'code',
    hidden: true,
    isStrictEqual: true,
});
const quo = new TokGen({
    MATCH: /^(`)/,
    type: 'quo',
    hidden: true,
    isStrictEqual: true,
});
const punc = new TokGen({
    MATCH: /^(\(|\)|,|\.)/,
    type: 'punc',
    hidden: true,
    isStrictEqual: true,
});


const mode = new ModeGen({
    switch: function (char) {
        if (char === '{{')
            this.list = this.rule[2];


        if (char === '}}')
            this.list = this.rule[0];

        if (char === '`') {
            if (this.list === this.rule[1])
                this.list = this.rule[2];
            else
                this.list = this.rule[1];
        }

    },
    rule: [
        [html, code],//outCode
        [html, quo],//inStr
        [num, ident, quo, punc, code]//outStr
    ]
});

// dot : ident {'.' ident} 
var dot = rule('dot').add(ident).repeat([sep('.'), ident]).setEval(
    function () {
        var arr = [];

        for (var i = 0; i < this.getNumberOfChild(); i++)
            arr.push(this.getChild(i).value);

        return ENV.getScope().get(arr);
    }
);

// str : '`' html '`' 
var str = rule('str').add(sep('`')).add(html).add(sep('`')).setEval(
    function () {
        return this.getFirstChild().eval();
    }
);

// arg : str | dot | num 
var arg = rule('arg').or([str, dot, num]).setEval(
    function () {
        return this.getFirstChild().eval();
    }
);

// call : ident '(' arg {',' arg} ')'
var call = rule('call').add(ident).add(sep('(')).add(arg).repeat([sep(','),arg]).add(sep(')')).setEval(
    function (){
        var func = this.getFirstChild().eval();
        var args = [];

        for (var i = 1; i < this.getNumberOfChild(); i++) {
            var item = this.getChild(i).eval();
            args.push(this.getChild(i).eval());

            if (isError(item))
                return item;
        }

        if (isError(func))
            return func;

        return ENV.call(func, args);
    }
);

// stmt : [html] '{{' call '}}' [html]
var stmt = rule('stmt').maybe([html]).add(sep('{{')).or([call, dot]).add(sep('}}')).maybe([html]).setEval(
    async function () {
        var str = '';

        for (var i = 0; i < this.getChildren().length; i++) {
            var result = await this.getChildren()[i].eval();

            if (isError(result))
                return result;

            str += result;
        }

        return str;
    }
);


module.exports = async function (code,callback){
    var ts = new tokenStream(code,mode);

    if(isError(ts)){
        callback(ts);
        return;
    }

    var ast =  stmt.match(ts);
    
    if(isError(ast)){
        callback(ast);
        return;
    }

    callback(null,await ast.eval());
}

function isError(obj){
    return obj.__proto__ === Error.prototype;
}
