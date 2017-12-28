module.exports = generator;

function generator(config) {
    // read properties of config
    var MATCH = config.MATCH;
    var type = config.type;
    var eval = config.eval;
    var isStrictEqual = config.isStrictEqual;
    var inherit = config.inherit;
    var hidden = config.hidden;

    var proto = { eval, MATCH };

    // create constructor
    var tok = function (value) {
        var obj = {};

        obj.type = type;
        obj.value = value;
        obj.inherit = inherit;
        obj.hidden = hidden;

        obj.__proto__ = proto;

        return obj;
    }

    // add properties of constructor
    tok.MATCH = MATCH;
    tok.inherit = inherit;

    if (isStrictEqual){
        proto.match = matchStrict;
        tok.match = matchStrict;
    }
    else{
        proto.match = match;
        tok.match = match;
    }

    proto.__proto__ = inherit;
    tok.prototype = proto;
    tok.__proto__ = proto;

    return tok;


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
    function matchStrict(tokenStream) {
        var tok = tokenStream.peek();

        if (isValueEqual(this, tok) /*&& isInheritedSep(this.inherit,tok)*/) {
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
    function isSameToken(tok1, tok2) {
        if (tok1.__proto__ === tok2.__proto__)
            return true;
        else
            return false;
    }
    function isValueEqual(tok1, tok2) {
        return tok1.value === tok2.value;
    }

    function isInheritedSep(inherit,tok) {
        var tem = tok.__proto__;

        while (tem) {
            if (tem.__proto__ === inherit)
                return true;
            tem = tem.__proto__
        }

        return false;
    }

}

