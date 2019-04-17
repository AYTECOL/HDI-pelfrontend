import React, {Component} from 'react';

import {Link, withRouter} from "react-router-dom";

class BtnContinue extends Component {

    constructor(props) {
        super(props);
        this.state = {
            continueButtonDisable: true,
            stateFormIdentificacion: 0,
            cotizacionExclude: [],
        };
    }

    saveAndExit() {
        window.location.href = "/";
    }

    render() {
        return (
            <div>
                <div className={"return-button"}>
                    <Link to='/'><i className="back-icon"></i>Volver</Link>
                </div>
                <button className={"btn btn-default"}
                        onClick={() => this.saveAndExit()} type="button">Guardar y salir
                </button>
                <button type="button" className={"btn btn-primary"}>Continuar
                </button>
            </div>
        );
    }
}

export default withRouter(BtnContinue);



