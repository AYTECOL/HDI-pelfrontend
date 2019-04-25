import React, {Component} from 'react';

import store from '../../../../../store';
import {saveInmuebleValue} from '../../../../../actionCreators';
import Masknumbermoney from "../../../../../common/helpers/masknumbermoney/Masknumbermoney";
import Helpers from "../../../../../common/helpers/helpers/Helpers";

class Asegurartelefonos extends Component {

    static nameModel = "inmuebleasegudadotelefonos";
    static nameModelValue = "inmuebleasegudadotelefonosvalor";

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
            let active = storeState.Inmueble.inmuebleasegudadotelefonos;
            let value = storeState.Inmueble.inmuebleasegudadotelefonosvalor;
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
            return store.getState().allInsurableLimits[6].description;
        } catch (e) {
            return "";
        }
    }

    //850000
    static min() {
        try {
            return store.getState().allInsurableLimits[6].min_value;
        } catch (e) {
            return 0;
        }
    }

    //10000001
    static max() {
        try {
            return store.getState().allInsurableLimits[6].max_value;
        } catch (e) {
            return 0;
        }
    }

    static validateField(v) {
        let error = 0;
        v = Masknumbermoney.formatToNumber(v);
        if (v.length < 1) error = 1;
        if (error === 0) {
            if (v < Asegurartelefonos.min()) {
                error = 2;
            } else if (v > Asegurartelefonos.max()) {
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

    validateEmpty(e) {
        store.dispatch(saveInmuebleValue(e));
        if (this._isMounted) {
            this.setState({
                ...this.state,
                active: e.value
            });
        }
        Helpers.removeClass(".inmuebleasegudadotelefonos", "error");
    }

    validateValue(e) {
        let error = Asegurartelefonos.validateField(e.value);
        let format = Masknumbermoney.formatToMask(e.value);
        if (error === 0) Helpers.removeClass(".inmuebleasegudadotelefonosvalor", "error");
        store.dispatch(saveInmuebleValue({
            name: Asegurartelefonos.nameModelValue,
            value: format,
        }));
        if (this._isMounted) {
            this.setState({
                ...this.state,
                errorValue: error,
                value: format
            });
        }
    }

    render() {
        return (
            <div className="row">
                <div className="col col-12 col-md-6">
                    <div className={"inmuebleasegudadotelefonos form-group " + this.state.error}>
                        <label htmlFor="doc-type-value">¿Adicionalmente deseas
                            asegurar {Asegurartelefonos.name()}? </label>
                        <ul className="select-item">
                            <li className={((this.state.active === 1) ? 'active' : '')}
                                onClick={(e) => {
                                    this.validateEmpty({
                                        value: 1,
                                        name: Asegurartelefonos.nameModel
                                    });
                                }}
                            >Si
                            </li>
                            <li className={((this.state.active === 0) ? 'active' : '')}
                                onClick={(e) => {
                                    this.validateEmpty({
                                        value: 0,
                                        name: Asegurartelefonos.nameModel
                                    });
                                }}
                            >No
                            </li>
                        </ul>
                    </div>
                </div>
                {(this.state.active === 1) ? (
                    <div className="col col-12 col-md-6">
                        <div
                            className={"inmuebleasegudadotelefonosvalor form-group " + (this.state.errorValue !== 0 ? 'error' : '')}>
                            <label htmlFor="inmuebleasegudadotelefonosvalor">Valor de {Asegurartelefonos.name()}</label>
                            <input name="inmuebleasegudadotelefonosvalor" id="inmuebleasegudadotelefonosvalor"
                                   type="text"
                                   value={this.state.value}
                                   className={"form-control"}
                                   placeholder=""
                                   onBlur={(e) => {
                                       this.validateValue(e.target);
                                   }}
                                   onChange={(e) => {
                                       this.validateValue(e.target);
                                   }}/>
                            <small
                                className={"form-text"}>Mínimo. {Masknumbermoney.formatToMask(Asegurartelefonos.min())} -
                                Máximo. {Masknumbermoney.formatToMask(Asegurartelefonos.max())}</small>
                            <small
                                className={"form-text only-errors default-error " + (this.state.errorValue === 1 ? 'show' : 'hide')}>Por
                                Ingrese el valor asegurado de Teléfonos Móviles.
                            </small>
                            <small
                                className={"form-text only-errors " + (this.state.errorValue === 2 ? 'show' : 'hide')}>Valor
                                Asegurado de {Asegurartelefonos.name()} es inferior al permitido.
                            </small>
                            <small
                                className={"form-text only-errors " + (this.state.errorValue === 3 ? 'show' : 'hide')}>Valor
                                Asegurado de {Asegurartelefonos.name()} es superior al permitido.
                            </small>
                        </div>
                    </div>
                ) : ("")}
                {(this.state.active === 1) ? (
                    <div className="col col-12 no-padding">
                        <div className="col col-12">
                            <div className="tool-tip info">
                                <p>Al momento de emitir la póliza ten a la mano el número IMEI de tu celular</p>
                            </div>
                            <div className="tool-tip info">
                                <p>El valor máximo por cada teléfono móvil es de $ 3.000.000</p>
                            </div>
                        </div>
                    </div>
                ) : ("")}
            </div>
        );
    }
}

export default Asegurartelefonos;



