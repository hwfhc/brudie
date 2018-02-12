class Or{
    constructor(branch){
        /*
         * the first branch has the biggest priority
         */
        this.branch = branch;
    }

    match(tokenStream) {
        var arr = this.branch;

        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            var rollbackPoint = tokenStream.createRollbackPoint();
            var result = item.match(tokenStream);

            if (!isError(result))
                return result;
            else
                tokenStream.rollback(rollbackPoint);
        }

        return new Error(formErrMessage(tokenStream));
    }
}

function isError(obj) {
    return obj.__proto__ === Error.prototype;
}

function formErrMessage(tokenStream) {
    var errMessage = '';

    if (tokenStream.peek())
        errMessage += tokenStream.peek().value;
    if (tokenStream.peek(2))
        errMessage += tokenStream.peek(2).value;
    if (tokenStream.peek(3))
        errMessage += tokenStream.peek(3).value;

    return `not match in: ${tokenStream.getIndex()} ${errMessage}`;
}

module.exports = Or;
