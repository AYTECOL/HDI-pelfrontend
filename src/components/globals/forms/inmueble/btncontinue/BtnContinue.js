import React, {Component} from 'react';

import store from '../../../../../store';
import {Link, withRouter} from "react-router-dom";

import SaveInmueble from "../../../../../services/SaveInmueble";
import SaveIdentifications from "../../../../../services/SaveIdentifications";
import {NextStep} from "../../../../../actionCreators";

class BtnContinue extends Component {

    constructor(props) {
        super(props);
        this.state = {
            disabled: false
        };

        store.subscribe(() => {
            let storeState = store.getState();
            let totalErrors = 0;
            let inmueble = storeState.Inmueble;
            let disabled = false;
            for (let i in inmueble) {
                let data = inmueble[i];
                if (i !== "seguridad" && data === ""){
                    totalErrors++;
                }
            }
            if (totalErrors !== 0) {
                disabled = true;
            }
            this.setState({
                ...this.state,
                disabled: disabled
            });
        });
    }

    async saveService() {
        await SaveInmueble.get();
        window.location.href = "/";
    }

    async saveServiceContinue() {
        store.dispatch(NextStep(3));
        let storeState = store.getState();
        await SaveIdentifications.save();
        await SaveInmueble.get();
        window.location.href = '/cotizacion/3/' + storeState.cotizacion.number;
    }

    render() {
        let storeState = store.getState();
        return (
            <div>
                <div className={"return-button"}>
                    <Link to={"/cotizacion/1/"+storeState.cotizacion.number}><i className="back-icon"></i>Volver</Link>
                </div>
                <button className={"btn btn-default"}
                        onClick={(e) => {
                            this.saveService();
                        }}
                        type="button">Guardar y salir
                </button>
                <button type="button"
                        disabled={this.state.disabled}
                        onClick={(e) => {
                            this.saveServiceContinue();
                        }}
                        className={"btn btn-primary "+(this.state.disabled===true?'disabled':'')}>Continuar
                </button>
            </div>
        );
    }
}

export default withRouter(BtnContinue);



