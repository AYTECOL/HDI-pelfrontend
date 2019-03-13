import React, { Component } from 'react';
import axios from 'axios';

const Baseurl = "https://1s2h3bt5l3.execute-api.us-east-1.amazonaws.com/dev/";
class Service extends Component {
     static async get(url) {
         return await axios.get(Baseurl+url,{
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
