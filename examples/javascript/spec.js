const generator = require('../../src/index');

const ENV = generator.ENV;

const rule = generator.rule;
const tokenStream = generator.tokenStream;

const Ident = generator.Ident;
const Punc = generator.Punc;
const Num = generator.Num;
const Sep = generator.Sep;
const Html = generator.Html;

var ident = new Ident();
var num = new Num();
var html = new Html();

// dot : ident {'.' ident} 
var dot = rule('dot').ast(ident).repeat([sep('.'), ident]).setEval(
    function () {
        var arr = [];

        for (var i = 0; i < this.getNumberOfChild(); i++)
            arr.push(this.getChild(i).value);

        return ENV.getScope().get(arr);
    }
);

// str : '`' html '`' 
var str = rule('str').sep('`').ast(html).sep('`').setEval(
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
var call = rule('call').ast(ident).sep('(').ast(arg).repeat([sep(','),arg]).sep(')').setEval(
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
var stmt = rule('stmt').maybe([html]).sep('{{').or([call, dot]).sep('}}').maybe([html]).setEval(
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


function sep(value){
    return new Sep(value);
}

module.exports = async function (code,callback){
    var ts = new tokenStream(code);

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
