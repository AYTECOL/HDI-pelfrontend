import React, {Component} from 'react';

import {withRouter} from "react-router-dom";
import {UrlSite} from "../../../../../config";

class BtnContinue extends Component {

    constructor(props) {
        super(props);
        this.state = {
            step: parseInt(this.props.match.params.step),
            continueButtonDisable: true,
            stateFormIdentificacion: 0,
            cotizacionExclude: [],
            comeBack: UrlSite + "/cotizacion/2/" + this.props.match.params.id
        };
    }

    saveAndExit() {
        window.location.href = UrlSite + "/";
    }

    nextStep() {
        window.location.href = UrlSite + "/cotizacion/4/" + this.props.match.params.id;
    }

    render() {
        return (
            <div>
                <div className={"return-button"}>
                    <a href={this.state.comeBack}><i className="back-icon">&nbsp;</i>Volver</a>
                </div>
                <button type="button" className={"btn btn-default"}
                        onClick={() => this.saveAndExit()}>Guardar y salir
                </button>
                <button type="button" className={"btn btn-primary"}
                        onClick={() => this.nextStep()}>Continuar
                </button>
            </div>
        );
    }
}

export default withRouter(BtnContinue);



