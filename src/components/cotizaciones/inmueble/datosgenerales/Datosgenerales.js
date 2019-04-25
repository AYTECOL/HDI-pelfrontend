import React from 'react';
import store from '../../../../store';
//Components
import NumeroDepiso from '../../../../components/globals/forms/inmueble/numerodepiso/Numerodepiso';
import Ubicadopiso from '../../../../components/globals/forms/inmueble/ubicadopiso/Ubicadopiso';
import Anoconstruccion from '../../../../components/globals/forms/inmueble/anoconstruccion/Anoconstruccion';
import Zona from '../../../../components/globals/forms/inmueble/zona/Zona';
import Construidocon from '../../../../components/globals/forms/inmueble/construidocon/Construidocon';
import Refuerzoestructural from '../../../../components/globals/forms/inmueble/refuerzoestructural/Refuerzoestructural';

import './Datosgenerales.scss';
import {withRouter} from "react-router-dom";

class Datosgenerales extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            typeInmueble: 0
        };

        store.subscribe(async () => {
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