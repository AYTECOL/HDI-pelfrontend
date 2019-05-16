import React, {Component} from 'react';
// Components
import Submenu from '../../components/emisiones/submenu/Submenu';
import Identificacion from '../../components/emisiones/identificacion/index/Index';
import Informacion from '../../components/emisiones/informacion/index/Index';
import Resumen from '../../components/emisiones/resumen/index/Index';

class Emision extends Component {

    render() {
        return (
            <div className="cotizacion">
                <Submenu/>
                <Identificacion/>
                <Informacion/>
                <Resumen/>
            </div>
        );
    }
}

export default Emision;
