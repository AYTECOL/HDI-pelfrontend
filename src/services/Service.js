import store from "../store";
import {toggleLoading} from "../actionCreators";
import axios from 'axios';
import Promise from 'es6-promise';

class Service {

    static HttpRequest (method, url, data) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open(method, url);
            xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
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
            xhr.send(JSON.stringify(data));
        });
    }

    static async get(url) {
        return await Service.HttpRequest('GET', url).then(function (response) {
            return JSON.parse(response);
        })
    };

    static async post(url, data) {
        store.dispatch(toggleLoading(true));
        return await Service.HttpRequest('POST',url, data).then(function (response) {
            store.dispatch(toggleLoading(false));
            return JSON.parse(response);
        });
    };

    static async put(url) {
        return await Service.HttpRequest('PUT',url).then(function (response) {
            store.dispatch(toggleLoading(false));
            return JSON.parse(response);
        })
    };
}

export default Service;
