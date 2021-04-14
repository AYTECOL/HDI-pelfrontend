import React, { Component, Fragment } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import store from '../../../../../store';
import { NextStep, nextStepIndentification, resetStore, saveIdentificationValue } from '../../../../../actions';
import Loading from "../../../../../components/globals/loading/Loading";
import SaveIdentifications from '../../../../../services/Quote';
// Components
import Name from '../name/Name';
import LastName from '../lastname/Lastname';
import RazonSocial from '../razonsocial/Razonsocial';
// Services
import ConsultaPersonas from '../../../../../services/ConsultaPersonas';
import { UrlSite } from "../../../../../config";
import Helpers from "../../../../../common/helpers/helpers/Helpers";
import NumeroIdentificacion from "../numeroidentificacion/NumeroIdentificacion";
import TipoDocumento from "../tipodocumento/TipoDocumento";
import Validaridentificacion from "../../popups/validaridentificacion/Validaridentificacion";
import { withRouter } from "react-router-dom";
import { isValidDirection } from '../../../../../common/validations';

class BtnContinue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            stateFormIdentificacion: 0,
            cotizacionExclude: []
        };
    }

    nextStepIndex = async () => {
        const { identification, stateFormIdentificacion } = this.props;
        if (stateFormIdentificacion === 1) {
            Loading.toggle(true);
            store.dispatch(NextStep(2));
            await SaveIdentifications.save();
            this.props.history.push(UrlSite + "/cotizacion/2/" + this.props.match.params.id);
        } else {
            Loading.toggle(true);
            this.setState({
                ...this.state,
                loading: true
            });
            let code = identification.code;
            let value = identification.value;
            if (code === "37") value = value.replace("-", "", value);
            NumeroIdentificacion.toggleDisable(true);
            try {
                let persona = await ConsultaPersonas.get(code, value);
                if (persona.consultarPersonaRs.personaRestringida === true) {
                    NumeroIdentificacion.toggleDisable(false);
                    Validaridentificacion.toggle(true);
                } else {
                    store.dispatch(nextStepIndentification());
                    store.dispatch(
                        saveIdentificationValue({
                            name: "object",
                            value: persona
                        })
                    );
                    if (persona.consultarPersonaRs.personaEncontradaIAXIS === true) {
                        let personaData = persona.consultarPersonaRs.persona;
                        let personaType = persona.consultarPersonaRs.persona.tipoPersona.codigo;

                        if ((parseInt(code) === 36 && personaType === 1) || (parseInt(code) === 37 && personaType === 2)) {
                            NumeroIdentificacion.toggleDisable(true);
                            personaData = personaData[personaType === 2 ? 'personaJuridica' : 'personaNatural'];
                            if (typeof personaData.primerNombre !== 'undefined' && personaData.primerNombre !== '' && personaData.primerNombre !== null) {
                                store.dispatch(
                                    saveIdentificationValue({
                                        name: 'name',
                                        value: personaData.primerNombre
                                    })
                                );
                                Name.toggleDisable(true);
                            }
                            if (typeof personaData.primerApellido !== 'undefined' && personaData.primerApellido !== '' && personaData.primerApellido !== null) {
                                store.dispatch(
                                    saveIdentificationValue({
                                        name: 'lastname',
                                        value: personaData.primerApellido
                                    })
                                );
                                LastName.toggleDisable(true);
                            }
                            if (typeof personaData.razonSocial !== "undefined" && personaData.razonSocial !== "" && personaData.razonSocial !== null) {
                                store.dispatch(
                                    saveIdentificationValue({
                                        name: 'businessname',
                                        value: personaData.razonSocial
                                    })
                                );
                                RazonSocial.toggleDisable(true);
                            }
                        }
                    } else {
                        NumeroIdentificacion.toggleDisable(false);
                        TipoDocumento.toggleDisable(false);
                    }
                }
            } catch (e) {
                NumeroIdentificacion.toggleDisable(false);
                TipoDocumento.toggleDisable(false);
                this.setState({
                    ...this.state,
                    loading: false
                });
            }
            Loading.toggle(false);
        }
    };

    saveAndExit = async () => {
        Loading.toggle(true);
        await SaveIdentifications.save();
        store.dispatch(resetStore());
        Helpers.goToHome(this.props.history);
    };

    render() {
        const { stateFormIdentificacion, continueButtonDisable } = this.props;
        const { loading } = this.state;
        const disabled = loading || continueButtonDisable;
        return (
            <Fragment>
                <div className={(stateFormIdentificacion !== 1 ? "hide " : "") + " return-button"}>
                    <button type="button" className="btn btn-link" onClick={this.saveAndExit}>
                        <i className="back-icon">&nbsp;</i>Volver
                    </button>
                </div>
                <button type="button" className={(stateFormIdentificacion !== 1 ? "hide " : "") + " btn btn-default"} onClick={this.saveAndExit}>
                    Guardar y salir
                </button>
                <button disabled={disabled} onClick={this.nextStepIndex} type="button" className={(disabled ? "disabled " : "") + "btn btn-primary"}>
                    Continuar
                </button>
            </Fragment>
        );
    }
}

export default compose(
    withRouter,
    connect(({ stateFormIdentificacion, typeDocument, cotizacion, continueButtonDisable }) => {
        let stateForm = stateFormIdentificacion;
        let typeDoc = typeDocument;
        let { identification } = cotizacion;
        const { businessname, name, lastname, address, department, city } = identification;
        if (stateForm === 1) {
            let i = 0;
            if (typeDoc === 2) {
                if (businessname.length > RazonSocial.limit() || businessname === "") i++;
            } else {
                if (name.length > Name.limit() || lastname.length > LastName.limit() || name === "" || lastname === "") i++;
            }
            if (address === "" || department === "" || city === "" || !isValidDirection(address)) {
                i++;
            }
            continueButtonDisable = i !== 0;
        }

        return {
            identification,
            continueButtonDisable,
            stateFormIdentificacion
        };
    })
)(BtnContinue);
