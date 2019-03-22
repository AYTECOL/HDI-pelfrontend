import React, { Component } from 'react';

import store from '../../../../../store';
import { saveIdentificationValue } from '../../../../../actionCreators';

class Name extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            value: "",
        };
        store.subscribe(async () => {
            let storeState = store.getState();
            let value = storeState.cotizacion.identification.name;
            if (this.state.value != value ) {
                this.setState({
                    ...this.state,
                    value: value
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
                <label htmlFor="name">Primer nombre</label>
                <input name="name" id="name"
                       type="text"
                       value={this.state.value}
                       className={"form-control"}
                       placeholder="Ingresa primer nombre"
                       onChange={(e) => {
                           this.validateEmpty(e.target);
                       }}/>
            </div>
        );
    }
}

export default Name;



