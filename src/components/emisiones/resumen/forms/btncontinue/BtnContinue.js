import React, {Component, Fragment} from "react";

import {withRouter} from "react-router-dom";
import {UrlSite} from "../../../../../config";
import Helpers from "../../../../../common/helpers/helpers/Helpers";
import PolicyService from "../../../../../services/Policy";

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

    goBack = () => {
        this.props.history.push(UrlSite + "/emision/2/" + this.props.match.params.id);
    };

    saveAndExit = () => {
        Helpers.goToHome(this.props.history);
    };

    getPolicyNumber = emmitedPolicy => {
        const {
            data: {body}
        } = emmitedPolicy;
        const {crearPolizaIAXISRs} = body || {};
        const {emisionPoliza} = crearPolizaIAXISRs || {};
        const {numeroPoliza: policyNumber} = emisionPoliza || {};

        return policyNumber;
    };

    nextStep = async () => {
        const {match, history} = this.props;
        const {params} = match;
        const {id} = params;
        let result = await PolicyService.emit(id);
        let policyNumber = this.getPolicyNumber(result);
        history.push(`${UrlSite}/exito/${policyNumber}`);
    };

    render() {
        return (
            <Fragment>
                <div className={"return-button"}>
                    <button type="button" className="btn btn-link"
                            onClick={this.goBack}><i className="back-icon">&nbsp;</i>Volver
                    </button>
                </div>
                <button
                    type="button"
                    className={"btn btn-default"}
                    onClick={this.saveAndExit}
                >
                    Guardar y salir
                </button>
                <button
                    type="button"
                    className={"btn btn-primary"}
                    onClick={this.nextStep}
                >
                    Emitir
                </button>
            </Fragment>
        );
    }
}

export default withRouter(BtnContinue);
