import React, { Component } from 'react';

import store from '../../../../../store';
import {saveIdentificationValue, reqAddress, mapShow} from '../../../../../actionCreators';

class Adress extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            address: ""
        };
        store.subscribe(async () => {
            let storeState = store.getState();
            let address = storeState.cotizacion.identification.address;
            if (this.state.address != address) {
                this.setState({
                    ...this.state,
                    address: address
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
                       className={"form-control"}
                       placeholder="Ingresa la dirección"
                       autoComplete="address"
                       autoCorrect="off"
                       autoCapitalize="none"
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



