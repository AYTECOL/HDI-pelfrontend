import React, {Component, Fragment} from 'react';

import store from '../../../../../store';
import {
    disabledBusinessName,
    disabledLastName,
    disabledName,
    NextStep,
    nextStepIndentification,
    saveIdentificationValue,
    showPopupIdentification
} from '../../../../../actions';
import SaveIdentifications from '../../../../../services/Quote';
import {Link, withRouter} from "react-router-dom";
// Components
import Name from '../name/Name';
import LastName from '../lastname/Lastname';
import RazonSocial from '../razonsocial/Razonsocial';
// Services
import ConsultaPersonas from '../../../../../services/ConsultaPersonas';
import {UrlSite} from "../../../../../config";
import Helpers from "../../../../../common/helpers/helpers/Helpers";

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
                if (typeDoc === 2) {
                    this.state.cotizacionExclude.push("name");
                    this.state.cotizacionExclude.push("lastname");
                    this.state.cotizacionExclude.push("addressadditional");
                    this.state.cotizacionExclude.pop(this.state.cotizacionExclude.indexOf("businessname"));
                } else {
                    this.state.cotizacionExclude.pop(this.state.cotizacionExclude.indexOf("name"));
                    this.state.cotizacionExclude.pop(this.state.cotizacionExclude.indexOf("lastname"));
                    this.state.cotizacionExclude.push("businessname");
                    this.state.cotizacionExclude.push("addressadditional");
                }
                let i = 0;
                for (let item in storeState.cotizacion.identification) {
                    if (storeState.cotizacion.identification[item] === "" && this.state.cotizacionExclude.indexOf(item) === -1) {
                        i++;
                    }
                    if (typeDoc === 2) {
                        if (item === "businessname" && storeState.cotizacion.identification[item].length > RazonSocial.limit()) {
                            i++;
                        }
                    } else {
                        if (item === "name" && storeState.cotizacion.identification[item].length > Name.limit()) {
                            i++;
                        }
                        if (item === "lastname" && storeState.cotizacion.identification[item].length > LastName.limit()) {
                            i++;
                        }
                    }
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
            store.dispatch(NextStep(2));
            await SaveIdentifications.save();
            window.location.href = UrlSite + '/cotizacion/2/' + storeState.cotizacion.number;
        } else {
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
                    Helpers.enabled("doc-type-value");
                    store.dispatch(showPopupIdentification(true));
                } else {
                    store.dispatch(nextStepIndentification());
                    if (persona.consultarPersonaRs.personaEncontradaIAXIS === true) {
                        let personaData = persona.consultarPersonaRs.persona;
                        let personaType = persona.consultarPersonaRs.persona.tipoPersona.codigo;

                        personaData = personaData[(personaType === 2 ? 'personaJuridica' : 'personaNatural')];
                        if (typeof personaData.primerNombre !== 'undefined' && personaData.primerNombre !== '') {
                            store.dispatch(saveIdentificationValue({
                                name: 'name',
                                value: personaData.primerNombre
                            }));
                            store.dispatch(disabledName());
                        }
                        if (typeof personaData.primerApellido !== 'undefined' && personaData.primerApellido !== '') {
                            store.dispatch(saveIdentificationValue({
                                name: 'lastname',
                                value: personaData.primerApellido
                            }));
                            store.dispatch(disabledLastName());
                        }
                        if (typeof personaData.razonSocial !== 'undefined' && personaData.razonSocial !== '') {
                            store.dispatch(saveIdentificationValue({
                                name: 'businessname',
                                value: personaData.razonSocial
                            }));
                            store.dispatch(disabledBusinessName());
                        }

                    }
                }
            } catch (e) {
                Helpers.enabled("doc-type-value");
            }
        }
    };

    saveAndExit = async () => {
        await SaveIdentifications.save();
        window.location.href = UrlSite + "/";
    };

    render = () => (
        <Fragment>
            <div className={(this.state.stateFormIdentificacion !== 1 ? "hide " : "") + " return-button"}>
                <Link to='/'><i className="back-icon">&nbsp;</i>Volver</Link>
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

export default withRouter(BtnContinue);



