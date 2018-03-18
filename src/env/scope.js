"use strict";
module.exports = {
    set,
    get
};

const scope = {
    ajax: async function (url){
        return await sendReq(url);
    },
    getPathname: function (number, callback) {
        callback(window.location.pathname.split('/')[number]);
    }
}

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

function formErr(ident) {
    if (isArray(ident)) {
        var str = ident[0];

        for (var j = i; j < i; j++)
            str += `.${ident[j]}`;

        return new Error(`variable is undefiend : ${str}`);
    }
    else
        return new Error(`variable is undefiend : ${ident}`);
    }