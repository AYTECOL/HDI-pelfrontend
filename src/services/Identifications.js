import React, { Component } from 'react';
import Service from './Service';

class Identifications extends Component {
    get() {
        let service = new Service;
        let data = service.get('identifications');
        if (typeof data.identifications == 'undefined') {
            data.identifications = [];
        }
        return data;
    };
}

export default Identifications;
