const Token = require('./token');

const Num = require('./num');
const Ident = require('./ident');
const Punc = require('./punc');
const Html = require('./html');
const Quo = require('./quo');
const Code = require('./code');

const outCode = [Html,Code];
const inStr = [Html,Quo];
const outStr = [Num,Ident,Quo,Punc,Code];


class Mode{
    constructor(){
        this.list = outCode;
    }

    getMatchList(){
        return this.list;
    }

    switch(char){
        if(char === '{{')
            this.list = outStr;


        if(char === '}}')
            this.list = outCode;

        if(char === '`'){
            if(this.list === inStr)
                this.list = outStr;
            else
                this.list = inStr;
        }
    }
}


function isStrStart(char){
    var a = (char === '`');
    return a ;
}

module.exports = Mode;
