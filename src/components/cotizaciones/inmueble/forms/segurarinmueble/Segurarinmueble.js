import React, {Component} from 'react';

import store from '../../../../../store';
import {saveInmuebleValue} from '../../../../../actions';

import Masknumbermoney from '../../../../../common/helpers/masknumbermoney/Masknumbermoney';
import Helpers from "../../../../../common/helpers/helpers/Helpers";

class Segurarinmueble extends Component {

    static nameModel = "inmuebleasegudado";
    static nameModelValue = "inmuebleasegudadovalor";

    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            show: false,
            active: 1,
            errorValue: 0,
            value: "",
        };

        store.subscribe(async () => {
            let storeState = store.getState();
            let active = storeState.Inmueble.inmuebleasegudado;
            let value = storeState.Inmueble.inmuebleasegudadovalor;
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
            return store.getState().allInsurableLimits[1].description;
        } catch (e) {
            return "";
        }
    }

    static min() {
        try {
            return store.getState().allInsurableLimits[1].min_value;
        } catch (e) {
            return 0;
        }
    }

    static max() {
        try {
            return store.getState().allInsurableLimits[1].max_value;
        } catch (e) {
            return 0;
        }
    }

    static validateField(v) {
        let error = 0;
        v = Masknumbermoney.formatToNumber(v);
        if (v.length < 1) error = 1;
        if (error === 0) {
            if (v < Segurarinmueble.min()) {
                error = 2;
            } else if (v > Segurarinmueble.max()) {
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
        Helpers.removeClass(".contenidoasegudado", "error");
        Helpers.removeClass(".inmuebleasegudado", "error");
    };

    validateValue = e => {
        e = e.target;
        let error = Segurarinmueble.validateField(e.value);
        if (error === 0) Helpers.removeClass("."+Segurarinmueble.nameModelValue, "error");
        let format = Masknumbermoney.formatToMask(e.value);
        store.dispatch(saveInmuebleValue({
            name: Segurarinmueble.nameModelValue,
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
                    <div className={"inmuebleasegudado no-icon form-group " + this.state.error}>
                        <label htmlFor="doc-type-value">¿Deseas asegurar {Segurarinmueble.name()}? </label>
                        <ul className="select-item">
                            <li className={((this.state.active === 1) ? 'active' : '')}
                                onClick={this.validateEmpty({
                                    value: 1,
                                    name: Segurarinmueble.nameModel
                                })}
                            >Si
                            </li>
                            <li className={((this.state.active === 0) ? 'active' : '')}
                                onClick={this.validateEmpty({
                                    value: 0,
                                    name: Segurarinmueble.nameModel
                                })}
                            >No
                            </li>
                        </ul>
                    </div>
                </div>
                {(this.state.active === 1) ? (
                    <div className="col col-12 col-md-6">
                        <div
                            className={Segurarinmueble.nameModelValue + " form-group " + (this.state.errorValue !== 0 ? 'error' : '')}>
                            <label htmlFor="doc-type-value">Valor del inmueble</label>
                            <input name="value" id="doc-type-value"
                                   type="text"
                                   className={"form-control"}
                                   placeholder=""
                                   value={this.state.value}
                                   onBlur={this.validateValue}
                                   onChange={this.validateValue}/>
                            <small
                                className={"form-text"}>Mínimo. {Masknumbermoney.formatToMask(Segurarinmueble.min())} -
                                Máximo. {Masknumbermoney.formatToMask(Segurarinmueble.max())}</small>
                            <small
                                className={"form-text only-errors " + (this.state.errorValue === 1 ? 'show' : 'hide')}>Por favor Ingrese el valor asegurado de Inmueble.
                            </small>
                            <small
                                className={"form-text only-errors " + (this.state.errorValue === 2 ? 'show' : 'hide')}>Valor
                                asegurado del {Segurarinmueble.name()} es inferior al permitido.
                            </small>
                            <small
                                className={"form-text only-errors " + (this.state.errorValue === 3 ? 'show' : 'hide')}>Valor
                                asegurado del {Segurarinmueble.name()} es superior al permitido.
                            </small>
                        </div>
                    </div>
                ) : ("")}
            </div>
        );
    }
}

export default Segurarinmueble;



