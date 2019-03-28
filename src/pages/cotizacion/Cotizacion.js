import React, {Component} from 'react';
import Submenu from '../../components/cotizaciones/submenu/Submenu';
import Identificacion from '../../components/cotizaciones/identificacion/index/Index';
import Inmueble from '../../components/cotizaciones/inmueble/index/Index';

import Validaridentificacion
    from '../../components/cotizaciones/identificacion/popups/validaridentificacion/Validaridentificacion';

class Cotizacion extends Component {


    render() {
        return (
            <div className="cotizacion">
                <Submenu/>
                <Identificacion/>
                <Inmueble/>
                <Validaridentificacion/>
            </div>
        );
    }
}

export default Cotizacion;
