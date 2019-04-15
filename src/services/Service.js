import axios from 'axios';
import store from "../store";
import {toggleLoading} from "../actionCreators";

class Service {
    static async get(url) {
        axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
        return await axios.get(url)
            .then(response => {
                return response.data;
            });
    };

    static async post(url, data) {
        store.dispatch(toggleLoading(true));
        axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
        return await axios.post(url, data)
            .then(response => {
                store.dispatch(toggleLoading(false));
                return response.data;
            });
    };

    static async put(url) {
        axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
        return await axios.put(url)
            .then(response => {
                return response.data;
            });
    };
}

export default Service;
