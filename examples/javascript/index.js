const exec = require('./spec')

exec('a=b', (err,data) => {
    if(err)
        console.log(err);
    else
        console.log(data);
});
