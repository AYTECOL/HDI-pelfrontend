import React, { Component } from 'react';
import axios from 'axios';

const Baseurl = "https://hexx1yso1e.execute-api.us-east-1.amazonaws.com/dev/";
class Service extends Component {
    get(url) {
        return axios.get(Baseurl+url,{
            headers: {
                'Access-Control-Allow-Origin' : '*',
            }
        })
        .then(response => {
            return response.data;
        });
    };
}

export default Service;
