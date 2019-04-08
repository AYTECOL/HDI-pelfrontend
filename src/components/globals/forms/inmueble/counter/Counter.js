import React, {Component} from 'react';
import './Counter.scss';
import store from "../../../../../store";

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
            let elements = [];

            if (inmueble.type_risk === 2) {
                total++;
            }

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

            if (inmueble.inmuebleasegudado === 0 && inmueble.contenidoasegudado === 0) errors++;

            if (inmueble.inmuebleasegudado === 1){
                total++;
                if (inmueble.inmuebleasegudadovalor === "") errors++;
            }
            if (inmueble.contenidoasegudado === 1){
                total++;
                if (inmueble.contenidoasegudadovalor === "") errors++;
            }

            if (inmueble.inmuebleasegudadojoyas === 1){
                total++;
                if (inmueble.inmuebleasegudadojoyasvalor === "") errors++;
            }
            if (inmueble.inmuebleasegudadoobras === 1){
                total++;
                if (inmueble.inmuebleasegudadoobrasvalor === "") errors++;
            }
            if (inmueble.inmuebleasegudadotelefonos === 1){
                total++;
                if (inmueble.inmuebleasegudadotelefonosvalor === "") errors++;
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