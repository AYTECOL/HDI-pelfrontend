import React, {Component} from 'react';
//Components
import Segurarinmueble from '../forms/segurarinmueble/Segurarinmueble';
import Asegurarcontenidos from '../forms/asegurarcontenidos/Asegurarcontenidos';
import Asegurarcontenidoadicional from '../asegurarcontenidoadicional/Asegurarcontenidoadicional';
//Api
import AllInsurableLimits from '../../../../services/AllInsurableLimits';

import {withRouter} from "react-router-dom";

class Valoreasegurar extends Component {

    constructor(props) {
        super(props);
        this.state = {};
        Valoreasegurar.getAllInsurableLimits();
    }

    static async getAllInsurableLimits() {
        await AllInsurableLimits.get();
    }

    render() {
        return (
            <div className="inmuebleform">
                <div className="container">
                    <div className="row">
                        <div className="col col-sm-12 col-md-12 col-lg-12">
                            <h5>Valores a asegurar</h5>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col col-sm-12 col-md-12 col-lg-12">
                            <Segurarinmueble/>
                        </div>
                    </div>

                    <div className="hr-mid">
                        <hr/>
                    </div>

                    <div className="row">
                        <div className="col col-sm-12 col-md-12 col-lg-12">
                            <Asegurarcontenidos/>
                        </div>
                    </div>

                    <div className="row justify-content-center">
                        <div className="col col-sm-12 col-md-12 col-lg-12">
                            <Asegurarcontenidoadicional/>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

export default withRouter(Valoreasegurar);