const Token = require('./token');

class Num extends Token{
    constructor(value){
        super(value);
    }
}

Num.MATCH = /^[0-9]+/;

module.exports = Num;
