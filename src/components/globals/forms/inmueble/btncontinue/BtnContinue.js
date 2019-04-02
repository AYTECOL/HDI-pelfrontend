import React, {Component} from 'react';

import store from '../../../../../store';
import {Link, withRouter} from "react-router-dom";

import SaveInmueble from "../../../../../services/SaveInmueble";
import SaveIdentifications from "../../../../../services/SaveIdentifications";
import {NextStep} from "../../../../../actionCreators";

class BtnContinue extends Component {

    constructor(props) {
        super(props);
        this.state = {};

        store.subscribe(() => {
            let storeState = store.getState();
            let totalErrors;
            let inmueble = storeState.Inmueble;
            for (let i in inmueble) {
                let data = inmueble[i];
                for (let o in data) {
                    let d = data[o];
                    if (d === "") {
                        totalErrors++;
                    }
                }
            }
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
                        onClick={(e) => {
                            this.saveServiceContinue();
                        }}
                        className={"btn btn-primary"}>Continuar
                </button>
            </div>
        );
    }
}

export default withRouter(BtnContinue);



