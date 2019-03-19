import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './Table.scss';

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
        this.setState({
            ...this.state,
            options: await Identifications.get()
        });
    }

    render() {
        return (
            <div className="table-solicitudes">
                <div className="row row-header">
                    <div className="col"><span>N. de solicitud</span></div>
                    <div className="col"><span>Fecha</span></div>
                    <div className="col"><span>Tomador</span></div>
                    <div className="col"><span>Dirección</span></div>
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
                    </div>
                )}
            </div>
        );
    }
}

export default Table;
