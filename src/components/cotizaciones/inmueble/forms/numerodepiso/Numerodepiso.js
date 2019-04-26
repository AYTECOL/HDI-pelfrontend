import React, {Component} from 'react';

import store from '../../../../../store';
import {saveInmuebleValue} from '../../../../../actions';
import AllFloors from '../../../../../services/Allfloors';
import Helpers from "../../../../../common/helpers/helpers/Helpers";

class Numerodepiso extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errorerror: false,
            value: "",
            floors: []
        };

        this.getFloors();
        store.subscribe(async () => {
            let storeState = store.getState();
            let value = storeState.Inmueble.numerodepisos;
            if (this.state.value !== value) {
                this.setState({
                    ...this.state,
                    value: value,
                });
            }
        });
    }

    async getFloors() {
        let allFloors = await AllFloors.get();
        this.setState({
            ...this.state,
            floors: allFloors,
        });
    }

    validateEmpty(e) {
        let error = false;
        if (e.value.length < 1) error = true;
        if (error === false) Helpers.removeClass(".numerodepisos", "error");
        this.setState({
            ...this.state,
            error: error,
            value: e.value
        });
        store.dispatch(saveInmuebleValue(e));
    }

    render() {
        return (
            <div className={"numerodepisos input-select form-group " + ((this.state.error) ? 'error' : '')}>
                <label htmlFor="numerodepisose">Número de pisos del inmueble</label>
                <select name="numerodepisos" id="numerodepisos" className={"form-control "} value={this.state.value}
                        onBlur={(e) => {
                            this.validateEmpty(e.target);
                        }}
                        onChange={(e) => {
                            this.validateEmpty(e.target);
                        }}
                >
                    <option value="">Seleccione</option>
                    {this.state.floors.map(option =>
                        <option key={option.floorCode} value={option.floorCode}>{option.answer}</option>
                    )}
                </select>
            </div>
        );
    }
}

export default Numerodepiso;



