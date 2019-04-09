import React, {Component} from 'react';
import './Counter.scss';
import store from "../../../../../store";

// Components
import Segurarinmueble from '../segurarinmueble/Segurarinmueble';
import Asegurarcontenidos from "../asegurarcontenidos/Asegurarcontenidos";
import Asegurarjoyas from "../asegurarjoyas/Asegurarjoyas";
import Asegurarobras from "../asegurarobras/Asegurarobras";
import Asegurartelefonos from "../asegurartelefonos/Asegurartelefonos";

class Counter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            total: 14,
            error: 0,
            ok: 0,
        };

        store.subscribe(() => {
            let storeState = store.getState();
            let errors = 0;
            let inmueble = storeState.Inmueble;
            let total = 5;

            if (inmueble.type_risk === 2) total++;

            if (inmueble.type_risk === 2 && inmueble.pisonumero === "") errors++;
            if (inmueble.cojuntocerrado === "") errors++;
            if (inmueble.construidocon === "") errors++;
            if (inmueble.anoconstruido === "") errors++;
            if (inmueble.zona === "") errors++;
            if (inmueble.numerodepisos === "") errors++;

            if (inmueble.refuerzo === 1){
                total++;
                if (inmueble.anorefuerzo === "") errors++;
            }

            if (inmueble.inmuebleasegudado === 0 && (inmueble.contenidoasegudado === 0 || inmueble.contenidoasegudado === "")) {
                total++;
                errors++;
            }

            if (inmueble.inmuebleasegudado === 1){
                total++;
                if ( Segurarinmueble.validateField(inmueble.inmuebleasegudadovalor) !== 0 ) errors++;
            }
            if (inmueble.contenidoasegudado === 1){
                total++;
                if ( Asegurarcontenidos.validateField(inmueble.contenidoasegudadovalor) !== 0 ) errors++;
            }

            if (inmueble.inmuebleasegudadojoyas === 1){
                total++;
                if ( Asegurarjoyas.validateField(inmueble.inmuebleasegudadojoyasvalor) !== 0 ) errors++;
            }
            if (inmueble.inmuebleasegudadoobras === 1){
                total++;
                if ( Asegurarobras.validateField(inmueble.inmuebleasegudadoobrasvalor) !== 0 ) errors++;
            }
            if (inmueble.inmuebleasegudadotelefonos === 1){
                total++;
                if ( Asegurartelefonos.validateField(inmueble.inmuebleasegudadotelefonosvalor) !== 0 ) errors++;
            }

            let ok = total - errors;
            this.setState({
                ...this.state,
                ok: ok,
                total: total
            });
        });
    }

    render() {
        return (
            <div className={"msj-total"}>
                <p className="error">Haz diligenciado {this.state.ok} de {this.state.total} campos</p>
            </div>
        );
    }
}

export default Counter;