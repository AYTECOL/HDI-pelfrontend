import React, { Component } from 'react';

import store from '../../../../../store';
import { saveIdentificationValue, reqAddress } from '../../../../../actionCreators';

class Adress extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false
        };
    }

    validateEmpty(e){
        let error = false;
        if ( e.value.length < 1 ) error = true;
        this.setState({
            ...this.state,
            error: error
        });
        store.dispatch(saveIdentificationValue(e));
    }

    render() {
        return (
            <div className={"form-group " + (this.state.error?'error':'')}>
                <label htmlFor="address">Dirección del hogar</label>
                <input name="address" id="address"
                       type="text"
                       className={"form-control"}
                       placeholder="Ingresa la dirección"
                       onBlur={(e) => {
                           this.validateEmpty(e.target);
                           store.dispatch(reqAddress(e.target));
                       }}
                       onChange={(e) => {
                           //this.validateEmpty(e.target);
                       }}/>
                <small className="form-text text-muted">Ejemplo: Calle 143Bis # 23 a 34</small>
            </div>
        );
    }
}

export default Adress;



