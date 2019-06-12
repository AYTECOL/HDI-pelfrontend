import React, {Component} from 'react';

import store from '../../../../../store';
import {saveIdentificationValue, updateTypeDoc} from '../../../../../actions';
import Identifications from '../../../../../services/Identifications';
import Loading from "../../../../globals/loading/Loading";
import Helpers from "../../../../../common/helpers/helpers/Helpers";

class TipoDocumento extends Component {

    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            value: "",
            options: {identifications: []},
            error: false,
            stateForm: 0,
            disabled: typeof this.props.disabled === "undefined" ? false : this.props.disabled,
            docType: 1,
        };
        store.subscribe(() => {
            let storeState = store.getState();
            let newState = storeState.stateFormIdentificacion;
            let disabled = false;
            if (newState !== 0) disabled = true;
            if (this.state.stateForm !== newState) {
                if (this._isMounted) {
                    this.setState({
                        ...this.state,
                        stateForm: newState,
                        disabled: disabled
                    });
                }
            }
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        Loading.toggle(true);
        this.getOptions();
    }

    async getOptions() {
        this.setState({
            ...this.state,
            options: await Identifications.get()
        });
        Loading.toggle(false);
    }

    validateEmpty = e => {
        e = e.target;
        if (e.value.length < 1) {
            if (this._isMounted) {
                this.setState({
                    ...this.state,
                    error: true
                })
            }
        }
        let type = e.selectedOptions[0].getAttribute("data");
        let typeDocument = 1;
        if (type === "Jurídica") typeDocument = 2;
        store.dispatch(saveIdentificationValue(e));
        store.dispatch(updateTypeDoc(typeDocument));
        let text = "";
        for (let i = 0; i < this.state.options.identifications.length; i++) {
            if( parseInt(this.state.options.identifications[i].code) === parseInt(e.value) ){
                text = this.state.options.identifications[i].description;
                break;
            }
        }
        Helpers.updatePdfInfo({
            'doc_type': text
        });
        if (this._isMounted) {
            this.setState({
                ...this.state,
                value: e.value
            });
        }
    };

    render() {
        return (
            <div className={"form-group input-select " + this.state.error}>
                <label htmlFor="doc-type">Tipo de identificación</label>
                <select
                    disabled={(typeof this.props.disabled === "undefined" ? this.state.disabled : this.props.disabled ? "disabled" : "")}
                    name="code" id="doc-type"
                    className={((typeof this.props.disabled === "undefined" ? this.state.disabled : this.props.disabled) ? "disabled " : "") + "form-control"}
                    value={typeof this.props.value === "undefined" ? this.state.value : this.props.value}
                    onChange={typeof this.props.onChange === "undefined" ? this.validateEmpty : this.props.onChange}>
                    {this.state.options.identifications.map(option =>
                        <option key={option.code} value={option.code}
                                data={option.type_person}>{option.description}</option>
                    )}
                </select>
            </div>
        );
    }
}

export default TipoDocumento;



