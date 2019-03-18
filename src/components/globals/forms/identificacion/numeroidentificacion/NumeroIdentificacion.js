import React, { Component } from 'react';

import store from '../../../../../store';
import { saveIdentificationValue, continueButtonDisable } from '../../../../../actionCreators';

class NumeroIdentificacion extends Component {

    constructor(props) {
        super(props);
        let storeState = store.getState();
        this.state = {
            options: {
                cities: []
            },
            value: "",
            error: false,
            idElement: "",
            disabled: false,
            typeIdentification: storeState.cotizacion.identification.code,
            toggle: false,
            onChange: null
        };

        store.subscribe(() => {
            let storeState = store.getState();
            let disabled = false;
            let value = this.state.value;
            let newState = storeState.stateFormIdentificacion;
            if (newState != 0) disabled = true;
            if ( storeState.cotizacion.identification.code != this.state.typeIdentification ) {
                value = "";
            }
            this.setState({
                ...this.state,
                disabled: disabled,
                typeIdentification: storeState.cotizacion.identification.code,
                value: value
            });
        });
    }

    validateEmpty(v,e){
        let error = false;

        if ( v.length < 1 ) error = true;
        switch (this.state.typeIdentification) {
            // Valida todos los documentos persona natural
            case "36":
            case "33":
            case "40":
            case "38":
            case "35":
            case "44":
            case "34":
                if (v.length < 5 || v.length >= 15 || isNaN(v)) {
                    error = true;
                }
                break;
            // Valida solo el nit
            case "37":
                let s = v.split("-");
                if (v.indexOf("-") == -1 || isNaN(parseInt(v)) ||
                    s[0].length < 7 || s[1].length < 1 || isNaN(s[0]) || isNaN(s[1])
                ) {
                    error = true;
                }
                break;
        }

        if ( error == false ) store.dispatch(saveIdentificationValue(e));
        store.dispatch(continueButtonDisable(error));

        this.setState({
            ...this.state,
            error: error,
            value: v
        });
    }

    render() {
        return (
            <div className={"form-group " + (this.state.error?'error':'')}>
                <label htmlFor="doc-type-value">Número de identificación</label>
                <input disabled={(this.state.disabled ? "disabled" : "")} name="value" id="doc-type-value"
                       type="text"
                       className={(this.state.disabled ? "disabled " : "") + "form-control"}
                       value={this.state.value}
                       placeholder="Ingresa la identificación"
                       onBlur={(e) =>{
                           this.validateEmpty(e.target.value,e.target);
                       }}
                       onChange={(e) => {
                           this.validateEmpty(e.target.value,e.target);
                       }}/>
                <small className="form-text only-errors">El número de Identificación ingresado, no corresponde con el tipo de identificación seleccionado.</small>
            </div>
        );
    }
}

export default NumeroIdentificacion;



