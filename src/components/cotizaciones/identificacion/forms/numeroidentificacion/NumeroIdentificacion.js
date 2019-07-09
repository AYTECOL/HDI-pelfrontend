import React, {Component} from 'react';

import store from '../../../../../store';
import {continueButtonDisable, saveIdentificationValue} from '../../../../../actions';
import Helpers from "../../../../../common/helpers/helpers/Helpers";

class NumeroIdentificacion extends Component {

    constructor(props) {
        super(props);
        let storeState = store.getState();
        this.state = {
            options: {cities: []},
            value: "",
            error: false,
            idElement: "",
            typeIdentification: storeState.cotizacion.identification.code,
            toggle: false,
            onChange: null
        };
    }

    static toggleDisable(status) {
        if (status === true) {
            Helpers.disabled('#doc-type-value');
        } else {
            Helpers.enabled('#doc-type-value');
        }
    }

    componentDidMount() {
        this.unsubscribe = store.subscribe(() => {
            let storeState = store.getState();
            let value = this.state.value;
            let newState = storeState.stateFormIdentificacion;
            if (newState !== 0) value = storeState.cotizacion.identification.value;
            if (storeState.cotizacion.identification.code !== this.state.typeIdentification && newState === 0) value = '';
            this.setState({
                ...this.state,
                typeIdentification: storeState.cotizacion.identification.code,
                value: value
            });
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    validateEmpty = event => {
        if (event === 'notempty') return;
        let v = event.target.value;
        let e = event.target;

        let error = false;

        if (v.length < 1) error = true;
        // CC
        if (this.state.typeIdentification === "36") {
            if (v.length < 3 || v.length > 10 || isNaN(v)) error = true;
            //CC extranjería
        } else if (this.state.typeIdentification === "33") {
            if (v.length < 1 || v.length > 18 || isNaN(v)) error = true;
            //Pasaporte
        } else if (this.state.typeIdentification === "40") {
            if (v.length < 3 || v.length > 10) error = true;
            //NUIP
        } else if (this.state.typeIdentification === "38") {
            if (v.length < 3 || v.length > 10 || isNaN(v)) error = true;
            //Registro civil
        } else if (this.state.typeIdentification === "35") {
            if (v.length < 3 || v.length > 20 || isNaN(v)) error = true;
            //Diplomático
        } else if (this.state.typeIdentification === "44") {
            if (v.length < 3 || v.length > 10) error = true;
            //Identidad
        } else if (this.state.typeIdentification === "34") {
            if (v.length < 3 || v.length > 10 || isNaN(v)) error = true;
            //NIT
        } else if (this.state.typeIdentification === "37") {
            if (v.length < 9 || isNaN(v)) error = true;
            // if( v.length === 10 && v.substr(-1) === "-" ){
            //     let sub = parseInt(v.toString().substr(0,9));
            //     v = sub + "-" + Helpers.calcularDigitoVerificacion(v);
            // }
            let sub = parseInt(v.toString().substr(0,9));
            if( sub < 80000000 || sub > 999999999 ) error = true
        }

        if (error === false) store.dispatch(saveIdentificationValue(e));
        store.dispatch(continueButtonDisable(error));

        this.setState({
            ...this.state,
            error: error,
            value: v
        });
    };

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.error !== nextState.error || this.state.disabled !== nextState.disabled || this.state.value !== nextState.value;
    }

    render() {
        return (
            <div className={"form-group " + (this.state.error ? 'error' : '')}>
                <label htmlFor="doc-type-value">Número de identificación</label>
                <input name="value" id="doc-type-value"
                       type="text"
                       className={"form-control"}
                       value={this.state.value}
                       placeholder="Ingresa la identificación"
                       onBlur={this.validateEmpty}
                       onChange={this.validateEmpty}/>
                <small className="form-text only-errors">El número de Identificación ingresado, no corresponde con el
                    tipo de identificación seleccionado.
                </small>
            </div>
        );
    }
}

export default NumeroIdentificacion;



