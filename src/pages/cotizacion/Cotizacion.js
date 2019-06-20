import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
// Components
import Submenu from '../../components/globals/submenu/Submenu';
import Identificacion from '../../components/cotizaciones/identificacion/index/Index';
import Inmueble from '../../components/cotizaciones/inmueble/index/Index';
import CotizacionForm from '../../components/cotizaciones/cotizacion/index/Index';
import Validaridentificacion
    from '../../components/cotizaciones/identificacion/popups/validaridentificacion/Validaridentificacion';
import Helpers from "../../common/helpers/helpers/Helpers";

class Cotizacion extends Component {
    render() {
        let params = this.props.match.params;
        params.step = parseInt(params.step);
        Helpers.getRowById(params.id, params.step, this.props.history);
        return (
            <div className="cotizacion">
                <Submenu step={params.step}
                         number={params.id}
                         options={[
                             "Identificación",
                             "Descripción del inmueble",
                             "Cotización"
                         ]}
                />
                {params.step === 1 && <Identificacion/>}
                {params.step === 2 && <Inmueble/>}
                {params.step === 3 && <CotizacionForm/>}
                <Validaridentificacion/>
            </div>
        );
    }
}

export default withRouter(Cotizacion);
