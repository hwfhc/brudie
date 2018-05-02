const AST = require('./ast');
const Repeat = require('./repeat');
const All = require('./all');
const Maybe = require('./maybe');
const Or = require('./or');

const isError = require('iserror');

class Rule{
    constructor(type){
        this.type = type;
        this.eval;

        this.list = [];

        this._isRule = true;
    }

    add(item){
        if (!item) throw Error('argument of rule\'s add function can not be undefined');
        if (!item._isRule) {
            if (!item._isTok) throw Error(`${item.type}: argument of rule's add function must be a token or a rule`);
            if (item._isHidden() && item._isValueNull()) throw Error(`${item.type}: token's value, which hides in ast, can not be null`);
        }

        this.list.push(item);

        return this;
    }

    or(...arg){
        this.list.push(new Or(arg));

        return this;
    }

    repeat(...arg){
        this.list.push(new Repeat(arg));

        return this;
    }

    all(...arg) {
        this.list.push(new All(arg));

        return this;
    }

    maybe(...arg){
        this.list.push(new Maybe(arg));

        return this;
    }

    setEval(evalFunc){
        this.eval = evalFunc;

        return this;
    }

    match(tokenStream){
        return matchGrammarRule(this.type,this.eval,this.list,tokenStream);
    }

}

function matchGrammarRule(type, evalucation, list, tokenStream) {
    var ast = new AST(type, evalucation);

    for (var i = 0, len = list.length; i < len; i++) {
        var item = list[i];

        var result = item.match(tokenStream);

        if (isError(result))
            return result;

        ast = addChildWithoutHidden(ast, result);
    }

    return ast;
}

function addChildWithoutHidden(ast, newAst) {
    if (isAstOfRepeat(newAst))
        newAst.forEach(item => { if (!isHidden(item)) ast.addChild(item); });
    else if (!isHidden(newAst))
        ast.addChild(newAst);
    
    return ast;
}

function isHidden(tok){
    return tok.hidden === true;
}

function isAstOfRepeat(obj){
    return Array.isArray(obj);
}

module.exports = function(arg){
    return new Rule(arg);
};
