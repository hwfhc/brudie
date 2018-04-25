# brudie
---

## 介绍
---
这是一个通过设置定义文件自动生成简单解释器的项目。使用JavaScript编写。

## 如何使用
---
1. 使用npm/yarn下载module   
```$ npm install brudie```  
```$ yarn add brudie```
2. 使用brudie提供接口定义语法规则   
```js 
const brudie = require('brudie')
```
3. 获取解释器   
```js  
let exec = getInterpreter(mode,title)
```
4. 使用得到的解释器   
```js
try{
    console.log(await exec(code));
}catch(err){
    console.log(err);
}
```
或者   
```js
function promiseType(){
    exec(code).then(
        data => 
          console.log(data),
        err => 
          console.log(err));
}
```

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
        tokens: [str],
        transmit: []
    }
]);

var title = rule('title').add(str).setEval(
    function () {
        return `O|￣|O-${this.getFirstChild().eval()}-O|￣|O`;
    }
);

exec = getInterpreter(mode,title);

(async function demo(){
    try{
        console.log(await exec("hello"));
    }catch(err){
        console.log(err);
    }
})();
```

结果为○|￣|O-hello-O|￣|O