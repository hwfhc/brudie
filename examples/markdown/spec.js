const generator = require('../../src/index');
const {
    Token,
    ModeGen,
    Rule,
    getInterpreter
} = generator;

/*
 * token
 */

const punc = new Token({
    MATCH: [
        '##','**','+','\s','\n'
    ],
    type: 'punc',
    isStrictEqual: true,
    isHiddenInAST: true
});
const quo = new Token({
    MATCH: [
        '```'
    ],
    type: 'quo',
    isStrictEqual: true,
    isHiddenInAST: true
});
const str = new Token({
    MATCH: '[a-zA-Z_]',
    type: 'str',
    eval: function () {
        return this.value;
    }
});
const html = new Token({
    MATCH: '[^(```)]',
    type: 'html',
    eval: function () {
        return this.value;
    }
});

const mode = new ModeGen([
    {
        name: 'default',
        tokens: [punc, str, quo],
        mutations: [
            { token: '```', target: 'inCode' }
        ]
    },
    {
        name: 'inCode',
        tokens: [quo, html],
        mutations: [
            { token: '```', target: 'default' }
        ]
    }
]);

/* 
 * inline
 */
 
var black = Rule('black').add(punc('**')).add(str).add(punc('**')).setEval(
    function () {
        return `<b>${this.getFirstChild().eval()}</b>`;
    }
);

var code = Rule('code').add(punc('```')).add(html).add(punc('```')).setEval(
    function () {
        return `<code>${this.getFirstChild().eval()}</code>`;
    }
);

var inline = Rule('inline').or(black, code, str).setEval(
    function () {
        return `${this.getFirstChild().eval()}`;
    }
);



/*
 * block
 */

// title : ## str
var title = Rule('title').add(punc('##')).add(punc(' ')).add(str).add(punc('\n')).setEval(
    function () {
        return `<h1>${this.getFirstChild().eval()}</h1>`;
    }
);

var para = Rule('para').repeat(inline).add(punc('\n')).setEval(
    function () {
        var str = '';
        var arr = this.getChildren();

        arr.forEach((item) => {
            str += item.eval();
        });

        return str;
    }
);

var item = Rule('item').add(punc('+')).add(punc(' ')).repeat(inline).setEval(
    function () {
        var str = '';
        var arr = this.getChildren();

        arr.forEach((item) => {
            str += item.eval();
        });

        return `<li>${str}</li>`;
    }
);

var list = Rule('list').add(item).add(punc('\n')).repeat(item, punc('\n')).setEval(
    function () {
        var str = '';
        var arr = this.getChildren();

        arr.forEach((item) => {
            str += `${item.eval()}`;
        });

        return `<ul>${str}</ul>`;
    }
);

var stmt = Rule('stmt').or(list,title,para).setEval(
    function () {
        return `${this.getFirstChild().eval()}`;
    }
);

var text = Rule('text').all(stmt).setEval(
    function () {
        var str = '';
        var arr = this.getChildren();

        arr.forEach((item)=>{
            str += item.eval();
        });

        return str;
    }
);

module.exports = getInterpreter(mode,text);
