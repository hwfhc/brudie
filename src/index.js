const ENV = require('./env');

const rule = require('./parser/rule');

const tokenStream = require('./lexer/tokenStream');
const TokGen = require('./lexer/tokgen');



module.exports = {
    ENV,rule,tokenStream,TokGen
}