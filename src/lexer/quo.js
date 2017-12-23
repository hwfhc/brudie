const Punc = require('./punc');

class Quo extends Punc{
    constructor(){
        super('`');
    }
}

Quo.MATCH = /^(`)/;

module.exports = Quo;
