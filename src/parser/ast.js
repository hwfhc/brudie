class AST{
    constructor(type,evaluate){
        this.type = type;
        this.eval = evaluate;

        this.children = [];
    }

    addChild(child){
        this.children.push(child);
    }

    getChild(index){
        return this.children[index];
    }

    getChildren(){
        return this.children
    }

    getFirstChild(){
        return this.children[0];
    }

    getNumberOfChild(){
        return this.children.length;
    }
}

module.exports = AST;
