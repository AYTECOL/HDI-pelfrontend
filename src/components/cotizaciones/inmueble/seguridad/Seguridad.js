import React from 'react';
//Components
import Conjuntocerrado from '../../../../components/globals/forms/inmueble/conjuntocerrado/Conjuntocerrado';
import Elementoseguridad from '../../../../components/globals/forms/inmueble/elementoseguridad/Elementoseguridad';

import {withRouter} from "react-router-dom";

class Seguridad extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="inmuebleform">
                <div className="container">
                    <div className="row">
                        <div className="col col-sm-12 col-md-12 col-lg-12">
                            <h5>Seguridad del inmueble</h5>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col col-sm-12 col-md-6 col-lg-6">
                            <Conjuntocerrado/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col col-sm-12 col-md-12 col-lg-12">
                            <Elementoseguridad/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Seguridad);