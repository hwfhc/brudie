const isError = require('iserror');

class All {
    /*
     * repeat forever until there are no token in the stream  
     *
     */
    constructor(list) {
        this.list = list;
    }

    match(tokenStream) {
        var astArr = [];

        while (!tokenStream.isNull()) {
            var result = matchOnce(this.list, tokenStream);

            if (!isError(result))
                insertAtLastOfArr(astArr, result);
            else
                return result;
        }

        return astArr;
    }
}

function matchOnce(list, tokenStream) {
    var rollbackPoint = tokenStream.createRollbackPoint();
    var arrOfResult = [];

    for (var i = 0; i < list.length; i++) {
        var result = list[i].match(tokenStream);

        if (isError(result)) {
            tokenStream.rollback(rollbackPoint);
            return result;
        } else
            arrOfResult.push(result);
    }

    return arrOfResult;
}


function insertAtLastOfArr(main, arr) {
    for (var i = 0; i < arr.length; i++)
        main.push(arr[i]);
}

module.exports = All;
