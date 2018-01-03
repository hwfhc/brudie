module.exports = ModeGen;

function ModeGen(config) {
    return function () {
        // the array of all match list
        this.rule = config.rule;

        // the current match list
        this.list = this.rule[0];

        // the rule of change match list
        this.switchMatchList = config.switch;

        this.getMatchList = () => { return this.list };
    }
}
