import React, {Component} from 'react';

import store from '../../../../../store';
import {saveInmuebleValue} from '../../../../../actionCreators';
import BuildYears from "../../../../../services/BuildYear";

class Anoconstruccion extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            value: "",
            years: []
        };

        this.getYears();

        store.subscribe(async () => {
            let storeState = store.getState();
            let value = storeState.Inmueble.anoconstruido;
            if (this.state.value !== value) {
                this.setState({
                    ...this.state,
                    value: value,
                });
            }
        });
    }

    async getYears(){
        let years = await BuildYears.get();
        this.setState({
            ...this.state,
            years: years,
        });
    }

    validateEmpty(e) {
        let error = false;
        if (e.value.length < 1) error = true;
        this.setState({
            ...this.state,
            error: error
        });
        store.dispatch(saveInmuebleValue(e));
    }

    render() {
        return (
            <div className={"input-select form-group " + (this.state.error ? 'error' : '')}>
                <label htmlFor="anoconstruidoe">Año en que fue construido inmueble</label>
                <select disabled={(this.state.disabled ? "disabled" : "")} name="anoconstruido" id="anoconstruido"
                        className={(this.state.disabled ? "disabled " : "") + "form-control"}
                        value={this.state.value}
                        onBlur={(e) => {
                            this.validateEmpty(e.target);
                        }}
                        onChange={(e) => {
                            this.validateEmpty(e.target);
                        }}
                >
                    <option value="">Selecciona</option>
                    {this.state.years.map(option =>
                        <option  key={option.buildYearCode} value={option.buildYearCode}>{option.answer}</option>
                    )}
                </select>
            </div>
        );
    }
}

export default Anoconstruccion;



