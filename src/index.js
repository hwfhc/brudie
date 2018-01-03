const ENV = require('./env');

const rule = require('./parser/rule');

const tokenStream = require('./lexer/tokenStream');
const TokGen = require('./lexer/tokGen');
const ModeGen = require('./lexer/modeGen');


module.exports = {
    ENV,rule,tokenStream,TokGen,ModeGen
}