const isError = require('iserror');

class Or{
    constructor(branch){
        /*
         * the first branch has the biggest priority
         */
        this.branch = branch;
    }

    match(tokenStream) {
        let arr = this.branch;

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

function formErrMessage(tokenStream) {
    if (tokenStream.peek(0))
        var errMessage = tokenStream.peek(0).value;

    errMessage += tokenStream.peek().value;

    if (tokenStream.peek(2))
        errMessage += tokenStream.peek(2).value;
    if (tokenStream.peek(3))
        errMessage += tokenStream.peek(3).value;
        
    return `not match Error: "${errMessage.replace('\n', '\\n')}"
    at ${tokenStream.getLine()} : ${tokenStream.getLoc()}`;
}

module.exports = Or;
