import React, {Component} from 'react';

import store from '../../../../../store';
import {saveInmuebleValue} from '../../../../../actionCreators';

import Masknumbermoney from '../../../../../common/helpers/masknumbermoney/Masknumbermoney';

class Segurarinmueble extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            show: false,
            active: 1,
            min: 1000000,
            max: 4000000001,
            errorValue: 0,
            value: ""
        };

        store.subscribe(async () => {
            let storeState = store.getState();
            let active = storeState.Inmueble.inmuebleasegudado;
            let value = storeState.Inmueble.inmuebleasegudadovalor;
            if (this.state.active !== active || this.state.value !== value) {
                this.setState({
                    ...this.state,
                    active: active,
                    value: value,
                });
            }
        });
    }

    validateEmpty(e) {
        store.dispatch(saveInmuebleValue(e));
        this.setState({
            ...this.state,
            active: e.data
        });
    }

    validateValue(e) {
        let error = 0;
        let v = Masknumbermoney.formatToNumber(e.value);
        if (v.length < 1) error = 1;
        if (error === 0) {
            if (v <= this.state.min) {
                error = 2;
            } else if (v >= this.state.max) {
                error = 3;
            }
        }

        let format = Masknumbermoney.formatToMask(v);
        store.dispatch(saveInmuebleValue({
            name: "inmuebleasegudadovalor",
            value: format,
        }));
        this.setState({
            ...this.state,
            errorValue: error,
            value: format
        });
    }

    render() {
        return (
            <div className="row">
                <div className="col col-12 col-md-6">
                    <div className={"form-group " + this.state.error}>
                        <label htmlFor="doc-type-value">¿Deseas asegurar inmueble? </label>
                        <ul className="select-item">
                            <li className={((this.state.active === 1) ? 'active' : '')}
                                onClick={(e) => {
                                    this.validateEmpty({
                                        data: 1,
                                        value: 1,
                                        name: "inmuebleasegudado"
                                    });
                                }}
                            >Si
                            </li>
                            <li className={((this.state.active === 2) ? 'active' : '')}
                                onClick={(e) => {
                                    this.validateEmpty({
                                        data: 2,
                                        value: 2,
                                        name: "inmuebleasegudado"
                                    });
                                }}
                            >No
                            </li>
                        </ul>
                    </div>
                </div>
                {(this.state.active === 1) ? (
                    <div className="col col-12 col-md-6">
                        <div className={"form-group " + (this.state.errorValue !== 0 ? 'error' : '')}>
                            <label htmlFor="doc-type-value">Valor del inmueble</label>
                            <input name="value" id="doc-type-value"
                                   type="text"
                                   className={"form-control"}
                                   placeholder=""
                                   value={this.state.value}
                                   onBlur={(e) => {
                                       this.validateValue(e.target);
                                   }}
                                   onChange={(e) => {
                                       this.validateValue(e.target);
                                   }}/>
                            <small className={"form-text"}>Mínimo. $
                                1.000.000 - Máximo. $ 4.000.000.000
                            </small>
                            <small
                                className={"form-text only-errors " + (this.state.errorValue === 1 ? 'show' : 'hide')}>Por
                                favor ingrese un valor.
                            </small>
                            <small
                                className={"form-text only-errors " + (this.state.errorValue === 2 ? 'show' : 'hide')}>Valor
                                asegurado del inmueble es inferior al permitido.
                            </small>
                            <small
                                className={"form-text only-errors " + (this.state.errorValue === 3 ? 'show' : 'hide')}>Valor
                                asegurado del inmueble es superior al permitido.
                            </small>
                        </div>
                    </div>
                ) : ("")}
            </div>
        );
    }
}

export default Segurarinmueble;



