import React, {Component} from 'react';

import store from '../../../../../store';
import {saveInmuebleValue} from '../../../../../actions';
import Masknumbermoney from "../../../../../common/helpers/masknumbermoney/Masknumbermoney";
import Helpers from "../../../../../common/helpers/helpers/Helpers";

class Asegurarobras extends Component {

    static nameModel = "inmuebleasegudadoobras";
    static nameModelValue = "inmuebleasegudadoobrasvalor";

    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            show: false,
            active: 0,
            errorValue: 0,
            value: ""
        };

        store.subscribe(async () => {
            let storeState = store.getState();
            let active = storeState.Inmueble.inmuebleasegudadoobras;
            let value = storeState.Inmueble.inmuebleasegudadoobrasvalor;
            if (this.state.active !== active || this.state.value !== value) {
                if (this._isMounted) {
                    this.setState({
                        ...this.state,
                        active: active,
                        value: value,
                    });
                }
            }
        });
    }

    static name() {
        try {
            return store.getState().allInsurableLimits[3].description;
        } catch (e) {
            return "";
        }
    }

    //0
    static min() {
        try {
            return store.getState().allInsurableLimits[3].min_value;
        } catch (e) {
            return 0;
        }
    }

    //600000001
    static max() {
        try {
            return store.getState().allInsurableLimits[3].max_value;
        } catch (e) {
            return 0;
        }
    }

    static validateField(v) {
        let error = 0;
        v = Masknumbermoney.formatToNumber(v);
        if (v.length < 1) error = 1;
        if (error === 0) {
            if (v < Asegurarobras.min()) {
                error = 2;
            } else if (v > Asegurarobras.max()) {
                error = 3;
            }
        }
        return error;
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    validateEmpty = e => event => {
        store.dispatch(saveInmuebleValue(e));
        if (this._isMounted) {
            this.setState({
                ...this.state,
                active: e.value
            });
        }
        Helpers.removeClass(".inmuebleasegudadoobras", "error");
    };

    validateValue = e => {
        e = e.target;
        let error = Asegurarobras.validateField(e.value);
        let format = Masknumbermoney.formatToMask(e.value);
        if (error === 0) Helpers.removeClass(".inmuebleasegudadoobrasvalor", "error");
        store.dispatch(saveInmuebleValue({
            name: Asegurarobras.nameModelValue,
            value: format,
        }));
        if (this._isMounted) {
            this.setState({
                ...this.state,
                errorValue: error,
                value: format
            });
        }
    };

    render() {
        return (
            <div className="row">
                <div className="col col-12 col-md-6">
                    <div className={"inmuebleasegudadoobras no-icon form-group " + this.state.error}>
                        <label htmlFor="doc-type-value">¿Adicionalmente deseas asegurar {Asegurarobras.name()}? </label>
                        <ul className="select-item">
                            <li className={((this.state.active === 1) ? 'active' : '')}
                                onClick={this.validateEmpty({
                                    value: 1,
                                    name: Asegurarobras.nameModel
                                })}
                            >Si
                            </li>
                            <li className={((this.state.active === 0) ? 'active' : '')}
                                onClick={this.validateEmpty({
                                    value: 0,
                                    name: Asegurarobras.nameModel
                                })}
                            >No
                            </li>
                        </ul>
                    </div>
                </div>
                {(this.state.active === 1) ? (
                    <div className="col col-12 col-md-6">
                        <div
                            className={"inmuebleasegudadoobrasvalor form-group " + (this.state.errorValue !== 0 ? 'error' : '')}>
                            <label htmlFor="inmuebleasegudadoobrasvalor">Valor de las {Asegurarobras.name()}</label>
                            <input name={Asegurarobras.nameModelValue} id={Asegurarobras.nameModelValue}
                                   type="text"
                                   value={this.state.value}
                                   className={"form-control"}
                                   placeholder=""
                                   onBlur={this.validateValue}
                                   onChange={this.validateValue}/>
                            <small
                                className={"form-text"}>Máximo. {Masknumbermoney.formatToMask(Asegurarobras.max())}</small>
                            <small
                                className={"form-text only-errors default-error " + (this.state.errorValue === 1 ? 'show' : 'hide')}>Por
                                favor Ingrese el valor asegurado de Obras de Arte.
                            </small>
                            <small
                                className={"form-text only-errors " + (this.state.errorValue === 2 ? 'show' : 'hide')}>Valor
                                Asegurado de {Asegurarobras.name()} de Arte es inferior al permitido.
                            </small>
                            <small
                                className={"form-text only-errors " + (this.state.errorValue === 3 ? 'show' : 'hide')}>Valor
                                Asegurado de {Asegurarobras.name()} de Arte es superior al permitido.
                            </small>
                        </div>
                    </div>
                ) : ("")}
            </div>
        );
    }
}

export default Asegurarobras;



