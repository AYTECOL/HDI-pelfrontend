import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import './Submenu.scss';
import store from "../../../store";
import {restoreCotizacion, restoreCotizacionRisk, saveCotizacionNumber} from "../../../actionCreators";
import Identifications from "../../../services/GetIdentifications";
import RiskData from "../../../services/RiskData";
import {UrlSite} from "../../../config";

class Submenu extends Component {

    constructor(props) {
        super(props);

        this.state = {
            number: this.props.match.params.id,
            step: parseInt(this.props.match.params.step),
            path: '/cotizacion/' + this.props.match.params.step + '/' + this.props.match.params.id
        };

        if (this.state.step > 3) {
            window.location.href = UrlSite + "/404";
        }

        store.dispatch(saveCotizacionNumber(this.state.number));
        store.subscribe(() => {
            let storeState = store.getState();
            let number = storeState.cotizacion.number;
            if (this.state.number !== number) {
                this.setState({
                    number: number
                });
            }
        });

        this.getRowById(this.state.number);
    }

    async getRowById(id) {
        let cotizacion = await Identifications.getById(id);
        if (typeof cotizacion.identification !== 'undefined') {
            store.dispatch(restoreCotizacion(cotizacion));
            if (cotizacion.state >= 2 && parseInt(this.props.match.params.step) >= 2) {
                let riskData = await RiskData.get(id);
                if (riskData !== null) {
                    store.dispatch(restoreCotizacionRisk(riskData));
                }
            }
        }
    }

    render() {
        return (
            <aside className="cotizaciones-aside">
                <div className="container">
                    <div className="row">
                        <div id="id-cotizacion" className="col col-12 col-sm-2 col-md-2 col-lg-2">
                            <p>Cotización <span className="value">{this.state.number}</span></p>
                        </div>
                        <div id="cotizacion-menu" className="col col-12 col-sm-8 col-md-8 col-lg-8">
                            <ul>
                                <li className={this.state.step === 1 ? 'active' : ''}><span>1</span>Identificación</li>
                                <li className={this.state.step === 2 ? 'active' : ''}><span>2</span>Descripción del
                                    inmueble
                                </li>
                                <li className={this.state.step === 3 ? 'active' : ''}><span>3</span>Cotización</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </aside>
        );
    }
}

export default withRouter(Submenu);
