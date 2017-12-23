const Token = require('./token');

class Html extends Token{
    constructor(value){
        super(value);
    }
}

Html.MATCH = /^[^(`|{{|}})]+/;

module.exports = Html;
