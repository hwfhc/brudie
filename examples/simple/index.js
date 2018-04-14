const exec = require('./spec')

async function asyncType(){
    try{
        console.log(await exec('##test'));
    }catch(err){
        console.log(err);
    }
}

function promiseType(){
    exec('##test').then(
        data => 
          console.log(data),
        err => 
          console.log(err));
}

asyncType();
promiseType();
