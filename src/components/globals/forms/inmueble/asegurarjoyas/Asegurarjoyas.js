import React, {Component} from 'react';

import store from '../../../../../store';
import {saveInmuebleValue} from '../../../../../actionCreators';
import Masknumbermoney from "../../../../../common/helpers/masknumbermoney/Masknumbermoney";
import Helpers from "../../../../../common/helpers/helpers/Helpers";

class Asegurarjoyas extends Component {

    static name () {
        try { return store.getState().allInsurableLimits[4].description;
        }catch (e) { return ""; }
    }
    //850000
    static min () {
        try { return store.getState().allInsurableLimits[4].min_value;
        }catch (e) { return 0; }
    }
    //100000001
    static max() {
        try { return store.getState().allInsurableLimits[4].max_value;
        }catch (e) { return 0; }
    }

    static validateField(v){
        let error = 0;
        v = Masknumbermoney.formatToNumber(v);
        if (v.length < 1) error = 1;
        if (error === 0) {
            if (v < Asegurarjoyas.min()) {
                error = 2;
            } else if (v > Asegurarjoyas.max()) {
                error = 3;
            }
        }
        return error;
    }

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            show: false,
            active: 0,
            min: Asegurarjoyas.min,
            max: Asegurarjoyas.max,
            errorValue: 0,
            value: ""
        };

        store.subscribe(async () => {
            let storeState = store.getState();
            let active = storeState.Inmueble.inmuebleasegudadojoyas;
            let value = storeState.Inmueble.inmuebleasegudadojoyasvalor;
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
            active: e.value
        });
        Helpers.removeClass(".inmuebleasegudadojoyas", "error");
    }

    validateValue(e) {
        let error = Asegurarjoyas.validateField(e.value);
        let format = Masknumbermoney.formatToMask(e.value);
        if( error === 0 ) Helpers.removeClass(".inmuebleasegudadojoyasvalor", "error");
        store.dispatch(saveInmuebleValue({
            name: "inmuebleasegudadojoyasvalor",
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
                <div className="col col-12  col-md-6">
                    <div className={"inmuebleasegudadojoyas no-icon form-group " + this.state.error}>
                        <label htmlFor="doc-type-value">¿Adicionalmente deseas { Asegurarjoyas.name() }? </label>
                        <ul className="select-item">
                            <li className={((this.state.active === 1) ? 'active' : '')}
                                onClick={(e) => {
                                    this.validateEmpty({
                                        value: 1,
                                        name: "inmuebleasegudadojoyas"
                                    });
                                }}
                            >Si
                            </li>
                            <li className={((this.state.active === 0) ? 'active' : '')}
                                onClick={(e) => {
                                    this.validateEmpty({
                                        value: 0,
                                        name: "inmuebleasegudadojoyas"
                                    });
                                }}
                            >No
                            </li>
                        </ul>
                    </div>
                </div>
                {(this.state.active === 1) ? (
                    <div className="col col-12  col-md-6">
                        <div className={"inmuebleasegudadojoyasvalor form-group " + (this.state.errorValue !== 0 ? 'error' : '')}>
                            <label htmlFor="inmuebleasegudadojoyasvalor">Valor de { Asegurarjoyas.name() }</label>
                            <input name="inmuebleasegudadojoyasvalor" id="inmuebleasegudadojoyasvalor"
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
                            <small className={"form-text"}>Mínimo. {Masknumbermoney.formatToMask(Asegurarjoyas.min())} - Máximo. {Masknumbermoney.formatToMask(Asegurarjoyas.max())}</small>
                            <small
                                className={"form-text only-errors " + (this.state.errorValue === 1 ? 'show' : 'hide')}>Por
                                Ingrese el valor asegurado de Joyas.
                            </small>
                            <small
                                className={"form-text only-errors " + (this.state.errorValue === 2 ? 'show' : 'hide')}>Valor
                                Asegurado de { Asegurarjoyas.name() } de Arte es inferior al permitido.
                            </small>
                            <small
                                className={"form-text only-errors " + (this.state.errorValue === 3 ? 'show' : 'hide')}>Valor
                                Asegurado de { Asegurarjoyas.name() } de Arte es superior al permitido.
                            </small>
                        </div>
                    </div>
                ) : ("")}
            </div>
        );
    }
}

export default Asegurarjoyas;



