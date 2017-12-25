const exec = require('./examples/javascript/spec')

exec('my name is {{bool.a}} 165', (err,data) => {
    if(err)
        console.log(err);
    else
        console.log(data);
});
