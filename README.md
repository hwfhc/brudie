# brudie
## 介绍
这是一个通过设置定义文件自动生成简单解释器的项目。使用JavaScript编写。

## 安装
使用npm/yarn下载   
```$ npm install brudie```  
```$ yarn add brudie```

## 使用示例
以下是一个使用的简单例子：
```js
const brudie = require('brudie');
const { TokGen, ModeGen, rule, getInterpreter, ENV } = brudie;

const str = new TokGen({
    MATCH: /^[a-zA-Z_]+/,
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

结果为○|￣|O-hello-O|￣|O