import React, { Component } from 'react';

import store from '../../../../../store';
import { saveIdentificationValue } from '../../../../../actionCreators';

class Lastname extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false
        };
    }

    validateEmpty(e){
        if ( e.value.length < 1 ){
            this.setState({
                ...this.state,
                error: true
            });
        }
        store.dispatch(saveIdentificationValue(e));
    }

    render() {
        return (
            <div className={"form-group " + (this.state.error?'error':'')}>
                <label htmlFor="doc-type-value">Primer apellido</label>
                <input name="value" id="doc-type-value"
                       type="text"
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



