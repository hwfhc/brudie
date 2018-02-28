const AST = require('./ast');
const Repeat = require('./repeat');
const All = require('./all');
const Maybe = require('./maybe');
const Or = require('./or');

class Rule{
    constructor(tag){
        this.tag = tag;
        this.eval;

        this.list = [];
    }

    add(item){
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
        var list = this.list;
        var ast = new AST(this.tag,this.eval);

        for (var i = 0; i < list.length; i++) {
            var item = list[i];

            var result = item.match(tokenStream);

            if (isError(result))
                return result;

            addChildWithoutHidden(ast, result);
        }


        return ast;
    }

}

function addChildWithoutHidden(ast, newAst) {
    if (isAstOfRepeat(newAst)) {
        newAst.forEach(item => {
            if (!isHidden(item))
                ast.addChild(item);
        });
    }
    else {
        if (!isHidden(newAst))
            ast.addChild(newAst);
    }
}

function isError(obj) {
    return obj.__proto__ === Error.prototype;
}

function isHidden(tok){
    return tok.hidden === true;
}

function isAstOfRepeat(obj){
    return obj.__proto__ === Array.prototype;
}

module.exports = function(arg){
    return new Rule(arg);
}
