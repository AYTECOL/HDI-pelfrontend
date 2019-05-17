import React, {Component} from 'react';
import {withRouter} from "react-router-dom";

// Components
import Submenu from '../../components/cotizaciones/submenu/Submenu';
import Identificacion from '../../components/cotizaciones/identificacion/index/Index';
import Inmueble from '../../components/cotizaciones/inmueble/index/Index';
import CotizacionForm from '../../components/cotizaciones/cotizacion/index/Index';

import Validaridentificacion
    from '../../components/cotizaciones/identificacion/popups/validaridentificacion/Validaridentificacion';

class Cotizacion extends Component {

    render() {
        let step = parseInt(this.props.match.params.step);
        return (
            <div className="cotizacion">
                <Submenu/>
                {step === 1 && <Identificacion/> }
                {step === 2 && <Inmueble/> }
                {step === 3 && <CotizacionForm/> }
                <Validaridentificacion/>
            </div>
        );
    }
}

export default withRouter(Cotizacion);
