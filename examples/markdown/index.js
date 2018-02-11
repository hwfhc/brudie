const exec = require('./spec')

var str = `## adfas
heiheihei**wawa**\`\`\`adf\`\`\`
+ **asdf**
+ zdsf**eaf**eff
`;

exec(str, (err, data) => {
    if (err)
        console.log(err);
    else
        console.log(data);
});
