import React, { Component } from 'react';

import store from '../../../../../store';
import { saveIdentificationValue } from '../../../../../actionCreators';

class Razonsocial extends Component {

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
            <div className={"form-group " + this.state.error}>
                <label htmlFor="doc-type-value">Razón social</label>
                <input name="value" id="doc-type-value"
                       type="text"
                       className={"form-control"}
                       placeholder="Ingresa la razón social"
                       onChange={(e) => {
                           this.validateEmpty(e.target);
                       }}/>
            </div>
        );
    }
}

export default Razonsocial;



