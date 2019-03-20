import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import AutoIncrementCotizacion from "../../../services/AutoIncrementCotizacion";

import './Submenu.scss';
import store from "../../../store";
import {saveCotizacionNumber} from "../../../actionCreators";

class Submenu extends Component {

    constructor(props) {
        super(props);

        this.state = {
            number: this.props.match.params.id,
        };
        store.dispatch(saveCotizacionNumber(this.state.number));
        store.subscribe(() => {
            let storeState = store.getState();
            let number = storeState.cotizacion.number;
            if( this.state.number != number ){
                this.setState({
                    number: number
                });
            }
        });
    }

    render() {
        return (
            <aside className="cotizaciones-aside">
                <div className="container">
                    <div className="row">
                        <div id="id-cotizacion" className="col col-sm-2 col-md-2 col-lg-2">
                            <p>Cotización <span className="value">{this.state.number}</span></p>
                        </div>
                        <div id="cotizacion-menu" className="col col-sm-8 col-md-8 col-lg-8">
                            <ul>
                                <li className="active"><span>1</span>Identificación</li>
                                <li><span>2</span>Descripción del inmueble</li>
                                <li><span>3</span>Cotización</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </aside>
        );
    }
}

export default withRouter(Submenu);
