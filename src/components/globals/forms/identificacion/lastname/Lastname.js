import React, { Component } from 'react';

import store from '../../../../../store';
import { saveIdentificationValue } from '../../../../../actionCreators';

class Lastname extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            value: "",
        };
        store.subscribe(async () => {
            let storeState = store.getState();
            let lastname = storeState.cotizacion.identification.lastname;
            if (this.state.value != lastname ) {
                this.setState({
                    ...this.state,
                    value: lastname
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
            value: e.value
        });
        store.dispatch(saveIdentificationValue(e));
    }

    render() {
        return (
            <div className={"form-group " + (this.state.error?'error':'')}>
                <label htmlFor="lastname">Primer apellido</label>
                <input name="lastname" id="lastname"
                       type="text"
                       value={this.state.value}
                       autoComplete="lastname"
                       className={"form-control"}
                       placeholder="Ingresa primer apellido"
                       onBlur={(e) => {
                           this.validateEmpty(e.target);
                       }}
                       onChange={(e) => {
                           this.validateEmpty(e.target);
                       }}/>
            </div>
        );
    }
}

export default Lastname;



