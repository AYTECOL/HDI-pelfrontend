import React, {Component} from 'react';

import store from '../../../../../store';
import {saveIdentificationValue, updateTypeDoc} from '../../../../../actions';
import Identifications from '../../../../../services/Identifications';

class TipoDocumento extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: "",
            options: {
                identifications: []
            },
            error: false,
            stateForm: 0,
            disabled: false,
            docType: 1,
        };

        this.getOptions();

        store.subscribe(() => {
            let storeState = store.getState();
            let newState = storeState.stateFormIdentificacion;
            let disabled = false;
            if (newState !== 0) disabled = true;
            if (this.state.stateForm !== newState) {
                this.setState({
                    ...this.state,
                    stateForm: newState,
                    disabled: disabled
                });
            }
        });
    }

    validateEmpty(e) {
        if (e.value.length < 1) {
            this.setState({
                ...this.state,
                error: true
            })
        }
        let type = e.selectedOptions[0].getAttribute("data");
        let typeDocument = 1;
        if (type === "Jurídica") typeDocument = 2;
        store.dispatch(saveIdentificationValue(e));
        store.dispatch(updateTypeDoc(typeDocument));
        this.setState({
            ...this.state,
            value: e.value
        });
    }

    async getOptions() {
        this.setState({
            ...this.state,
            options: await Identifications.get()
        });
    }

    render() {
        return (
            <div className={"form-group input-select " + this.state.error}>
                <label htmlFor="doc-type">Tipo de identificación</label>
                <select disabled={(this.state.disabled ? "disabled" : "")} name="code" id="doc-type"
                        className={(this.state.disabled ? "disabled " : "") + "form-control"}
                        value={this.state.value}
                        onChange={(e) => {
                            this.validateEmpty(e.target);
                        }}>
                    {this.state.options.identifications.map(option =>
                        <option key={option.code}
                                value={option.code} data={option.type_person}>{option.description}</option>
                    )}
                </select>
            </div>
        );
    }
}

export default TipoDocumento;



