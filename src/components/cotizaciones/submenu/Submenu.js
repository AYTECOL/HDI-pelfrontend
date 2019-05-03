import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import store from "../../../store";
import {saveCotizacionNumber} from "../../../actions";
import Helpers from "../../../common/helpers/helpers/Helpers";

class Submenu extends Component {

    constructor(props) {
        super(props);

        this.state = {
            number: this.props.match.params.id,
            path: '/cotizacion/' + this.props.match.params.step + '/' + this.props.match.params.id,
            step: parseInt(this.props.match.params.step),
        };
        store.dispatch(saveCotizacionNumber(this.state.number));
        store.subscribe(() => {
            let number = store.getState().cotizacion.number;
            if (this.state.number !== number) this.setState({number: number});
        });
        Helpers.getRowById(this.state.number,this.props.match.params.step);
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
