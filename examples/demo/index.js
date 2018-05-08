const brudie = require('../../src/index.js');
const { Token, ModeGen, Rule, getInterpreter } = brudie;

const str = new Token({
    MATCH: '[a-zA-Z_]',
    type: 'ident',
    eval: function () {
        return this.value;
    }
});

const mode = new ModeGen([
    {
        name: 'default',
        tokens: [str],
        transmit: []
    }
]);

var title = Rule('title').add(str).setEval(
    function () {
        return `O|￣|O-${this.getFirstChild().eval()}-O|￣|O`;
    }
);

exec = getInterpreter(mode,title);

(async function demo(){
    try{
        console.log(await exec("hello"));
    }catch(err){
        console.log(err);
    }
})();
