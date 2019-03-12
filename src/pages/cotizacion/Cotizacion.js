import React, { Component } from 'react';
import Submenu from '../../components/cotizaciones/submenu/Submenu';
import Index from '../../components/cotizaciones/index/Index';

class Cotizacion extends Component {
    render() {
        return (
            <div className="cotizacion">
                <Submenu />
                <Index />
            </div>
        );
    }
}

export default Cotizacion;
