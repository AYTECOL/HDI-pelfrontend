import React, {Component} from 'react';
// Components
import Submenu from '../../components/emisiones/submenu/Submenu';
import Identificacion from '../../components/emisiones/identificacion/index/Index';

class Emision extends Component {

    render() {
        return (
            <div className="cotizacion">
                <Submenu/>
                <Identificacion/>
            </div>
        );
    }
}

export default Emision;
