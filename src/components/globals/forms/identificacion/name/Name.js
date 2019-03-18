import React, { Component } from 'react';

import store from '../../../../../store';
import { saveIdentificationValue } from '../../../../../actionCreators';

class Name extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false
        };
    }

    validateEmpty(e){
        let error = false;
        if ( e.value.length < 1 ){
            this.setState({
                ...this.state,
                error: true
            })
        }else{

        }
        store.dispatch(saveIdentificationValue(e));
    }

    render() {
        return (
            <div className={"form-group " + (this.state.error?'error':'')}>
                <label htmlFor="doc-type-value">Primer nombre</label>
                <input name="value" id="doc-type-value"
                       type="text"
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



