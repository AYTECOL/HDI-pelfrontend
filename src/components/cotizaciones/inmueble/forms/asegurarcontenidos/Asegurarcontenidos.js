import React, {Component} from 'react';

import store from '../../../../../store';
import {saveInmuebleValue} from '../../../../../actions';
import Masknumbermoney from "../../../../../common/helpers/masknumbermoney/Masknumbermoney";
import Helpers from "../../../../../common/helpers/helpers/Helpers";

class Asegurarcontenidos extends Component {

    static nameModel = "contenidoasegudado";
    static nameModelValue = "contenidoasegudadovalor";

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
            let active = storeState.Inmueble.contenidoasegudado;
            let value = storeState.Inmueble.contenidoasegudadovalor;
            if (this.state.active !== active || this.state.value !== value) {
                if (this._isMounted) {
                    this.setState({
                        ...this.state,
                        value: value,
                        active: active,
                    });
                }
            }
        });
    }

    static name() {
        try {
            return store.getState().allInsurableLimits[2].description;
        } catch (e) {
            return "";
        }
    }

    //99000
    static min() {
        try {
            return store.getState().allInsurableLimits[2].min_value;
        } catch (e) {
            return 0;
        }
    }

    //1000000001
    static max() {
        try {
            return store.getState().allInsurableLimits[2].max_value;
        } catch (e) {
            return 0;
        }
    }

    static validateField(v) {
        let error = 0;
        v = Masknumbermoney.formatToNumber(v);
        if (v.length < 1) error = 1;
        if (error === 0) {
            if (v < Asegurarcontenidos.min()) {
                error = 2;
            } else if (v > Asegurarcontenidos.max()) {
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
        Helpers.removeClass(".contenidoasegudado", "error");
        Helpers.removeClass(".inmuebleasegudado", "error");
    };

    validateValue = (e) => {
        e = e.target;
        let error = Asegurarcontenidos.validateField(e.value);
        let format = Masknumbermoney.formatToMask(e.value);
        if (error === 0) Helpers.removeClass(".contenidoasegudadovalor", "error");
        store.dispatch(saveInmuebleValue({
            name: "contenidoasegudadovalor",
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
                <div className="col col-12  col-md-6">
                    <div className={"contenidoasegudado no-icon form-group " + this.state.error}>
                        <label htmlFor="doc-type-value">¿Deseas asegurar {Asegurarcontenidos.name()}? </label>
                        <ul className="select-item">
                            <li className={((this.state.active === 1) ? 'active' : '')}
                                onClick={this.validateEmpty({
                                    value: 1,
                                    name: Asegurarcontenidos.nameModel
                                })}
                            >Si
                            </li>
                            <li className={((this.state.active === 0) ? 'active' : '')}
                                onClick={this.validateEmpty({
                                    value: 0,
                                    name: Asegurarcontenidos.nameModel
                                })}
                            >No
                            </li>
                        </ul>
                    </div>
                </div>
                {(this.state.active === 1) ? (
                    <div className="col col-12  col-md-6">
                        <div
                            className={Asegurarcontenidos.nameModelValue + " form-group " + (this.state.errorValue !== 0 ? 'error' : '')}>
                            <label htmlFor={Asegurarcontenidos.nameModelValue}>Valor
                                de {Asegurarcontenidos.name()}</label>
                            <input name={Asegurarcontenidos.nameModelValue} id={Asegurarcontenidos.nameModelValue}
                                   type="text"
                                   className={"form-control"}
                                   value={this.state.value}
                                   placeholder=""
                                   onBlur={this.validateValue}
                                   onChange={this.validateValue}/>
                            <small
                                className={"form-text"}>Mínimo. {Masknumbermoney.formatToMask(Asegurarcontenidos.min())} -
                                Máximo. {Masknumbermoney.formatToMask(Asegurarcontenidos.max())}</small>
                            <small
                                className={"form-text only-errors default-error " + (this.state.errorValue === 1 ? 'show' : 'hide')}>Por
                                Ingrese el valor asegurado de Contenidos.
                            </small>
                            <small
                                className={"form-text only-errors " + (this.state.errorValue === 2 ? 'show' : 'hide')}>Valor
                                Asegurado de {Asegurarcontenidos.name()} es inferior al permitido.
                            </small>
                            <small
                                className={"form-text only-errors " + (this.state.errorValue === 3 ? 'show' : 'hide')}>Valor
                                Asegurado de {Asegurarcontenidos.name()} es superior al permitido.
                            </small>
                        </div>
                    </div>
                ) : ("")}
            </div>
        );
    }
}

export default Asegurarcontenidos;





