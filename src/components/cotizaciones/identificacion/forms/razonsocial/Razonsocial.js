import React, {Component} from 'react';

import store from '../../../../../store';
import {saveIdentificationValue} from '../../../../../actions';
import Helpers from "../../../../../common/helpers/helpers/Helpers";

class Razonsocial extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            value: "",
            disabledbusinessname: false
        };
        store.subscribe(async () => {
            let storeState = store.getState();
            let value = Helpers.toCapitalize(storeState.cotizacion.identification.businessname);
            let disabledbusinessname = storeState.disabledbusinessname;
            if (Helpers.toCapitalize(this.state.value) !== value || this.state.disabledbusinessname !== disabledbusinessname) {
                this.setState({
                    ...this.state,
                    value: value,
                    disabledbusinessname: disabledbusinessname,
                });
            }
        });
    }

    static limit() {
        return 61;
    }

    validateEmpty = e => {
        e = e.target;
        e.value = Helpers.toCapitalize(e.value);
        let error = false;
        if (e.value.length < 1 || e.value.length > Razonsocial.limit()) error = true;
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
                <label htmlFor="businessname">Razón social</label>
                <input name="businessname" id="businessname"
                       type="text"
                       value={this.state.value}
                       className={(this.state.disabledbusinessname ? "disabled " : "") + "form-control"}
                       disabled={this.state.disabledbusinessname === true}
                       placeholder="Ingresa la razón social"
                       onChange={this.validateEmpty}/>
            </div>
        );
    }
}

export default Razonsocial;



