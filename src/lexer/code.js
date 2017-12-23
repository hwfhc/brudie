const Sep = require('./sep');

class Code extends Sep{
    constructor(value){
        super(value);
    }
}

Code.MATCH = /^({{|}})/;

module.exports = Code;
