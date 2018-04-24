const FSM = require('./fsm');

module.exports = ModeGen;

function ModeGen(config) {
    return function () {
        let fsm = new FSM(config);
        this.getMatchList = () => { return fsm.getTokens() };

        this.update = token => { fsm.update(token) };
        this.isState = isState;
    }
}

function isState (state) {
    return this.list === this.rule[state];
}
