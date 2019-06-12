import React, {Component} from 'react';

import store from '../../../../../store';
import {saveInmuebleValueSeguridad} from '../../../../../actions';

import './Elementoseguridad.scss';
import AllSecurity from "../../../../../services/AllSecurity";
import Helpers from "../../../../../common/helpers/helpers/Helpers";

class Elementoseguridad extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            alarma: 0,
            cajafuerte: 0,
            puertascontroldomotico: 0,
            puertasseguridadblindada: 0,
            circuitocerradotv: 0,
            vigilanciapermanente: 0,
            reguladordevoltaje: 0,
            data: [],
            keys: {
                "1": {
                    name: "alarma",
                },
                "2": {
                    name: "cajafuerte"
                },
                "3": {
                    name: "circuitocerradotv"
                },
                "4": {
                    name: "reguladordevoltaje"
                },
                "5": {
                    name: "puertascontroldomotico"
                },
                "6": {
                    name: "puertasseguridadblindada"
                },
                "7": {
                    name: "vigilanciapermanente"
                },
            }
        };

        store.subscribe(async () => {
            let storeState = store.getState();
            let value = storeState.Inmueble.zona;
            let alarma = storeState.Inmueble.seguridad.alarma;
            let cajafuerte = storeState.Inmueble.seguridad.cajafuerte;
            let puertascontroldomotico = storeState.Inmueble.seguridad.puertascontroldomotico;
            let puertasseguridadblindada = storeState.Inmueble.seguridad.puertasseguridadblindada;
            let circuitocerradotv = storeState.Inmueble.seguridad.circuitocerradotv;
            let vigilanciapermanente = storeState.Inmueble.seguridad.vigilanciapermanente;
            let reguladordevoltaje = storeState.Inmueble.seguridad.reguladordevoltaje;
            if (
                this.state.alarma !== alarma ||
                this.state.cajafuerte !== cajafuerte ||
                this.state.puertascontroldomotico !== puertascontroldomotico ||
                this.state.puertasseguridadblindada !== puertasseguridadblindada ||
                this.state.circuitocerradotv !== circuitocerradotv ||
                this.state.vigilanciapermanente !== vigilanciapermanente ||
                this.state.reguladordevoltaje !== reguladordevoltaje
            ) {
                let newValue = {};
                newValue["storeState"] = storeState;
                newValue["value"] = value;
                newValue["alarma"] = alarma;
                newValue["cajafuerte"] = cajafuerte;
                newValue["puertascontroldomotico"] = puertascontroldomotico;
                newValue["puertasseguridadblindada"] = puertasseguridadblindada;
                newValue["circuitocerradotv"] = circuitocerradotv;
                newValue["vigilanciapermanente"] = vigilanciapermanente;
                newValue["reguladordevoltaje"] = reguladordevoltaje;
                for (let i in newValue) if (newValue[i] === '""') newValue[i] = "";
                this.setState({
                    ...this.state,
                    ...newValue,
                });
            }
        });
        this.getData();
    }

    async getData() {
        let data = await AllSecurity.get();
        this.setState({
            ...this.state,
            data: data
        })
    }

    saveValue = e => () => {
        if (this.state[e.name] === 1) {
            e.value = 0;
        } else if (this.state[e.name] === 0) {
            e.value = 1;
        }
        store.dispatch(saveInmuebleValueSeguridad(e));
        Helpers.updatePdfInfo({
            [e.name]: e.text
        });
        let newValue = {};
        newValue[e.name] = e.value;
        this.setState({
            ...this.state,
            ...newValue
        });
    };

    render() {
        return (
            <div className={"form-group " + this.state.error}>
                <p className="p-descr">Selecciona, con cuáles de los siguientes elementos de seguridad cuenta el
                    inmueble</p>
                <ul className="items-checkboxes">
                    <li className="row">
                        {this.state.data.map((item, key) =>
                            <div key={item.id} className="col col-12 col-md-6 lirow">
                                <input type="checkbox"
                                       checked={this.state[this.state.keys[item.id].name]}
                                       name={this.state.keys[item.id].name}
                                       id={this.state.keys[item.id].name}
                                       onChange={this.saveValue({
                                           value: 1,
                                           name: this.state.keys[item.id].name,
                                           text: item.description
                                       })}/>
                                <label htmlFor={this.state.keys[item.id].name}>{item.description}</label>
                            </div>
                        )}
                    </li>
                </ul>
            </div>
        );
    }
}

export default Elementoseguridad;



