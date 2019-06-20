import React, {Component} from 'react';
// Components
import Submenu from '../../components/globals/submenu/Submenu';
import Identificacion from '../../components/emisiones/identificacion/index/Index';
import Informacion from '../../components/emisiones/informacion/index/Index';
import Resumen from '../../components/emisiones/resumen/index/Index';
import {withRouter} from "react-router-dom";
import Helpers from "../../common/helpers/helpers/Helpers";

class Emision extends Component {
    render() {
        let params = this.props.match.params;
        params.step = parseInt(params.step);
        Helpers.getRowById(params.id, params.step);
        return (
            <div className="cotizacion">
                <Submenu step={params.step}
                         number={params.id}
                         options={[
                             "Información personal",
                             "Información adicional",
                             "Resumen de compra"
                         ]}
                />
                {params.step === 1 && <Identificacion/>}
                {params.step === 2 && <Informacion/>}
                {params.step === 3 && <Resumen/>}
            </div>
        );
    }
}

export default withRouter(Emision);
