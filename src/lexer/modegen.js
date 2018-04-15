module.exports = ModeGen;

function ModeGen(config) {
    return function () {
        // the array of all match list
        this.rule = config.rule;

        // the current match list
        if (this.rule.default === undefined)
            throw new Error("Not set default rule of token match mode!");

        this.list = this.rule.default;

        // init interface for user 
        this.switch = function (state) {
            if (this.rule[state] === undefined)
                throw new Error(`Switch to a illegal state: to ${state}`);

            this.list = this.rule[state];
        }

        this.isState = isState;

        // init interface for inter
        if (config.switch)
            this.switchMatchList = config.switch;
        else
            this.switchMatchList = () => { };

        this.getMatchList = () => { return this.list };
    }
}

function isState (state) {
    return this.list === this.rule[state];
}
