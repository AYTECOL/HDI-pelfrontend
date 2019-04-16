import axios from 'axios';
import store from "../store";
import {toggleLoading} from "../actionCreators";

class Service {

    static HttpRequest (method, url, data) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open(method, url);
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
            xhr.send();
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
        })
    };

    static async put(url) {
        return await Service.HttpRequest('PUT',url).then(function (response) {
            store.dispatch(toggleLoading(false));
            return JSON.parse(response);
        })
    };
}

export default Service;
