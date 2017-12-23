const Sep = require('./sep');

class Punc extends Sep{
    constructor(value){
        super(value);
    }
}

Punc.MATCH = /^(\(|\)|,|\.)/;

module.exports = Punc;
