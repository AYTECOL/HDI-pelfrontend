import React, {Component} from 'react';

import store from '../../../../../store';
import {
    NextStep,
    nextStepIndentification,
    saveIdentificationValue,
    showPopupIdentification,
    disabledName,
    disabledLastName,
    disabledBusinessName
} from '../../../../../actionCreators';
import SaveIdentifications from '../../../../../services/SaveIdentifications';
import {Link, withRouter} from "react-router-dom";

// Services
import Consultapersonas from '../../../../../services/Consultapersonas';

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
                    if (true){

                    }
                }
                if (i === 0) {
                    storeState.continueButtonDisable = false;
                } else {
                    storeState.continueButtonDisable = true;
                }
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
            console.log(storeState.cotizacion.state);
        });
    }

    async nextStepIndex() {
        let storeState = store.getState();
        switch (this.state.stateFormIdentificacion) {
            case 0:
            default:
                this.setState({
                    ...this.state,
                    continueButtonDisable: true,
                });
                let code = storeState.cotizacion.identification.code;
                let value = storeState.cotizacion.identification.value;
                if (code === "37")  value = value.replace("-", "",value);
                document.getElementById("doc-type-value").setAttribute("disabled","disabled");
                let persona = await Consultapersonas.get(code,value);
                if ( persona.consultarPersonaRs.personaRestringida === true ) {
                    store.dispatch(showPopupIdentification(true));
                }else{
                    store.dispatch(nextStepIndentification());
                    if ( persona.consultarPersonaRs.personaEncontradaIAXIS === true ){
                        let personaData = persona.consultarPersonaRs.persona;
                        let personaType = persona.consultarPersonaRs.persona.tipoPersona.codigo;

                        personaData = personaData[(personaType===2?'personaJuridica':'personaNatural')];
                        if ( typeof personaData.primerNombre !== 'undefined' && personaData.primerNombre !== '' ) {
                            store.dispatch(saveIdentificationValue({
                                name: 'name',
                                value: personaData.primerNombre
                            }));
                            store.dispatch(disabledName());
                        }
                        if ( typeof personaData.primerApellido !== 'undefined' && personaData.primerApellido !== '' ) {
                            store.dispatch(saveIdentificationValue({
                                name: 'lastname',
                                value: personaData.primerApellido
                            }));
                            store.dispatch(disabledLastName());
                        }

                        if ( typeof personaData.razonSocial !== 'undefined' && personaData.razonSocial !== '' ) {
                            store.dispatch(saveIdentificationValue({
                                name: 'businessname',
                                value: personaData.razonSocial
                            }));
                            store.dispatch(disabledBusinessName());
                        }

                    }
                }
                break;
            case 1:
                store.dispatch(NextStep(2));
                SaveIdentifications.save();
                this.props.history.push('/cotizacion/2/' + storeState.cotizacion.number);
                break;
        }
    }

    saveAndExit() {
        SaveIdentifications.save();
        window.location.href = "/";
    }

    render() {
        return (
            <div>
                <div className={(this.state.stateFormIdentificacion !== 1 ? "hide " : "") + " return-button"}>
                    <Link to='/'><i className="back-icon"></i>Volver</Link>
                </div>
                <button className={(this.state.stateFormIdentificacion !== 1 ? "hide " : "") + " btn btn-default"}
                        onClick={() => this.saveAndExit()} type="button">Guardar y salir
                </button>
                <button disabled={this.state.continueButtonDisable} onClick={() => this.nextStepIndex()}
                        type="button"
                        className={(this.state.continueButtonDisable ? 'disabled ' : '') + "btn btn-primary"}>Continuar
                </button>
            </div>
        );
    }
}

export default withRouter(BtnContinue);



