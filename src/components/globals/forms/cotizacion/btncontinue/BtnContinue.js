import React, {Component} from 'react';

import SaveIdentifications from '../../../../../services/SaveIdentifications';
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

    async nextStepIndex() {

    }

    saveAndExit() {
        SaveIdentifications.save();
        window.location.href = "/";
    }

    render() {
        return (
            <div>
                <div className={"return-button"}>
                    <Link to='/'><i className="back-icon"></i>Volver</Link>
                </div>
                <button className={" btn btn-default"}
                        onClick={() => this.saveAndExit()} type="button">Guardar y salir
                </button>
                <button onClick={() => this.nextStepIndex()}
                        type="button"
                        className={"btn btn-primary"}>Iniciar emisión
                </button>
            </div>
        );
    }
}

export default withRouter(BtnContinue);



