import store from "../store";
import {toggleLoading} from "../actionCreators";
import Promise from 'es6-promise';

import {UrlService} from '../config';

class Service {

    static HttpRequest(method, url, data, overrideBase) {

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
                xhr.send(JSON.stringify(data));
            }
        });
    }

    static async get(url, overrideBase) {
        return await Service.HttpRequest('GET', url, null, overrideBase).then(function (response) {
            return JSON.parse(response);
        })
    };

    static async post(url, data, overrideBase) {
        store.dispatch(toggleLoading(true));
        return await Service.HttpRequest('POST', url, data, overrideBase).then(function (response) {
            store.dispatch(toggleLoading(false));
            return JSON.parse(response);
        });
    };

    static async put(url, overrideBase) {
        return await Service.HttpRequest('PUT', url, null, overrideBase).then(function (response) {
            store.dispatch(toggleLoading(false));
            return JSON.parse(response);
        })
    };
}

export default Service;
