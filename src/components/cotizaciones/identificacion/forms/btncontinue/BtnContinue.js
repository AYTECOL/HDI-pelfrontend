import React, {Component, Fragment} from 'react';

import store from '../../../../../store';
import {NextStep, nextStepIndentification, saveIdentificationValue, savePdfInfo} from '../../../../../actions';
import Loading from "../../../../../components/globals/loading/Loading";
import SaveIdentifications from '../../../../../services/Quote';
// Components
import Name from '../name/Name';
import LastName from '../lastname/Lastname';
import RazonSocial from '../razonsocial/Razonsocial';
// Services
import ConsultaPersonas from '../../../../../services/ConsultaPersonas';
import {UrlSite} from "../../../../../config";
import Helpers from "../../../../../common/helpers/helpers/Helpers";
import NumeroIdentificacion from "../numeroidentificacion/NumeroIdentificacion";
import Validaridentificacion from "../../popups/validaridentificacion/Validaridentificacion";

class BtnContinue extends Component {

    constructor(props) {
        super(props);
        this.state = {
            continueButtonDisable: true,
            stateFormIdentificacion: 0,
            cotizacionExclude: [],
        };

        store.subscribe(() => {
            let storeState = store.getState();
            let stateForm = storeState.stateFormIdentificacion;
            let typeDoc = storeState.typeDocument;
            if (stateForm === 1) {
                let i = 0;
                if (typeDoc === 2) {
                    if (storeState.cotizacion.identification['businessname'].length > RazonSocial.limit() ||
                        storeState.cotizacion.identification['businessname'] === ""
                    ) i++;
                } else {
                    if (storeState.cotizacion.identification['name'].length > Name.limit() ||
                        storeState.cotizacion.identification['lastname'].length > LastName.limit() ||
                        storeState.cotizacion.identification['name'] === "" ||
                        storeState.cotizacion.identification['lastname'] === ""
                    ) i++;
                }
                if (
                    storeState.cotizacion.identification['address'] === "" ||
                    storeState.cotizacion.identification['department'] === "" ||
                    storeState.cotizacion.identification['city'] === ""
                ) {
                    i++;
                }
                storeState.continueButtonDisable = i !== 0;
            }
            if (
                this.state.continueButtonDisable !== storeState.continueButtonDisable ||
                this.state.stateFormIdentificacion !== storeState.stateFormIdentificacion
            ) {
                this.setState({
                    ...this.state,
                    continueButtonDisable: storeState.continueButtonDisable,
                    stateFormIdentificacion: storeState.stateFormIdentificacion,
                });
            }
        });
    }

    nextStepIndex = async () => {
        let storeState = store.getState();
        if (this.state.stateFormIdentificacion === 1) {
            Loading.toggle(true);
            store.dispatch(NextStep(2));
            await SaveIdentifications.save();
            window.location.href = UrlSite + '/cotizacion/2/' + storeState.cotizacion.number;
        } else {
            Loading.toggle(true);
            this.setState({
                ...this.state,
                continueButtonDisable: true,
            });
            let code = storeState.cotizacion.identification.code;
            let value = storeState.cotizacion.identification.value;
            if (code === "37") value = value.replace("-", "", value);
            Helpers.disabled("doc-type-value");
            try {
                let persona = await ConsultaPersonas.get(code, value);
                if (persona.consultarPersonaRs.personaRestringida === true) {
                    NumeroIdentificacion.toggleDisable(false);
                    Validaridentificacion.toggle(true);
                } else {
                    store.dispatch(nextStepIndentification());
                    store.dispatch(saveIdentificationValue({
                        name: 'object',
                        value: persona
                    }));
                    if (persona.consultarPersonaRs.personaEncontradaIAXIS === true) {
                        let personaData = persona.consultarPersonaRs.persona;
                        let personaType = persona.consultarPersonaRs.persona.tipoPersona.codigo;
                        NumeroIdentificacion.toggleDisable(true);

                        personaData = personaData[(personaType === 2 ? 'personaJuridica' : 'personaNatural')];
                        if (typeof personaData.primerNombre !== 'undefined' && personaData.primerNombre !== '') {
                            store.dispatch(saveIdentificationValue({
                                name: 'name',
                                value: personaData.primerNombre
                            }));
                            Name.toggleDisable(true);
                        }
                        if (typeof personaData.primerApellido !== 'undefined' && personaData.primerApellido !== '') {
                            store.dispatch(saveIdentificationValue({
                                name: 'lastname',
                                value: personaData.primerApellido
                            }));
                            LastName.toggleDisable(true);
                        }
                        if (typeof personaData.razonSocial !== 'undefined' && personaData.razonSocial !== '') {
                            store.dispatch(saveIdentificationValue({
                                name: 'businessname',
                                value: personaData.razonSocial
                            }));
                            RazonSocial.toggleDisable(true);
                        }
                    }
                }
            } catch (e) {
                NumeroIdentificacion.toggleDisable(false);
            }
            Loading.toggle(false);
        }
    };

    saveAndExit = async () => {
        Loading.toggle(true);
        await SaveIdentifications.save();
        Helpers.goToHome();
    };

    render = () => (
        <Fragment>
            <div className={(this.state.stateFormIdentificacion !== 1 ? "hide " : "") + " return-button"}>
                <button type="button" className="btn btn-link" onClick={this.saveAndExit}>
                    <i className="back-icon">&nbsp;</i>Volver
                </button>
            </div>
            <button type="button"
                    className={(this.state.stateFormIdentificacion !== 1 ? "hide " : "") + " btn btn-default"}
                    onClick={this.saveAndExit}>Guardar y salir
            </button>
            <button disabled={this.state.continueButtonDisable} onClick={this.nextStepIndex}
                    type="button"
                    className={(this.state.continueButtonDisable ? 'disabled ' : '') + "btn btn-primary"}>Continuar
            </button>
        </Fragment>
    );
}

export default BtnContinue;



