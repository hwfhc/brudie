const exec = require('./spec')

exec('##adf', (err,data) => {
    if(err)
        console.log(err);
    else
        console.log(data);
});
