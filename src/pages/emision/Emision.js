import React, {Component} from 'react';
// Components
import Submenu from '../../components/emisiones/submenu/Submenu';
import Identificacion from '../../components/emisiones/identificacion/index/Index';
import Informacion from '../../components/emisiones/informacion/index/Index';
import Resumen from '../../components/emisiones/resumen/index/Index';
import {withRouter} from "react-router-dom";

class Emision extends Component {

    render() {
        let step = parseInt(this.props.match.params.step);
        return (
            <div className="cotizacion">
                <Submenu/>
                {step === 1 && <Identificacion/>}
                {step === 2 && <Informacion/>}
                {step === 3 && <Resumen/>}
            </div>
        );
    }
}

export default withRouter(Emision);
