const isError = require('iserror');

const ENV = require('./env');

const Rule = require('./parser/rule');

const tokenStream = require('./lexer/tokenStream');
const Token = require('./lexer/token');
const ModeGen = require('./lexer/modegen');

function getInterpreter(mode, grammar,isDebug) {
    return code => {
        return new Promise(async (resolve,reject) => {
            var ts = new tokenStream(code, mode);

            if (isError(ts)) {
                reject(ts);
                return;
            } else if (isDebug) throw ts;

            var ast = grammar.match(ts);

            if (isError(ast)) {
                reject(ast);
                return;
            }else if(isDebug) throw ast;

            try {
                resolve(await ast.eval());
            }catch(err){
                reject(err);
            }
        });
    };

}

module.exports = {
    ENV, Rule, Token, ModeGen, getInterpreter
};
