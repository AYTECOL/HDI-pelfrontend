import React, { Component } from 'react';
import axios from 'axios';

const Baseurl = "https://1s2h3bt5l3.execute-api.us-east-1.amazonaws.com/dev/";
class Service extends Component {
     static async get(url) {
         axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
         return await axios.get(Baseurl+url)
        .then(response => {
            return response.data;
        });
    };
}

export default Service;
