# drypot-interpreter
---

## 介绍
---
这是一个通过设置定义文件自动生成简单解释器的项目。使用JavaScript编写。

以下是一个使用的简单例子： 
```
// index.js
// 输入为##test，经过处理后结果为<h1>test</h1>
const exec = require('./spec')

exec('##test', (err,data) => {
    if(err)
        console.log(err);
    else
        console.log(data);
});
```
```
// sepc.js
const generator = require('../../src/index');
const {
    TokGen,
    ModeGen,
    rule,
    getInterpreter,
    ENV
} = generator;

/* 
 * token由TokGen函数生成，一个新的TokGen代表一种新的token。
 * 其下的punc变量和str变量分别为两个不同的token。
 * MATCH:为token的正则定义。
 * type:token的类型标识。
 * isStrictEqual:为true时代表在语法匹配时需要token的值相同，为false时只需要token类型相同(即为同一个TokGen制造)。
 * isHiddenInAST:为true时表示token在最终的语法生成树中会隐藏(例如逗号、括号等标点符号)，为false则不隐藏
 * eval:对token求值时运行的函数。如下面的str token返回自身的值，如果是一个该token设计为一个变量，则可调用相关接口从运* 行环境中读取相应的值。
 */
const punc = new TokGen({
    MATCH: /^(##)/,
    type: 'punc',
    isStrictEqual: true,
    isHiddenInAST: true
});
const str = new TokGen({
    MATCH: /^[a-zA-Z_]+/,
    type: 'ident',
    eval: function () {
        return this.value;
    }
});

/*
 * mode是token流的匹配模式。rule为多个匹配列表的集合，这里只有default列表(默认匹配列表，必须设置default)，即在对文本* 进行匹配时会生成punc和str两种token，若default值为[punc]，则只会生成punc一种token，遇到str时则会报错。
 */
const mode = new ModeGen({
    rule: {
        default: [punc, str]
    }
});

/*
 * rule是语法规则，通过链式调用来实现对语法规则的设定。
 * 其中rule('title')是创建一个新的语法规则，并起名为title规则。
 *
 * add(punc('##'))为在语法规则中添加一个新的匹配项punc('##')，这里的punc即是之前定义的punc变量，punc('##')生成了一个* 值为##的punc类token。
 * add(str)为在语法规则中添加新的匹配项str。
 * 因此这条语法规则能够匹配诸如"##hehe"、"##adafe"这样的语句。
 *
 * 最后的setEval是设置语法规则在解释时的处理函数，他调用了规则匹配出的语法树第一项的eval函数，获取了其值并在前后加上
 * <h1>与</h1>，并将此字符串返回，这就是我们最终得到的结果。
 */

// title : ## str
var title = rule('title').add(punc('##')).add(str).setEval(
    function () {
        return `<h1>${this.getFirstChild().eval()}</h1>`;
    }
);


// 此为对外接口，生成最终的解释器
module.exports = getInterpreter(mode,title);
```

## API


### TokGen
---
TokGen用于定义一个新的token，使用方法如下：
```js
const punc = new TokGen({
    MATCH: /^(##)/,
    type: 'punc',
    isStrictEqual: true,
    hidden: true
});
const str = new TokGen({
    MATCH: /^[a-zA-Z_]+/,
    type: 'ident',
    eval: function () {
        return this.value;
    }
});
```

**MATCH：**  
使用正则表达式定义token的格式。

**type：**   
定义token的类型名

**hidden：**
布尔值，决定token是否在生成语法树时隐藏。

**isStrictEqual：**  
布尔值，决定token在语法分析中的匹配模式
+ true：必须值相等，如tokenStream中的value必须与定义语法中的token value相等。
+ false：只需要token类型相同。

**eval：**  
解释运行时需要调用的函数。

### ModeGen
---
ModeGen用于创建token匹配模式，使用方法如下：
```js
const mode = new ModeGen({
    switch: function (char) {
    },
    rule: [
        [punc, str]
    ]
});
```

**switch：**  
token匹配模式切换函数，传入下一个token的值，若符合一定条件则可切换匹配模式。

**rule：**   
用于存储多个token匹配模式的数组。

### rule
---
定义语法规则，使用方法如下：
```
// title : ## str
var title = rule('title').add(punc('##')).add(str).setEval(
    function () {
        return `<h1>${this.getFirstChild().eval()}</h1>`;
    }
);
```

调用rule函数生成语法规则，使用add函数给语法规则添加token，使用setEval函数设置语句的求值函数
