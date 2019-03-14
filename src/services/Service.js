import axios from 'axios';

class Service {
     static async get(url) {
         axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
         return await axios.get(url)
        .then(response => {
            return response.data;
        });
    };
}

export default Service;
