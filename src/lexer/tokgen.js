module.exports = generator;

function generator(config) {
    // read properties of config
    var MATCH = config.MATCH;
    var type = config.type;
    var evalFunc = config.eval;
    var isStrictEqual = config.isStrictEqual;
    var hidden = config.isHiddenInAST;

    if(!hidden && !evalFunc) throw Error(`token ${type}: isHiddenInAST and eval can not be undefined simultaneously`);

    // create prototype of token constructor
    var proto = { eval: evalFunc, MATCH };

    // create token constructor
    var tok = function (value) {
        var obj = {};

        obj.type = type;
        obj.value = value;
        obj.hidden = hidden;

        obj.__proto__ = proto;

        return obj;
    }

    // add properties of constructor
    tok.MATCH = MATCH;
    tok.match = isStrictEqual? matchValueEqual : matchTokTypeEqual;
    proto.match = tok.match;

    // set prototype
    tok.prototype = proto;
    tok.__proto__ = proto;

    return tok;
}

function matchTokTypeEqual(tokenStream) {
    var tok = tokenStream.peek();

    if(!tok)
        return new Error(`no tok in tokenStream`);

    if (isSameToken(this, tok)) {
        tokenStream.next();
        return tok;
    } else {
        return new Error(formErrMessage(tokenStream));
    }

}
function matchValueEqual(tokenStream) {
    var tok = tokenStream.peek();

    if(!tok)
        return new Error(`no tok in tokenStream`);

    if (isValueEqual(this, tok)) {
        tokenStream.next();
        return tok;
    } else {
        return new Error(formErrMessage(tokenStream));
    }

}
function isSameToken(tok1, tok2) {
    if (tok1.__proto__ === tok2.__proto__)
        return true;
    else
        return false;
}

function isValueEqual(RuleTok, StreamTok) {
    return RuleTok.value === StreamTok.value;
}

function formErrMessage(tokenStream) {
    var errMessage = tokenStream.peek(0).value;
    errMessage += tokenStream.peek().value;

    if (tokenStream.peek(2))
        errMessage += tokenStream.peek(2).value;
    if (tokenStream.peek(3))
        errMessage += tokenStream.peek(3).value;
        
    return `not match Error: "${errMessage}"
    at ${tokenStream.getLine()} : ${tokenStream.getLoc()}`;
}

