import React, {Component} from 'react';

import store from '../../../../../store';
import {saveInmuebleValue} from '../../../../../actionCreators';

class Anoconstruccion extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false
        };
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
            <div className={"input-select form-group " + (this.state.error?'error':'')}>
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
                    <option value="1">Antes de 1963</option>
                    <option value="2">1963-1977</option>
                    <option value="3">1978-1984</option>
                    <option value="4">1985-1997</option>
                    <option value="5">1998-2010</option>
                    <option value="5">2011 en adelante</option>
                </select>
            </div>
        );
    }
}

export default Anoconstruccion;



