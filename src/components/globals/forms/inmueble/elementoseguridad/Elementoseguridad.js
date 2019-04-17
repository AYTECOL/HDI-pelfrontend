import React, {Component} from 'react';

import store from '../../../../../store';
import {saveInmuebleValueSeguridad} from '../../../../../actionCreators';

import './Elementoseguridad.scss';

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
                this.setState({
                    ...this.state,
                    ...newValue,
                });
            }
        });
    }

    saveValue(e) {
        if (this.state[e.name] === 1){
            e.value = 0;
        } else if( this.state[e.name] === 0 ){
            e.value = 1;
        }
        store.dispatch(saveInmuebleValueSeguridad(e));
        let newValue = {};
        newValue[e.name] = e.value;
        this.setState({
            ...this.state,
            ...newValue
        });
    }

    render() {
        return (
            <div className={"form-group " + this.state.error}>
                <p className="p-descr">Selecciona, con cuáles de los siguientes elementos de seguridad cuenta el
                    inmueble</p>
                <ul className="items-checkboxes">
                    <li className="row">
                        <div className="col col-12 col-md-6">
                            <input type="checkbox" checked={(this.state.alarma === 0 || this.state.alarma === "" ? false : 'checked')}
                                   name="alarma"
                                   id="alarma"
                                   onChange={(e) => {
                                       this.saveValue({
                                           value: 1,
                                           name: "alarma"
                                       });
                                   }}/>
                            <label htmlFor="alarma">Alarma monitoreada</label>
                        </div>
                        <div className="col col-12 col-md-6">
                            <input type="checkbox" checked={(this.state.cajafuerte === 0 || this.state.cajafuerte === "" ? false : 'checked')}
                                   name="cajafuerte" id="cajafuerte"
                                   onChange={(e) => {
                                       this.saveValue({
                                           value: 1,
                                           name: "cajafuerte"
                                       });
                                   }}/>
                            <label htmlFor="cajafuerte">Puertas con control domótica</label>
                        </div>
                    </li>
                    <li className="row">
                        <div className="col col-12 col-md-6">
                            <input type="checkbox"
                                   checked={(this.state.puertascontroldomotico === 0 || this.state.puertascontroldomotico === "" ? false : 'checked')}
                                   name="puertascontroldomotico" id="puertascontroldomotico"
                                   onChange={(e) => {
                                       this.saveValue({
                                           value: 1,
                                           name: "puertascontroldomotico"
                                       });
                                   }}/>
                            <label htmlFor="puertascontroldomotico">Caja fuerte</label>
                        </div>
                        <div className="col col-12 col-md-6">
                            <input type="checkbox"
                                   checked={(this.state.puertasseguridadblindada === 0 || this.state.puertasseguridadblindada === "" ? false : 'checked')}
                                   name="puertasseguridadblindada" id="puertasseguridadblindada"
                                   onChange={(e) => {
                                       this.saveValue({
                                           value: 1,
                                           name: "puertasseguridadblindada"
                                       });
                                   }}/>
                            <label htmlFor="puertasseguridadblindada">Puerta de seguridad blindada</label>
                        </div>
                    </li>
                    <li className="row">
                        <div className="col col-12 col-md-6">
                            <input type="checkbox" checked={(this.state.circuitocerradotv === 0 || this.state.circuitocerradotv === "" ? false : 'checked')}
                                   name="circuitocerradotv" id="circuitocerradotv"
                                   onChange={(e) => {
                                       this.saveValue({
                                           value: 1,
                                           name: "circuitocerradotv"
                                       });
                                   }}/>
                            <label htmlFor="circuitocerradotv">Circuito cerrado de televisión</label>
                        </div>
                        <div className="col col-12 col-md-6">
                            <input type="checkbox" checked={(this.state.vigilanciapermanente === 0 || this.state.vigilanciapermanente === "" ? false : 'checked')}
                                   name="vigilanciapermanente" id="vigilanciapermanente"
                                   onChange={(e) => {
                                       this.saveValue({
                                           value: 1,
                                           name: "vigilanciapermanente"
                                       });
                                   }}/>
                            <label htmlFor="vigilanciapermanente">Vigilancia permanente</label>
                        </div>
                    </li>
                    <li className="row">
                        <div className="col col-12 col-md-6">
                            <input type="checkbox" checked={(this.state.reguladordevoltaje === 0 || this.state.reguladordevoltaje === "" ? false : 'checked')}
                                   name="reguladordevoltaje" id="reguladordevoltaje"
                                   onChange={(e) => {
                                       this.saveValue({
                                           value: 1,
                                           name: "reguladordevoltaje"
                                       });
                                   }}/>
                            <label htmlFor="reguladordevoltaje">Regulador de voltaje</label>
                        </div>
                    </li>

                </ul>
            </div>
        );
    }
}

export default Elementoseguridad;



