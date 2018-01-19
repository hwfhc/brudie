const exec = require('./examples/markdown/spec')

exec('##adf', (err,data) => {
    if(err)
        console.log(err);
    else
        console.log(data);
});
