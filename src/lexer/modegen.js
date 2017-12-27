module.exports = ModeGen;

function ModeGen(config) {
    return function () {
        this.rule = config.rule;
        this.list = this.rule[0];

        this.switch = config.switch;
        this.getMatchList = () => { return this.list };
    }
}

function isStrStart(char) {
    var a = (char === '`');
    return a;
}