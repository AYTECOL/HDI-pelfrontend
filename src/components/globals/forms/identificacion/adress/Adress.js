import React, { Component } from 'react';

import store from '../../../../../store';
import {saveIdentificationValue, reqAddress, mapShow} from '../../../../../actionCreators';

class Adress extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            address: "",
            disabled: true,
            city: ""
        };
        store.subscribe(async () => {
            let storeState = store.getState();
            let address = storeState.cotizacion.identification.address;
            let city = storeState.cotizacion.identification.city;
            let disabled = true;
            if (this.state.address != address || this.state.city != city ) {
                if ( city != "" ) disabled = false;
                this.setState({
                    ...this.state,
                    address: address,
                    city: city,
                    disabled: disabled
                });
            }
        });
    }

    validateEmpty(e){
        let error = false;
        if ( e.value.length < 1 ) error = true;
        this.setState({
            ...this.state,
            error: error,
            address: e.value
        });
        store.dispatch(saveIdentificationValue(e));
    }

    render() {
        return (
            <div className={"form-group " + (this.state.error?'error':'')}>
                <label htmlFor="address">Dirección del hogar</label>
                <input name="address" id="address"
                       type="text"
                       value={this.state.address}
                       className={"form-control "+ (this.state.disabled?'disabled':'')}
                       placeholder="Ingresa la dirección"
                       autoComplete="address"
                       autoCorrect="off"
                       autoCapitalize="none"
                       disabled={(this.state.disabled)?'disabled':''}
                       onBlur={(e) => {
                           this.validateEmpty(e.target);
                       }}
                       onChange={(e) => {
                           this.validateEmpty(e.target);
                       }}/>
                <small className="form-text text-muted">Ejemplo: Calle 143Bis # 23 a 34</small>
            </div>
        );
    }
}

export default Adress;



