module.exports = call;

function call(func,arg){
    return func.call(this,arg);
}
