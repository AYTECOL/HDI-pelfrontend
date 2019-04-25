import React, {Component} from 'react';

import store from '../../../../../store';
import {saveIdentificationValue} from '../../../../../actionCreators';
import Helpers from "../../../../../common/helpers/helpers/Helpers";

class Lastname extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            value: "",
            disabledLastName: false
        };
        store.subscribe(async () => {
            let storeState = store.getState();
            let lastname = storeState.cotizacion.identification.lastname;
            let disabledLastName = storeState.disabledLastName;
            if (this.state.value !== lastname || this.state.disabledName !== disabledLastName) {
                lastname = Helpers.toCapitalize(lastname);
                this.setState({
                    ...this.state,
                    value: lastname,
                    disabledLastName: disabledLastName
                });
            }
        });
    }

    static limit() {
        return 51;
    }

    validateEmpty(e) {
        e.value = Helpers.toCapitalize(e.value);
        let error = false;
        if (e.value.length < 1 || e.value.length > Lastname.limit()) error = true;
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
                <label htmlFor="lastname">Primer apellido</label>
                <input name="lastname" id="lastname"
                       type="text"
                       value={this.state.value}
                       disabled={this.state.disabledLastName === true}
                       autoComplete="lastname"
                       className={(this.state.disabledLastName ? "disabled " : "") + "form-control"}
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



