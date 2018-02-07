const exec = require('./spec')

var str = `##adf
heiheihei
**wawa**
+a
+b
`;

exec(str, (err, data) => {
    if (err)
        console.log(err);
    else
        console.log(data);
});
