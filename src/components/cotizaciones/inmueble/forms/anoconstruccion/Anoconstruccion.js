import React, {Component} from 'react';

import store from '../../../../../store';
import {saveInmuebleValue} from '../../../../../actions';
import BuildYears from "../../../../../services/AllBuildYears";
import Helpers from "../../../../../common/helpers/helpers/Helpers";

class Anoconstruccion extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            value: "",
            years: []
        };
    }

    componentDidMount() {
        this.getYears();
        this.unsubscribe = store.subscribe(async () => {
            let storeState = store.getState();
            let value = storeState.Inmueble.anoconstruido;
            if (this.state.value !== value) {
                this.setState({
                    ...this.state,
                    value: value,
                });
            }
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    async getYears() {
        let years = await BuildYears.get();
        this.setState({
            ...this.state,
            years: years,
        });
    }

    validateEmpty = e => {
        if (e === 'notempty') return;
        e = e.target;
        let error = false;
        if (e.value.length < 1) error = true;
        if (error === false) Helpers.removeClass(".anoconstruido", "error");
        this.setState({
            ...this.state,
            error: error
        });
        let text = "";
        for (let i = 0; i < this.state.years.length; i++) {
            if (parseInt(e.value) === parseInt(this.state.years[i].buildYearCode)) {
                text = this.state.years[i].answer;
                break;
            }
        }
        store.dispatch(saveInmuebleValue(e));
        Helpers.updatePdfInfo({
            [e.name]: text
        });
    };

    render() {
        return (
            <div className={"anoconstruido input-select form-group " + (this.state.error ? 'error' : '')}>
                <label htmlFor="anoconstruido">Año en que fue construido inmueble</label>
                <select disabled={(this.state.disabled ? "disabled" : "")} name="anoconstruido" id="anoconstruido"
                        className={(this.state.disabled ? "disabled " : "") + "form-control"}
                        value={this.state.value}
                        onBlur={this.validateEmpty}
                        onChange={this.validateEmpty}>
                    <option value="">Selecciona</option>
                    {this.state.years.map(option =>
                        <option key={option.buildYearCode} value={option.buildYearCode}>{option.answer}</option>
                    )}
                </select>
            </div>
        );
    }
}

export default Anoconstruccion;



