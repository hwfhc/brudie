module.exports = generator;

function generator(config) {
    var MATCH = config.MATCH;
    var eval = config.eval;
    var isStrictEqual = config.isStrictEqual;

    // create constructor
    var tok = function (value) {
        var obj = {};

        obj.MATCH = MATCH;
        obj.value = value;

        return obj;
    }

    // add properties of constructor
    tok.MATCH = MATCH;

    var proto = { eval, match };
    tok.prototype = proto;

    return tok;
}

function match(tokenStream) {
    var tok = tokenStream.peek();
    if (!tok)
        return new Error(`no tok rest`);

    if (isSameToken(this, tok)) {
        tokenStream.next();
        return tok;
    } else {
        var errMessage = tok.value;

        if (tokenStream.peek(2))
            errMessage += tokenStream.peek(2).value;
        if (tokenStream.peek(3))
            errMessage += tokenStream.peek(3).value;

        return new Error(`not match in ${errMessage}`);
    }

}

function isSameToken(tok1,tok2){
    if(tok1.__proto__ === tok2.__proto__)
        return true;
    else
        return false;
}