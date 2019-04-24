import React, {Component} from 'react';

import './Links.scss';
import store from "../../../../../store";
import {toggleTopUpSendMail} from "../../../../../actionCreators";

class Links extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    openModal() {
        store.dispatch(toggleTopUpSendMail(true));
    }

    render() {
        return (
            <div>
                <div className="generatepdf link-item">
                    <p><i>&nbsp;</i> Generar cotización en PDF</p>
                </div>
                <div className="sendpdf link-item" onClick={(e) => {
                    this.openModal();
                }}>
                    <p><i>&nbsp;</i> Enviar por correo</p>
                </div>
            </div>
        );
    }
}

export default Links;



