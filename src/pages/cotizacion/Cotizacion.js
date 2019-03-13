import React, { Component } from 'react';
import Submenu from '../../components/cotizaciones/submenu/Submenu';
import Index from '../../components/cotizaciones/identificacion/index/Index';

import Validaridentificacion from '../../components/cotizaciones/identificacion/popups/validaridentificacion/Validaridentificacion';

class Cotizacion extends Component {
    render() {
        return (
            <div className="cotizacion">
                <Submenu />
                <Index />
                <Validaridentificacion />
            </div>
        );
    }
}

export default Cotizacion;
