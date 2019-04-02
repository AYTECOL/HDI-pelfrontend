import React, {Component} from 'react';

import store from '../../../../../store';
import {saveIdentificationValue} from '../../../../../actionCreators';

class Razonsocial extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            value: ""
        };
        store.subscribe(async () => {
            let storeState = store.getState();
            let value = storeState.cotizacion.identification.businessname;
            let disabledbusinessname = storeState.disabledbusinessname;
            if (this.state.value !== value || this.state.disabledbusinessname !== disabledbusinessname) {
                this.setState({
                    ...this.state,
                    value: value,
                    disabledName: disabledbusinessname,
                });
            }
        });
    }

    validateEmpty(e) {
        let error = false;
        if (e.value.length < 1) error = true;
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
                <label htmlFor="doc-type-value">Razón social</label>
                <input name="value" id="doc-type-value"
                       type="text"
                       value={this.state.value}
                       className={(this.state.disabledName ? "disabled " : "") + "form-control"}
                       disabled={this.state.disabledName === true ? 'true' : ''}
                       placeholder="Ingresa la razón social"
                       onChange={(e) => {
                           this.validateEmpty(e.target);
                       }}/>
            </div>
        );
    }
}

export default Razonsocial;



