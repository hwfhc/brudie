# brudie
## 介绍
这是一个通过设置定义文件自动生成简单解释器的项目。使用JavaScript编写。

## 安装
使用npm/yarn下载   
```$ npm install brudie```  
```$ yarn add brudie```

## 示例
以下是一个使用的简单例子：
```js
const brudie = require('brudie');
const { Token, ModeGen, rule, getInterpreter } = brudie;

const str = new Token({
    MATCH: '[a-zA-Z_]',
    type: 'ident',
    eval: function () {
        return this.value;
    }
});

const mode = new ModeGen([
    {
        name: 'default',
        tokens: [str]
    }
]);

var title = rule('title').add(str).setEval(
    function () {
        return `O|￣|O-${this.getFirstChild().eval()}-O|￣|O`;
    }
);

exec = getInterpreter(mode,title);

/*---------------------------------*/

(async function demo(){
    try{
        console.log(await exec("hello"));
    }catch(err){
        console.log(err);
    }
})();
```

运行结果为○|￣|O-hello-O|￣|O


我们通过Token函数来创建新的token类别。   

使用ModeGen可以创建一个新的有限状态机，用于词法分析。在不同的状态下拥有不同的token列表，从源码中分析出不同的token类型。   

然后我们调用rule函数来创建新的语法规则，并将token添加到该语法规则中。常量和变量类型的token均可添加。

利用rule函数创建的语法规则生成AST之后即可进行解释部分，执行js函数，输出文本或进行其他操作。

## 文档
+ [API documentation](docs/api.md)