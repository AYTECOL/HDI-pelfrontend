import React, {Component} from 'react';

import store from '../../../../../store';
import {saveIdentificationValue} from '../../../../../actions';

class Addressadditional extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            value: "",
        };
        store.subscribe(async () => {
            let storeState = store.getState();
            let value = storeState.cotizacion.identification.addressadditional;
            if (this.state.value !== value) {
                this.setState({
                    ...this.state,
                    value: value
                });
            }
        });
    }

    validateEmpty = e => {
        e = e.target;
        let error = false;
        if (e.value.length > 200) error = true;
        store.dispatch(saveIdentificationValue(e));
        this.setState({
            ...this.state,
            error: error,
            value: e.value
        });
    };

    render() {
        return (
            <div className={"form-group " + (this.state.error ? 'error' : '')}>
                <label htmlFor="addressadditional">Ingresa información adicional (opcional)</label>
                <input name="addressadditional" id="addressadditional"
                       type="text"
                       value={this.state.value}
                       autoComplete="addressadditional"
                       className={"form-control"}
                       placeholder="Ingresa la dirección"
                       onChange={this.validateEmpty}/>
                <small className="form-text text-muted">Ejemplo: Interior 6, apto 201</small>
            </div>
        );
    }
}

export default Addressadditional;



