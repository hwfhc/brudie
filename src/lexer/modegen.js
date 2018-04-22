const FSM = require('./fsm');

module.exports = ModeGen;

function ModeGen(config) {
    return function () {
        let fsm = new FSM(config);
        this.getMatchList = () => { return fsm.getTokens() };

        this.update = token => { fsm.update(token) };
        this.isState = isState;

        /*// the array of all match list
        this.rule = config.rule;

        // the current match list
        if (this.rule.default === undefined)
            throw new Error("Not set default rule of token match mode!");

        this.list = this.rule.default;

        // init interface for inter
        if (config.switch)
            this.switchMatchList = config.switch;
        else
            this.switchMatchList = () => { };

        this.getMatchList = () => { return this.list };*/
    }
}

function isState (state) {
    return this.list === this.rule[state];
}
