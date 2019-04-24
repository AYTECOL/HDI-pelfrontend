import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import './Table.scss';
import store from '../../../store';
import {restoreCotizacion} from '../../../actionCreators';

import Identifications from '../../../services/GetIdentifications';

class Table extends Component {

    constructor(props) {
        super(props);
        this.state = {
            options: {
                quote: []
            }
        };
        this.getRows();
    }

    async getRows() {
        let cotizaciones = await Identifications.get();
        if (typeof cotizaciones.quote !== "undefined" && cotizaciones.quote.length > 0) {
            this.setState({
                ...this.state,
                options: await Identifications.get()
            });
        }
    }

    async getRowById(id) {
        let cotizacion = await Identifications.getById(id);
        if (typeof cotizacion.identification !== 'undefined') {
            this.props.history.push('/cotizacion/' + cotizacion.state + '/' + id);
            store.dispatch(restoreCotizacion(cotizacion));
        }
    }

    render() {
        return (
            <div className="table-solicitudes">
                <div className="wrapper">
                    <div className="row row-header">
                        <div className="col"><span>N. de solicitud</span></div>
                        <div className="col"><span>Fecha</span></div>
                        <div className="col"><span>Tomador</span></div>
                        <div className="col"><span>Dirección</span></div>
                        <div className="col"><span>Identificación</span></div>
                        <div className="col"><span>Validez</span></div>
                        <div className="col"><span>Estado</span></div>
                        <div className="col"><span>Acción</span></div>
                    </div>
                    {this.state.options.quote.map(option =>
                        <div className="row body" key={option.quoteId}>
                            <div className="col"><p>{option.quoteId}</p></div>
                            <div className="col"><p>03/09/2019 <span>09:45</span></p></div>
                            <div className="col"><p>{option.name} {option.lastname}</p></div>
                            <div className="col"><p>{option.document_number}<span>Cédula de ciudadanía</span></p></div>
                            <div className="col"><p>{option.address}</p></div>
                            <div className="col"><p>08 días</p></div>
                            <div className="col"><p>Proceso de inspección</p></div>
                            <div className="col">
                                <button onClick={(e) => {
                                    this.getRowById(option.quoteId)
                                }} className="btn btn-default">Retomar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="row footer">
                    <button type="button" className="pager prev"></button>
                    <ul>
                        <li className="active"><span>1</span></li>
                        <li><span>2</span></li>
                    </ul>
                    <button type="button" className="pager next"></button>
                </div>
            </div>
        );
    }
}

export default withRouter(Table);
