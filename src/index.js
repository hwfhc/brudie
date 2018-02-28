const ENV = require('./env');

const rule = require('./parser/rule');

const tokenStream = require('./lexer/tokenStream');
const TokGen = require('./lexer/tokGen');
const ModeGen = require('./lexer/modeGen');

function getInterpreter(mode, grammar) {

    return async function (code, callback) {
        var ts = new tokenStream(code, mode);

        if (isError(ts)) {
            callback(ts);
            return;
        }

        var ast = grammar.match(ts);

        if (isError(ast)) {
            callback(ast);
            return;
        }

        callback(null, await ast.eval());
    }

}

function isError(obj) {
    return obj.__proto__ === Error.prototype;
}

module.exports = {
    ENV, rule, TokGen, ModeGen, getInterpreter
}
