import React, { Component } from 'react';

import store from '../../../../../store';
import { saveIdentificationValue } from '../../../../../actionCreators';

class Addressadditional extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false
        };
    }

    validateEmpty(e){
        store.dispatch(saveIdentificationValue(e));
    }

    render() {
        return (
            <div className={"form-group " + this.state.error}>
                <label htmlFor="addressadditional">Ingresa información adicional (opcional)</label>
                <input name="addressadditional" id="addressadditional"
                       type="text"
                       autoComplete="addressadditional"
                       className={"form-control"}
                       placeholder="Ingresa la dirección"
                       onChange={(e) => {
                           this.validateEmpty(e.target);
                       }}/>
                <small className="form-text text-muted">Ejemplo: Interior 6, apto 201</small>
            </div>
        );
    }
}

export default Addressadditional;



