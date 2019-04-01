import React, {Component} from 'react';

import store from '../../../../../store';
import {Link, withRouter} from "react-router-dom";

import SaveInmueble from "../../../../../services/SaveInmueble";

class BtnContinue extends Component {

    constructor(props) {
        super(props);
        this.state = {};

        store.subscribe(() => {
            let storeState = store.getState();
            let totalErrors;
            let inmueble = storeState.Inmueble;
            for(let i in inmueble){
                let data = inmueble[i];
                for(let o in data){
                    let d = data[o];
                    if ( d === "" ) {
                        totalErrors++;
                    }
                }
            }
        });
    }

    async saveService(){
        let save = SaveInmueble.get();
        console.log(save);
    }

    saveServiceContinue(){

    }

    render() {
        return (
            <div>
                <div className={"return-button"}>
                    <Link to='/'><i className="back-icon"></i>Volver</Link>
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



