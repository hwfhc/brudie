const exec = require('./spec')

var str = `## adfas
heiheihei**wawa**\`\`\`$%heihei哇   
adf\`\`\`
+ **asdf**
+ zdsf**eaf**eff
`;

exec(str, (err, data) => {
    if (err)
        console.log(err);
    else
        console.log(data);
});
