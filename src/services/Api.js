import store from "../store";
import {toggleLoading} from "../actions";
import Promise from 'es6-promise';

// Data from Env
import {UrlService} from '../config';

class Api {

    static HttpRequest(method, url, data, overrideBase, showLoader) {
        // if (typeof showLoader === "undefined") store.dispatch(toggleLoading(true));
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            if (typeof overrideBase === 'undefined') {
                url = UrlService + url;
            } else {
                url = overrideBase + url;
            }
            xhr.open(method, url);
            xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
            xhr.setRequestHeader("Access-Control-Allow-Origin", '*');
            xhr.onload = function () {
                store.dispatch(toggleLoading(false));
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
                store.dispatch(toggleLoading(false));
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            };
            if (data === null) {
                xhr.send();
            } else {
                data = JSON.stringify(data).replace(/<(?:.|\n)*?>/gm, '');
                xhr.send(data);
            }
        });
    }

    static async get(url, overrideBase, showLoader) {
        return await Api.HttpRequest('GET', url, null, overrideBase, showLoader).then(function (response) {
            return JSON.parse(response);
        })
    };

    static async post(url, data, overrideBase, showLoader) {
        return await Api.HttpRequest('POST', url, data, overrideBase, showLoader).then(function (response) {
            return JSON.parse(response);
        });
    };

    static async put(url, overrideBase, showLoader) {
        return await Api.HttpRequest('PUT', url, null, overrideBase, showLoader).then(function (response) {
            return JSON.parse(response);
        })
    };
}

export default Api;
