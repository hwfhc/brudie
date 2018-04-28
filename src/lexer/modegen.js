const FSM = require('./fsm');

module.exports = ModeGen;

function ModeGen(option) {
    let config = option.map(item => {
        if (!item.name) throw Error(`Mode: name of state can not be null`);
        if (!Array.isArray(item.tokens) || item.tokens.length === 0) throw Error(`Mode: tokens of state can not be null`);

        let name = item.name;
        let tokens = item.tokens;
        let mutations = item.mutations || [];

        return {
            name, tokens, mutations
        }
    });

    return function () {
        let fsm = new FSM(config);
        this.getMatchList = () => { return fsm.getTokens() };

        this.update = token => { fsm.update(token) };
    }
}
