const exec = require('./spec')

var str = `## adfas
heiheihei**wawa**\`\`\`$%heihei哇
adf\`\`\`
+ **asdf**
+ zdsf**eaf**eff
`;

async function demo(){
    try{
        console.log(await exec(str));
    }catch(err){
        console.log(err);
    }
}

demo();