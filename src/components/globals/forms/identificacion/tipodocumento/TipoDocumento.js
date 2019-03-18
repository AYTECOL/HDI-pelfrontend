import React, { Component } from 'react';

import store from '../../../../../store';
import {continueButtonDisable, saveIdentificationValue} from '../../../../../actionCreators';
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
            stateForm: 1,
        };

        this.getOptions();

        store.subscribe(() => {
            let storeState = store.getState();
            this.setState({
                ...this.state,
                stateForm: storeState.stateForm,
            });
        });
    }

    validateEmpty(e){
        if ( e.value.length < 1 ){
            this.setState({
                ...this.state,
                error: true
            })
        }
        store.dispatch(saveIdentificationValue(e));
        this.setState({
            ...this.state,
            value: e.value
        });
    }

    async getOptions(){
        this.setState({
            ...this.state,
            options: await Identifications.get()
        });
    }

    render() {
        return (
            <div className={"form-group input-select " + this.state.error}>
                <label htmlFor="doc-type">Tipo de identificación</label>
                <select disabled={(this.props.disabled ? "disabled" : "")} name="code" id="doc-type"
                        className={(this.props.disabled ? "disabled " : "") + "form-control"}
                        value={this.state.value}
                        onChange={(e) => {
                            this.validateEmpty(e.target);
                        }}>
                    {this.state.options.identifications.map(option =>
                        <option key={option.code}
                                value={option.code}>{option.description}</option>
                    )}
                </select>
            </div>
        );
    }
}

export default TipoDocumento;



