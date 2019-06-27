import React, {Component, Fragment} from "react";

import {withRouter} from "react-router-dom";
import {UrlSite} from "../../../../../config";
import Helpers from "../../../../../common/helpers/helpers/Helpers";
import PolicyService from "../../../../../services/Policy";
import Loading from "../../../../globals/loading/Loading";
import store from "../../../../../store";
import {NextStep} from "../../../../../actions";
import SaveIdentifications from "../../../../../services/Quote";
import Crearpolizaiaxis from "../../../../../services/Crearpolizaiaxis";
import QuoteIussedById from "../../../../../services/QuoteIussedById";

class BtnContinue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: parseInt(this.props.match.params.step),
            continueButtonDisable: true,
            stateFormIdentificacion: 0,
            cotizacionExclude: []
        };
    }

    goBack = () => {
        this.props.history.push(
            UrlSite + "/emision/2/" + this.props.match.params.id
        );
    };

    saveAndExit = () => {
        Helpers.goToHome(this.props.history);
    };

    getPolicyEmitedNumber = emmitedPolicy => {
        const {policy} = emmitedPolicy;
        const {emissionId} = policy || {};
        return emissionId;
    };

    nextStep = async () => {
        const {match, history} = this.props;
        const {params} = match;
        const {id} = params;
        try {
            let data = await QuoteIussedById.get(this.props.match.params.id);
            let result = await Crearpolizaiaxis.get(data);
            console.log(result);

            // let result = await PolicyService.emit(id);
            // let emitedPolicyNumber = this.getPolicyEmitedNumber(result);

/*            store.dispatch(NextStep(7));
            await SaveIdentifications.save();

            history.push(`${UrlSite}/exito/${id}/${emitedPolicyNumber}`);*/
            Loading.toggle(false);
        } catch (e) {
            Loading.toggle(false);
        }
    };

    render() {
        return (
            <Fragment>
                <div className={"return-button"}>
                    <button type="button" className="btn btn-link" onClick={this.goBack}>
                        <i className="back-icon">&nbsp;</i>Volver
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
