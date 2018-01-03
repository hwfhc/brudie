class TokenStream {
    constructor(code, mode) {
        this.index = -1;

        var result = scan(code, mode);

        if (isError(result))
            return result;

        this.stream = result;
    }

    next(){
        this.index++;
        return this.stream[this.index];
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

function scan(str,Mode){
    var stream = [];
    var mode = new Mode();

    while(str.length > 0){
        var result = getOneToken();

        if(!result){
            return new Error(`Unexpected token \'${str}\'`);
        }

        stream.push(result);
    }

    return stream;

    function getOneToken(){
        for(var i=0;i<mode.getMatchList().length;i++){
            var item = mode.getMatchList()[i];
            var result = str.match(item.MATCH);

            if(!result)
                continue;

            mode.switchMatchList(result[0]);

            str = str.substr(result[0].length);
            return new item(result[0]);
        }
    }

}

function isError(obj){
    return obj.__proto__ === Error.prototype;
}


module.exports = TokenStream;
