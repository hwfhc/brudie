const exec = require('./examples/drypot/spec')

exec('adf {{bool.a}} adf', (err,data) => {
    if(err)
        console.log(err);
    else
        console.log(data);
});
