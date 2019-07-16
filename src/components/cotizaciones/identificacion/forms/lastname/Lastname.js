import React, {Component} from 'react';

import store from '../../../../../store';
import {saveIdentificationValue} from '../../../../../actions';
import Helpers from "../../../../../common/helpers/helpers/Helpers";

class Lastname extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            value: ""
        };
    }

    static toggleDisable(status) {
        if (status === true) {
            Helpers.disabled('#lastname');
        } else {
            Helpers.enabled('#lastname');
        }
    }

    static limit() {
        return 51;
    }

    componentDidMount() {
        this.unsubscribe = store.subscribe(async () => {
            let storeState = store.getState();
            let lastname = Helpers.toCapitalize(storeState.cotizacion.identification.lastname);
            if (this.state.value !== lastname) {
                this.setState({
                    ...this.state,
                    value: lastname
                });
            }
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    validateEmpty = e => {
        e = e.target;
        e.value = Helpers.toCapitalize(e.value);
        let error = false;
        if (e.value.length < 1 || e.value.length > Lastname.limit()) error = true;
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
                <label htmlFor="lastname">Primer apellido</label>
                <input name="lastname" id="lastname"
                       type="text"
                       value={this.state.value}
                       autoComplete="lastname"
                       className={"form-control"}
                       placeholder="Ingresa primer apellido"
                       onBlur={this.validateEmpty}
                       onChange={this.validateEmpty}/>
            </div>
        );
    }
}

export default Lastname;



