class FSM{
    constructor(graph){
        let symbols = []

        this.machine = {};

        graph.forEach(state => {
            symbols[state.name] = Symbol(state.name);
        });

        graph.forEach(state => {
            let tokens = [...state.tokens];
            let symbol = symbols[state.name];

            let rule = state.mutations.map(item => {
                let { token, target } = item;

                return {
                    token,
                    target: symbols[item.target]
                };
            });

            this.machine[symbol] = { tokens, rule };
        });

        this.state = symbols['default'];
    }

    getState(){
        return this.state;
    }
    getTokens() {
        return this.machine[this.state].tokens;
    }
    update(token) {
        let now = this.machine[this.state];

        now.rule.forEach(item => {
            if(item.token === token) this.state = item.target;
        });
    }
}

module.exports = FSM;