import React, {Component} from 'react';
import store from '../../../../store';
//Components
import NumeroDepiso from '../forms/numerodepiso/Numerodepiso';
import Ubicadopiso from '../forms/ubicadopiso/Ubicadopiso';
import Anoconstruccion from '../forms/anoconstruccion/Anoconstruccion';
import Zona from '../forms/zona/Zona';
import Construidocon from '../forms/construidocon/Construidocon';
import Refuerzoestructural from '../forms/refuerzoestructural/Refuerzoestructural';

import './Datosgenerales.scss';
import {withRouter} from "react-router-dom";

class Datosgenerales extends Component {

    constructor(props) {
        super(props);
        this.state = {
            typeInmueble: 0
        };
    }

    componentDidMount() {
        this.unsubscribe = store.subscribe(async () => {
            let storeState = store.getState();
            let typeInmueble = storeState.typeInmueble;
            if (this.state.typeInmueble !== typeInmueble) {
                this.setState({
                    ...this.state,
                    typeInmueble: typeInmueble,
                });
            }
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        return (
            <div className="inmuebleform">
                <div className="container">
                    <div className="row">
                        <div className="col col-12 col-sm-12 col-md-6 col-lg-6">
                            <NumeroDepiso/>
                        </div>
                        <div
                            className={"col col-12 col-sm-12 col-md-6 col-lg-6 " + (this.state.typeInmueble === 2 ? 'show' : 'hide')}>
                            <Ubicadopiso/>
                        </div>
                        <div className="col col-12 col-sm-12 col-md-6 col-lg-6">
                            <Zona/>
                        </div>
                        <div className="col col-12 col-sm-12 col-md-6 col-lg-6">
                            <Anoconstruccion/>
                        </div>
                    </div>
                    <div className="row">
                        <div className={"col col-12 col-sm-12 col-md-12 col-lg-12"}>
                            <Refuerzoestructural/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col col-12 col-sm-12 col-md-12 col-lg-12">
                            <Construidocon/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Datosgenerales);