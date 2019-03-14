import React, {Component} from 'react';
import Service from './Service';

class Identifications extends Component {
    static async get() {
        return await Service.get('identifications');
    };
}

export default Identifications;
