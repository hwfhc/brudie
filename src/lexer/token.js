class Token{
    constructor(value){
        this.value = value;
    }

    match(tokenStream){
        var tok = tokenStream.peek();
        if(!tok)
            return new Error(`no tok rest`);

        if(isSameToken(this,tok)){
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

    eval(){
        return this.value;
    }
}

function isSameToken(tok1,tok2){
    if(tok1.__proto__ === tok2.__proto__)
        return true;
    else
        return false;
}

module.exports = Token;
