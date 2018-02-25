const exec = require('./spec')

exec('##test', (err,data) => {
    if(err)
        console.log(err);
    else
        console.log(data);
});
