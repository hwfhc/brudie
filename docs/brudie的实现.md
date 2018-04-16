## brudie的实现    

### 一、概要
brudie能通过一个配置文件定义出一个解释器，   
该解释器仅有前端部分（故之后说的解释器均指其前端部分），其运行性能并不好，因此不建议使用解释器处理过于庞大的代码（所幸我们的主要应用场景也不会涉及到过多代码）。   

解释器的主要处理过程主要分为三个：   
+ 词法分析（lexer）：   
将源码解析成一个token流。   
+ 语法分析：  
将token流解析为语法生成树，即AST
+ 解释：   
将AST树解析，运行代码（编译器将会生成中间代码，但是由于我们需要在浏览器环境运行，所以直接运行javascript代码）

### 二、词法分析    
想象在你的面前有一大坨代码，如何去处理他们？   
是的，我们首先使用词法分析来将代码拆分成单独的token，一种类似于单词的东西。   

**token:**   
在brudie的实现中，我们使用一个正则表达式来定义token的形式。虽然正则表达式在匹配无限重复的表达式时略显捉鸡，但是如果我们设置得当便可以规避这个问题。   

一个典型的token定义模式如下：   
```js
const str = new TokGen({
    MATCH: /^[a-zA-Z_]+/,
    type: 'ident',
    eval: function () {
        return this.value;
    }
});

const punc = new TokGen({
    MATCH: /^(##)/,
    type: 'punc',
    isStrictEqual: true,
    isHiddenInAST: true
});
```   
我们使用TokGen创建了一个名为str的新token生成器，   
其中，MATCH参数定义了str的正则表达式形式，即一个或任意个字母或下划线。需要注意的是最前方的^不能缺少，否则会造成匹配bug。   
type参数则定义了该token的类型名，这个参数主要在使用debugger调试时使用。   
eval暂时定义了该token的eval函数，此函数在解释时具有重要意义，我们在解释部分再详细讨论他。

**mode:**  
mode是token流的匹配模式，每次匹配都将遍历一次token列表，如果符合则输出相应token。这个方法虽然效率低下，但是目前来说暂时够用。   

下面是一个最简单的mode：   
```
const mode = new ModeGen({
    rule: {
        default: [punc, str]
    }
});
```
这里只有default列表(默认匹配列表，必须设置default)，即在对文本进行匹配时会生成punc和str两种token，若default值为[punc]，则只会生成punc一种token，遇到str时则会报错。  

然后将mode作为第一个参数传入getInterpreter方法即可。

### 三、语法分析
好了我们现在已经执行完了词法分析，得到了一个tokenStream类，即token流。   
但是现在仅仅是一个一个单词，我们还需要对其进行语法分析，才能得到有意义的语法树。    

而在brudie中我们需要先定义语法规则，然后根据语法规则自动生成相应的语法树，如果语法无法匹配则将报错。   

一个简单的语法规则定义方式如下：   
```js
var title = rule('title').add(punc('##')).add(str).setEval(
    function () {
        return `<h1>${this.getFirstChild().eval()}</h1>`;
    }
);
```  
首先我们调用rule函数创建一条新的语法规则，其名为title，即rule函数调用的参数（该参数主要在调试中使用）。   
好了，我们现在得到了一条语法规则，但是他目前还是空的，只有一个名字而已。  

所以我们再链式调用add方法，将token添加进这条语法规则。   
在这个例子中我们将punc和str两个token添加进了title语法规则。   

值得一提的是一个TokGen的实例，我们既可以把它作为参数直接调用add函数，也可以先将TokGen实例做为一个函数调用，即punc('##')。使用这种方法我们可以规定此处必须为值为##的punc类token才能成功匹配这条语法规则。    

另外，add方法的参数也可以是一个语法规则，即调用rule函数创建的对象。

当语法分析运行时，将递归向下匹配每条规则，如果无法匹配则报错，如果匹配成功则返回一个AST。   

如果当前匹配项是一个token，则读取tokenStream中下一个token，若匹配则将该token加入到AST中，否则可能抛出错误；如果当前匹配项是一个rule对象，即一个语法规则，则会将该语法规则展开，匹配该语法规则所需要的token，token匹配过程同上。   

如果匹配成功后则将返回语法生成树，即AST。

### 四、解释