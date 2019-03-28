import React, {Component} from 'react';

import store from '../../../../../store';
import {Link, withRouter} from "react-router-dom";

class BtnContinue extends Component {

    constructor(props) {
        super(props);
        this.state = {};

        store.subscribe(() => {

        });
    }

    render() {
        return (
            <div>
                <div className={"return-button"}>
                    <Link to='/'><i className="back-icon"></i>Volver</Link>
                </div>
                <button className={"btn btn-default"}
                        type="button">Guardar y salir
                </button>
                <button type="button"
                        className={"btn btn-primary"}>Continuar
                </button>
            </div>
        );
    }
}

export default withRouter(BtnContinue);



