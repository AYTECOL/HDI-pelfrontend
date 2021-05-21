import React, { Component } from "react";
import { connect } from "react-redux";

import store from "../../../../../store";
import { saveInmuebleValue } from "../../../../../actions";
import Helpers from "../../../../../common/helpers/helpers/Helpers";
import { years } from "./constants";

class Refuerzoestructural extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            errorselect: false,
            years: []
        };
    }

    validateEmpty = (e) => (event) => {
        let error = false;
        if (e.value.length < 1) error = true;
        store.dispatch(saveInmuebleValue(e));
        this.setState({
            ...this.state,
            error: error,
            active: e.data
        });
    };

    saveValue = (e) => async (event) => {
        e.value = event.target.value;
        let error = false;
        if (e.value.length < 1) error = true;
        if (error === false) Helpers.removeClass(".anorefuerzo", "error");
        await store.dispatch((dispatch) => {
            dispatch(saveInmuebleValue(e));
            return Promise.resolve();
        });
        if (this.state.error !== error)
            this.setState({
                errorselect: error
            });
    };

    render() {
        const { show, error, value, errorselect, valueOther } = this.props;
        if (show === false) return <div className="hide">&nbsp;</div>;
        return (
            <div className="row no-gutters">
                <div className="col col-6">
                    <div className={"form-group " + error}>
                        <label htmlFor="doc-type-value">Cuenta con refuerzos estructurales</label>
                        <ul className="select-item">
                            <li
                                className={value === 1 ? "active" : ""}
                                onClick={this.validateEmpty({
                                    data: 1,
                                    value: 1,
                                    name: "refuerzo"
                                })}
                            >
                                Si
                            </li>
                            <li
                                className={value === 2 ? "active" : ""}
                                onClick={this.validateEmpty({
                                    data: 2,
                                    value: 2,
                                    name: "refuerzo"
                                })}
                            >
                                No
                            </li>
                        </ul>
                    </div>
                </div>
                {value === 1 ? (
                    <div className="col col-6">
                        <div className={"anorefuerzo input-select form-group " + (errorselect ? "error" : "")}>
                            <label htmlFor="anorefuerzo">En qué año se hizo el refuerzo estructural</label>
                            <select
                                className="anorefuerzo form-control"
                                id="anorefuerzo"
                                name="anorefuerzo"
                                value={valueOther}
                                onChange={this.saveValue({
                                    value: "",
                                    name: "anorefuerzo"
                                })}
                            >
                                <option value="">Selecciona el año</option>
                                {years.map(({ id, text }) => (
                                    <option value={id}>{text}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                ) : (
                    ""
                )}
            </div>
        );
    }
}

export default connect(({ Inmueble }) => {
    let anoconstruido = Inmueble.anoconstruido;
    let value = Inmueble.refuerzo;
    let valueOther = Inmueble.anorefuerzo;
    let show = false;
    if (anoconstruido < 500008) {
        show = true;
    }
    if (anoconstruido === "") {
        show = false;
    }
    return {
        anoconstruido,
        show,
        value,
        valueOther
    };
})(Refuerzoestructural);
