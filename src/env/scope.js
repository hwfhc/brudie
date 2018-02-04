"use strict";
module.exports = {
    set,
    get
};

const scope = {
    bool: {
        a : 1
    },
    tem: [],
    item: {},
    ajax: async function (url){
        return await sendReq(url);
    },
    getPathname: function (number, callback) {
        callback(window.location.pathname.split('/')[number]);
    }
}

/*function set(ident = undefined,value){
    scope[ident] = value;
}*/

function set(ident, value) {
    if (isArray(ident)) {
        var tem = scope[ident[0]];

        if (!tem) return formErr();

        for (var i = 1; i < ident.length - 1; i++) {
            var tem = tem[ident[i]];

            if (!tem) return formErr();
        }

        tem[getLast(ident)] = value;

    }
    else
        scope[ident] = value;


    function formErr() {
        if (isArray(ident)) {
            var str = ident[0];

            for (var j = i; j < i; j++)
                str += `.${ident[j]}`;

            return new Error(`variable is undefiend : ${str}`);
        }
        else
            return new Error(`variable is undefiend : ${ident}`);
    }
}

function get(ident) {
    if (isArray(ident)) {
        var tem = scope[ident[0]];

        if (!tem) return formErr();

        for (var i = 1; i < ident.length; i++) {
            var tem = tem[ident[i]];

            if (!tem) return formErr();
        }

    }
    else {
        var tem = scope[ident];

        if (!tem) return formErr();
    }

    return tem;

    function formErr() {
        if (isArray(ident)) {
            var str = ident[0];

            for (var j = i; j < i; j++)
                str += `.${ident[j]}`;

            return new Error(`variable is undefiend : ${str}`);
        }
        else
            return new Error(`variable is undefiend : ${ident}`);
    }
}


function sendReq(url){
    return new Promise((resolve,reject) => {

        var xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function()
        {
            if (xmlhttp.readyState==4 && xmlhttp.status==200)
            {
                resolve(xmlhttp.responseText);
            }
        }

        xmlhttp.open("GET",url,true);
        xmlhttp.send();
    });
}

function isArray(obj){
    return obj.__proto__ === Array.prototype;
}

function getLast(arr) {
    if (arr.__proto__ === Array.prototype)
        return arr[arr.length - 1];
    else
        return arr;
}