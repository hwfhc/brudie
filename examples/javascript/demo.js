/*const generator = require('../../src/index');

const ENV = generator.ENV;

const rule = generator.rule;
const tokenStream = generator.tokenStream;
const ModeGen = generator.ModeGen;
*/

const TokGen = require('../../src/index.js').TokGen;

const ident = new TokGen({
    MATCH: /^[a-zA-Z_]+/,
    eval: function(){

    }
});
const sep = new TokGen({ 
    MATCH: /^[^(`|{{|}})]+/,
    isStrictEqual: true
});
const quo = new TokGen({
    MATCH: /^[^(`|{{|}})]+/,
    isStrictEqual: true,
    inherit: sep
});

/*
const mode = new ModeGen({
    switch: function (char) {
        if (char === '{{')
            this.list = outStr;


        if (char === '}}')
            this.list = outCode;

        if (char === '`') {
            if (this.list === inStr)
                this.list = outStr;
            else
                this.list = inStr;
        }

    },
    rule: [
        [html, code],
        [html, quo],
        [num, ident, quo, punc, code]
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
var call = rule('call').add(ident).add(sep('(')).ast(arg).repeat([sep(','),arg]).add(sep(')')).setEval(
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

*/