class Or{
    constructor(branch){
        /*
         * the first branch has the biggest priority
         */
        this.branch = branch;
    }

    match(tokenStream){
        var ast = new Error('not match in ',this);

        this.branch.forEach(item => {
            var rollbackPoint = tokenStream.createRollbackPoint();
            var result =  item.match(tokenStream);

            if(isError(result))
                tokenStream.rollback(rollbackPoint);
            else
                ast = result;
        });

        return ast;
    }
}

function isError(obj){
    return obj.__proto__ === Error.prototype;
}

module.exports = Or;
