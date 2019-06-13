import React, {Component} from 'react';

import store from '../../../../../store';
import {saveInmuebleValue} from '../../../../../actions';
import Helpers from "../../../../../common/helpers/helpers/Helpers";

class Refuerzoestructural extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            anoconstruido: "",
            show: false,
            active: 0,
            errorselect: false,
            valueOther: "",
            years: []
        };

        this.getYears();

        store.subscribe(async () => {
            let storeState = store.getState();
            let anoconstruido = storeState.Inmueble.anoconstruido;
            let value = storeState.Inmueble.refuerzo;
            let valueOther = storeState.Inmueble.anorefuerzo;
            let show = false;
            if (
                (this.state.anoconstruido !== anoconstruido && anoconstruido !== "") ||
                this.state.active !== value ||
                this.state.valueOther !== valueOther
            ) {
                if (anoconstruido < 500008) {
                    show = true;
                }
                if (anoconstruido === "") {
                    show = false;
                }
                this.setState({
                    ...this.state,
                    anoconstruido: anoconstruido,
                    show: show,
                    active: value,
                    valueOther: valueOther
                });
            }
        });
    }

    async getYears() {
        // let years = await BuildYears.get();
        // this.setState({
        //     ...this.state,
        //     years: years,
        // });
    }

    validateEmpty = e => event => {
        let error = false;
        if (e.value.length < 1) error = true;
        store.dispatch(saveInmuebleValue(e));
        this.setState({
            ...this.state,
            error: error,
            active: e.data
        });
    };

    saveValue = e => event => {
        e.value = event.target.value;
        let error = false;
        if (e.value.length < 1) error = true;
        if (error === false) Helpers.removeClass(".anorefuerzo", "error");
        store.dispatch(saveInmuebleValue(e));
        let text = "";
        if (parseInt(e.value) === 1) text = "1985-1997";
        if (parseInt(e.value) === 2) text = "1998-2010";
        if (parseInt(e.value) === 3) text = "2011 en adelante";
        Helpers.updatePdfInfo({
            [e.name]: text
        });
        this.setState({
            ...this.state,
            errorselect: error,
            valueOther: e.value
        });
    };

    render() {
        if (this.state.show === false) return <div className="hide">&nbsp;</div>;
        return (
            <div className="row no-gutters">
                <div className="col col-6">
                    <div className={"form-group " + this.state.error}>
                        <label htmlFor="doc-type-value">Cuenta con refuerzos estructurales</label>
                        <ul className="select-item">
                            <li className={(this.state.active === 1) ? 'active' : ''}
                                onClick={this.validateEmpty({
                                    data: 1,
                                    value: 1,
                                    name: "refuerzo"
                                })}
                            >Si
                            </li>
                            <li className={(this.state.active === 2) ? 'active' : ''}
                                onClick={this.validateEmpty({
                                    data: 2,
                                    value: 2,
                                    name: "refuerzo"
                                })}
                            >No
                            </li>
                        </ul>
                    </div>
                </div>
                {(this.state.active === 1) ? (
                    <div className="col col-6">
                        <div
                            className={"anorefuerzo input-select form-group " + (this.state.errorselect ? 'error' : '')}>
                            <label htmlFor="anorefuerzo">En qué año se hizo el refuerzo estructural</label>
                            <select className="anorefuerzo form-control"
                                    name="anorefuerzo"
                                    value={this.state.valueOther}
                                    onChange={this.saveValue({
                                        value: "",
                                        name: "anorefuerzo"
                                    })}>
                                <option value="">Selecciona el año</option>
                                <option value="1">1985-1997</option>
                                <option value="2">1998-2010</option>
                                <option value="3">2011 en adelante</option>
                            </select>
                        </div>
                    </div>
                ) : ("")}
            </div>
        );
    }
}

export default Refuerzoestructural;



