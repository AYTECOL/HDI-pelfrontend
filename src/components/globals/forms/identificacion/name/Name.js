import React, {Component} from 'react';

import store from '../../../../../store';
import {saveIdentificationValue} from '../../../../../actionCreators';

import Helpers from '../../../../../common/helpers/helpers/Helpers';

class Name extends Component {

    static limit() {
        return 51;
    }

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            value: "",
            disabledName: false,
        };
        store.subscribe(async () => {
            let storeState = store.getState();
            let value = storeState.cotizacion.identification.name;
            let disabledName = storeState.disabledName;
            if (this.state.value !== value || this.state.disabledName !== disabledName) {
                value = Helpers.toCapitalize(value);
                this.setState({
                    ...this.state,
                    value: value,
                    disabledName: disabledName,
                });
            }
        });
    }

    validateEmpty(e) {
        e.value = Helpers.toCapitalize(e.value);
        let error = false;
        if (e.value.length < 1 || e.value.length > Name.limit()) error = true;
        store.dispatch(saveIdentificationValue(e));
        this.setState({
            ...this.state,
            error: error,
            value: e.value
        });
    }

    render() {
        return (
            <div className={"form-group " + (this.state.error ? 'error' : '')}>
                <label htmlFor="name">Primer nombre</label>
                <input name="name" id="name"
                       type="text"
                       value={this.state.value}
                       className={(this.state.disabledName ? "disabled " : "") + "form-control"}
                       disabled={this.state.disabledName === true ? 'true' : ''}
                       placeholder="Ingresa primer nombre"
                       onChange={(e) => {
                           this.validateEmpty(e.target);
                       }}/>
            </div>
        );
    }
}

export default Name;



