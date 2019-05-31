import React, {Component} from 'react';

class Card extends Component {

    render() {
        return (
            <div className="row">
                <div className="col wrapper-more-selected">
                    {this.props.persons.map((item, key) =>
                        <div key={key} className="row item-select">
                            <div className="col col-1">
                                <div className="icon-image">&nbsp</div>
                            </div>
                            <div className="col">
                                <span>Rol</span>
                                <p className="font-weight-bold">{
                                    (item['role'].indexOf(1) !== -1 ? 'Tomador ' : '') +
                                    (item['role'].indexOf(2) !== -1 ? 'Asegurado ' : '') +
                                    (item['role'].indexOf(3) !== -1 ? 'Beneficiario ' : '') +
                                    (item['role'].indexOf(4) !== -1 ? 'Beneficiario oneroso ' : '') +
                                    (item['role'].indexOf(5) !== -1 ? 'Exequias ' : '') +
                                    (item['role'].indexOf(6) !== -1 ? 'Accidentes personales ' : '')
                                }</p>
                            </div>
                            <div className="col col-sm-2 col-md-2">
                                <span>Identificación</span>
                                <p>{item['value']}</p>
                            </div>
                            {parseInt(item['code']) === 37 ? (
                                <div className="col">
                                    <span>Razón social</span>
                                    <p>{item['businessname']}</p>
                                </div>
                            ) : (
                                <div className="col name">
                                    <span>Nombre y apellido</span>
                                    <p>{item['name']} {item['lastname']}</p>
                                </div>
                            )}
                            <div className="col col-sm-3 col-md-3">
                                <span>Dirección</span>
                                <p>{item['address']}</p>
                            </div>
                            <div className="col actions">
                                {this.props.showEdit === true &&
                                <p>
                                    <i onClick={this.props.togglePopUpPersona(key)}>Modificar</i>
                                    <span className="trash" onClick={this.props.togglePopUpDelete(key)}>&nbsp;</span>
                                </p>
                                }
                                {this.props.showView === true &&
                                <p className="viewDetails">
                                    <i onClick={this.props.togglePopUpPersona(key)}>Ver Detalles</i>
                                </p>
                                }
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }

}

export default Card;