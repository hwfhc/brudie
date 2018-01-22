# drypot-interpreter
---

## 介绍
---
这是一个通过设置定义文件自动生成简单解释器的项目。使用JavaScript编写。

以下是一个使用的例子： 
```
const generator = require('../../src/index');
const {
    TokGen,
    ModeGen,
    rule,
    getInterpreter,
    ENV
} = generator;

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

const mode = new ModeGen({
    switch: function (char) {
    },
    rule: [
        [punc, str]
    ]
});

// title : ## str
var title = rule('title').add(punc('##')).add(str).setEval(
    function () {
        return `<h1>${this.getFirstChild().eval()}</h1>`;
    }
);


module.exports = getInterpreter(mode,title);
```

## TokGen
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

## ModeGen
---
ModeGen用于创建token匹配模式，使用方法如下：
```js
const mode = new ModeGen({
    switch: function (char) {
        if (char === '{{')
            this.list = this.rule[2];


        if (char === '}}')
            this.list = this.rule[0];

        if (char === '`') {
            if (this.list === this.rule[1])
                this.list = this.rule[2];
            else
                this.list = this.rule[1];
        }

    },
    rule: [
        [html, code],//outCode
        [html, quo],//inStr
        [num, ident, quo, punc, code]//outStr
    ]
});
```

**switch：**  
token匹配模式切换函数，传入下一个token的值，若符合一定条件则可切换匹配模式。

**rule：**
用于存储多个token匹配模式的数组。
## tokenStream
---
创建token流，使用方法如下：
```js
var ts = new tokenStream(code,mode);
```
**code：**   
要解析的代码。

**mode：**  
token匹配模式，ModeGen的实例。

## rule
---
定义语法规则，使用方法如下
```js
// str : '`' html '`' 
var str = rule('str').add(sep('`')).add(html).add(sep('`')).setEval(
    function () {
        return this.getFirstChild().eval();
    }
);
```


## ENV
---
运行环境，使用方法如下：
```js
ENV.call(func, args);
ENV.getScope();
```

**call:**  
调用函数
+ func：函数名
+ args：参数

**getScope：**  
获取作用域
