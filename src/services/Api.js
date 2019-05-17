import Promise from 'es6-promise';
// Data from Env
import {UrlService} from '../config';

class Api {

    static HttpRequest(method, url, data, overrideBase, formData) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            if(typeof formData === "undefined") formData = false;
            if (typeof overrideBase === "undefined") {
                url = UrlService + url;
            } else {
                url = overrideBase + url;
            }
            xhr.open(method, url);
            if( formData === false ){
                xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
            }
            xhr.setRequestHeader("Access-Control-Allow-Origin", '*');
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(xhr.response);
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.onerror = function () {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            };
            if (data === null) {
                xhr.send();
            } else {
                if( formData === false ) {
                    data = JSON.stringify(data).replace(/<(?:.|\n)*?>/gm, '');
                }
                xhr.send(data);
            }
        });
    }

    static async get(url, overrideBase) {
        return await Api.HttpRequest('GET', url, null, overrideBase).then(function (response) {
            return JSON.parse(response);
        })
    };

    static async post(url, data, overrideBase) {
        return await Api.HttpRequest('POST', url, data, overrideBase).then(function (response) {
            return JSON.parse(response);
        });
    };

    static async put(url, overrideBase) {
        return await Api.HttpRequest('PUT', url, null, overrideBase).then(function (response) {
            return JSON.parse(response);
        })
    };

    static async files(url, file, overrideBase){
        let formData = new FormData();
        formData.append("file", file);
        return await Api.HttpRequest('POST', url, formData, overrideBase, true).then(function (response) {
            return JSON.parse(response);
        })
    }
}

export default Api;
