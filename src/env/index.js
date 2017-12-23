const call = require('./call');
const scope = require('./scope');

module.exports = {
    call,getScope
};

function getScope(){
    return scope;
}
