import React, {Component} from 'react';

import store from '../../../../../store';
import {saveInmuebleValueSeguridad} from '../../../../../actionCreators';

import './Elementoseguridad.scss';

class Elementoseguridad extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false
        };
    }

    saveValue(e) {
        store.dispatch(saveInmuebleValueSeguridad(e));
    }

    render() {
        return (
            <div className={"form-group " + this.state.error}>
                <p className="p-descr">Selecciona, con cuáles de los siguientes elementos de seguridad cuenta el
                    inmueble</p>
                <ul className="items-checkboxes">
                    <li className="row">
                        <div className="col col-12 col-md-6">
                            <input type="checkbox" name="alarma" id="alarma"
                                   onChange={(e) => {
                                       this.saveValue({
                                           value: 1,
                                           name: "alarma"
                                       });
                                   }}/>
                            <label htmlFor="alarma">Alarma monitoreada</label>
                        </div>
                        <div className="col col-12 col-md-6">
                            <input type="checkbox" name="cajafuerte" id="cajafuerte"
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
                            <input type="checkbox" name="puertascontroldomotico" id="puertascontroldomotico"
                                   onChange={(e) => {
                                       this.saveValue({
                                           value: 1,
                                           name: "puertascontroldomotico"
                                       });
                                   }}/>
                            <label htmlFor="puertascontroldomotico">Caja fuerte</label>
                        </div>
                        <div className="col col-12 col-md-6">
                            <input type="checkbox" name="puertasseguridadblindada" id="puertasseguridadblindada"
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
                            <input type="checkbox" name="circuitocerradotv" id="circuitocerradotv"
                                   onChange={(e) => {
                                       this.saveValue({
                                           value: 1,
                                           name: "circuitocerradotv"
                                       });
                                   }}/>
                            <label htmlFor="circuitocerradotv">Circuito cerrado de televisión</label>
                        </div>
                        <div className="col col-12 col-md-6">
                            <input type="checkbox" name="vigilanciapermanente" id="vigilanciapermanente"
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
                            <input type="checkbox" name="reguladordevoltaje" id="reguladordevoltaje"
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



