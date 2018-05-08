## 目录
+ [getInterpreger](#getInterpreger)
+ [Token](#Token)
+ [ModeGen](#ModeGen)
+ [Rule](#Rule)

## getInterpreger
传入mode和最顶层语法规则，返回生成最终的解释器。
```
exec = getInterpreter(mode,rule);
```

## Token
Token用于定义一个新的token类型。   
使用方法如下：
```js
const punc = new Token({
    MATCH: [
       '##'
    ],
    type: 'punc',
    isStrictEqual: true,
    hidden: true
});
const str = new Token({
    MATCH: '[a-zA-Z_]',
    type: 'ident',
    eval: function () {
        return this.value;
    }
});
```

### MATCH：
使用正则表达式定义token的格式。

### type： 
定义token的类型名，主要用于调试debug。

### hidden：
为真时该token将在最终生成的语法树中隐藏。

### isStrictEqual：  
指示token在语法分析中的匹配方式。
+ true：必须值相等，如tokenStream中的value必须与定义语法中的token value相等。
+ false：只需要token类型相同。

### eval：
解释运行时需要调用的函数，对该token进行求值操作时则会运行这个函数。

## ModeGen
ModeGen用于定义词法分析器。该词法分析器表现为一个有限状态机，可以生成token流。   
使用方法如下：
```js
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
```

### name：
状态的名称，用于状态间的切换。其中default名称必须设定，作为初始状态。

### tokens：
该状态下token的列表。  
词法分析时会依次检测列表中的token是否符合代码，若符合则提取出该token，并将其加入到token流中。

### mutations：
状态机的状态转换规则。   
如果下一个token的值为规则中指定的token，则进入名称为target的状态。
可同时给同一状态指定多个转换规则。

## Rule
用于定义语法规则，使用方法如下：
```js   
// title : ## str
var title = Rule('title').add(punc('##')).add(str).setEval(
    function () {
        return `<h1>${this.getFirstChild().eval()}</h1>`;
    }
);
```

### add：
在语法规则中添加一个新的token，语法分析时需要依次匹配。    
其中 isStrictEqual 为false的token只需要直接传入，代表匹配同一类型的token。   
而 isStrictEqual 为true的token则需要传入一个常量作为参数，代表值为该常量的同类型token才能被匹配。

### setEval：
设置语法规则在解释时的回调函数。   
将该规则匹配的语法生成树节点作为this传入，可通过getChild等函数获取其子节点，取值处理后返回。