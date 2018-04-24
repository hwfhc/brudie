const isError = require('iserror');

// line number and location number for debug message
var line = 1;
var loc = 1;

class TokenStream {
    constructor(code, mode) {
        this.index = -1;

        var result = scan(code, mode);

        if (isError(result))
            return result;

        this.stream = result;
    }

    next() {
        this.index++;

        var tok = this.stream[this.index];
        loc++;

        if (tok.value === "\n"){
            line++;
            loc = 1;
        }

        return tok;
    }


    getLine(){
        return line;
    }

    getLoc(){
        return loc;
    }

    isNull() {
        return this.index === (this.stream.length - 1);
    }


    peek(i=1){
      return this.stream[this.index+i];
    }

    createRollbackPoint(){
        return {
            index: this.index
        }
    }

    rollback(point){
        this.index = point.index;
    }
}

function scan(str, Mode) {
    var stream = [];
    var mode = new Mode();

    while (str.length > 0) {
        var { tok, str } = getOneToken(str, mode);

        if (!tok)
            return new Error(`Unexpected token \'${str.replace('\n', '\\n')}\'`);

        stream.push(tok);
    }

    return stream;
}

function getOneToken(str,mode) {
    for (var i = 0; i < mode.getMatchList().length; i++) {
        var item = mode.getMatchList()[i];
        var {str,tokStr} = item.MATCH(str);

        if (!tokStr)
            continue;

        mode.update(tokStr);
        return { tok: new item(tokStr), str };
    }
}

module.exports = TokenStream;
