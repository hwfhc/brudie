const Token = require('./token');

class Sep extends Token{
    constructor(value){
        super(value);
    }

    match(tokenStream){
        var tok = tokenStream.peek();

        if(isValueEqual(this,tok) && isInheritedSep(tok)){
            tokenStream.next();
            return tok;
        }else{
            var errMessage = tok.value;

            if(tokenStream.peek(2))
                errMessage += tokenStream.peek(2).value;
            if(tokenStream.peek(3))
                errMessage += tokenStream.peek(3).value;

            return new Error(`not match in ${errMessage}`);
        }

    }
}

function isValueEqual(tok1,tok2){
    return tok1.value === tok2.value;
}

function isInheritedSep(tok){
    var tem = tok.__proto__;

    while(tem){
        if(tem.__proto__ === Sep.prototype)
            return true;
        tem = tem.__proto__
    }

    return false;
}

module.exports = Sep;
