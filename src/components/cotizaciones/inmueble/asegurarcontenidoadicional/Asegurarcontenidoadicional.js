import React, {Component} from 'react';
//Components
import Asegurarjoyas from '../forms/asegurarjoyas/Asegurarjoyas';
import Asegurarobras from '../forms/asegurarobras/Asegurarobras';
import Asegurartelefonos from '../forms/asegurartelefonos/Asegurartelefonos';
import store from "../../../../store";

import './Asegurarcontenidoadicional.scss';

class Asegurarcontenidoadicional extends Component {

    constructor(props) {
        super(props);
        this.state = {
            active: 0
        };
        store.subscribe(async () => {
            let storeState = store.getState();
            let contenidoasegudado = storeState.Inmueble.contenidoasegudado;
            if (this.state.active !== contenidoasegudado && contenidoasegudado !== "") {
                this.setState({
                    ...this.state,
                    active: contenidoasegudado,
                });
            }
        });
    }

    render() {
        return (
            <div className={"row justify-content-center extraform " + (this.state.active === 0 ? 'hide' : '')}>
                <div className="col col-11">
                    <div className="row">
                        <div className="col col-sm-12 col-md-12 col-lg-12 no-padding">
                            <Asegurarobras/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col col-sm-12 col-md-12 col-lg-12 no-padding">
                            <Asegurarjoyas/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col col-sm-12 col-md-12 col-lg-12 no-padding">
                            <Asegurartelefonos/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Asegurarcontenidoadicional;