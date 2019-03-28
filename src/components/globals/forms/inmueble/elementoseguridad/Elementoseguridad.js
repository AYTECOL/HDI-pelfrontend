import React, {Component} from 'react';

import store from '../../../../../store';
import {saveInmuebleValue} from '../../../../../actionCreators';

import './Elementoseguridad.scss';

class Elementoseguridad extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false
        };
    }

    validateEmpty(e) {
        let error = false;
        if (e.value.length < 1) error = true;
        this.setState({
            ...this.state,
            error: error
        });
        store.dispatch(saveInmuebleValue(e));
    }

    render() {
        return (
            <div className={"form-group " + this.state.error}>
                <p className="p-descr">Selecciona, con cuáles de los siguientes elementos de seguridad cuenta el
                    inmueble</p>
                <ul className="items-checkboxes">
                    <li className="row">
                        <div className="col col-12 col-md-6">
                            <input type="checkbox" name="alarma" id="alarma"/>
                            <label htmlFor="alarma">Alarma monitoreada</label>
                        </div>
                        <div className="col col-12 col-md-6">
                            <input type="checkbox" name="cajafuerte" id="cajafuerte"/>
                            <label htmlFor="cajafuerte">Puertas con control domótica</label>
                        </div>
                    </li>
                    <li className="row">
                        <div className="col col-12 col-md-6">
                            <input type="checkbox" name="puertascontroldomotico" id="puertascontroldomotico"/>
                            <label htmlFor="puertascontroldomotico">Caja fuerte</label>
                        </div>
                        <div className="col col-12 col-md-6">
                            <input type="checkbox" name="puertasseguridadblindada" id="puertasseguridadblindada"/>
                            <label htmlFor="puertasseguridadblindada">Puerta de seguridad blindada</label>
                        </div>
                    </li>
                    <li className="row">
                        <div className="col col-12 col-md-6">
                            <input type="checkbox" name="circuitocarradotv" id="circuitocarradotv"/>
                            <label htmlFor="circuitocarradotv">Circuito cerrado de televisión</label>
                        </div>
                        <div className="col col-12 col-md-6">
                            <input type="checkbox" name="vigilanciapermanente" id="vigilanciapermanente"/>
                            <label htmlFor="vigilanciapermanente">Vigilancia permanente</label>
                        </div>
                    </li>
                    <li className="row">
                        <div className="col col-12 col-md-6">
                            <input type="checkbox" name="reguladordeboltaje" id="reguladordeboltaje"/>
                            <label htmlFor="reguladordeboltaje">Regulador de voltaje</label>
                        </div>
                    </li>

                </ul>
            </div>
        );
    }
}

export default Elementoseguridad;



