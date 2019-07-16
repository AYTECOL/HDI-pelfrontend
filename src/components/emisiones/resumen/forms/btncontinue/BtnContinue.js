import React, {Component, Fragment} from "react";

import {withRouter} from "react-router-dom";
import {UrlSite} from "../../../../../config";
import Helpers from "../../../../../common/helpers/helpers/Helpers";
import PolicyService from "../../../../../services/Policy";
import Loading from "../../../../globals/loading/Loading";
import store from "../../../../../store";
import {NextStep, saveIdentificationValue} from "../../../../../actions";
import SaveIdentifications from "../../../../../services/Quote";
import Crearpolizaiaxis from "../../../../../services/Crearpolizaiaxis";
import QuoteIussedById from "../../../../../services/QuoteIussedById";
import IssuedCounter from "../../../../../services/IssuedCounter";
import AttachPolicyDocuments from "../../../../../services/AttachPolicyDocuments";

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
        Loading.toggle(true);
        try {
            let data = await QuoteIussedById.get(this.props.match.params.id);

            let numeroPoliza = await IssuedCounter.get();
            let dataSend = await Crearpolizaiaxis.get(data);

            dataSend['id'] = id;
            let result = await PolicyService.emit(id, dataSend);
            result = result.policyReq;

            result.crearPolizaIAXISRq.poliza.datosPolizaHome.datosGestion.numeroPoliza = numeroPoliza.currentValue.toString();
            result.crearPolizaIAXISRq.poliza.datosPolizaHome.datosGestion.numeroRecibo = numeroPoliza.currentValue.toString();

            let send = await Crearpolizaiaxis.save(result);
            let attach = await AttachPolicyDocuments.get(id, send.crearPolizaIAXISRs.emisionPoliza.resultadoPolizaHome.codigoProcesoCargue);

            await AttachPolicyDocuments.save(attach);

            store.dispatch(saveIdentificationValue({
                name: 'emissionId',
                value: numeroPoliza.currentValue
            }));
            store.dispatch(saveIdentificationValue({
                name: 'emitedDate',
                value: new Date()
            }));
            store.dispatch(NextStep(7));
            await SaveIdentifications.save();
            history.push(`${UrlSite}/exito/${id}/${numeroPoliza.currentValue}`);

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
