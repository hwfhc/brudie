const exec = require('./spec')

async function test(){
    try{
        console.log(await exec('##test'));
    }catch(err){
        console.log(err);
    }
}

test();
