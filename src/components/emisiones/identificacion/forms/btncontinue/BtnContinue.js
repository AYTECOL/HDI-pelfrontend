import React, {Component, Fragment} from 'react';

import {Link, withRouter} from "react-router-dom";
import {UrlSite} from "../../../../../config";
import Helpers from "../../../../../common/helpers/helpers/Helpers";

class BtnContinue extends Component {

    constructor(props) {
        super(props);
        this.state = {
            step: parseInt(this.props.match.params.step),
            continueButtonDisable: true,
            stateFormIdentificacion: 0,
            cotizacionExclude: [],
        };
    }

    saveAndExit = () => {
        Helpers.goToHome();
    };

    nextStep = () => {
        window.location.href = UrlSite + "/emision/2/" + this.props.match.params.id;
    };

    render() {
        return (
            <Fragment>
                <div className={"return-button"}>
                    <Link to='/'><i className="back-icon">&nbsp;</i>Volver</Link>
                </div>
                <button type="button" className={"btn btn-default"}
                        onClick={this.saveAndExit}>Guardar y salir
                </button>
                <button type="button" className={"btn btn-primary "+(this.props.inactiveBtn?'disabled':'')}
                        disabled={this.props.inactiveBtn}
                        onClick={this.nextStep}>Continuar
                </button>
            </Fragment>
        );
    }
}

export default withRouter(BtnContinue);



