import React, {Component} from 'react';
import './Persona.scss';

export default class Persona extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={"modal validaridentificacion show person-popup"}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Información adicional</h5>
                            <p className="modal-subtitle">Ingresa la información faltante, conocerla es importante para
                                nosotros, no olvides asignar un rol</p>
                            <button type="button" className="close" aria-label="Close" onClick={(e) => {
                                this.props.toggle(0)
                            }}>&nbsp;</button>
                        </div>
                        <div className="modal-body">
                            <div className="content">
                                <div className="row items-checkboxes">
                                    <div className="col col-sm-12 col-md-4 col-lg-4">
                                        <input type="checkbox" name="asegurado" id="asegurado" value="1"
                                               className="form-control"/>
                                        <label htmlFor="asegurado">Asegurado</label>
                                    </div>
                                    <div className="col col-sm-12 col-md-4 col-lg-4">
                                        <input type="checkbox" name="tomado" id="tomado" value="1"
                                               className="form-control"/>
                                        <label htmlFor="tomado">Tomador</label>
                                    </div>
                                    <div className="col col-sm-12 col-md-4 col-lg-4">
                                        <input type="checkbox" name="beneficiario" id="beneficiario" value="1"
                                               className="form-control"/>
                                        <label htmlFor="beneficiario">Beneficiario</label>
                                    </div>
                                </div>


                                <div className="row fields-row">
                                    <div className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                                        <div className="numerodepisos input-select form-group "><label
                                            htmlFor="tipodedocuemnto">Tipo de documento</label>
                                            <select name="tipodedocuemnto" id="tipodedocuemnto" className="form-control">
                                                <option value="">Seleccione</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col col-12 col-sm-12 col-md-6 col-lg-6">
                                        <div className="pisonumero form-group "><label
                                            htmlFor="pisonumero">Identificación</label>
                                            <input type="text" className="form-control" name="identificaionvalor"/>
                                        </div>
                                    </div>

                                    <div className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                                        <div className="pisonumero form-group "><label
                                            htmlFor="pisonumero">Primer nombre</label>
                                            <input type="text" className="form-control" name="name"/>
                                        </div>
                                    </div>
                                    <div className="col col-12 col-sm-12 col-md-6 col-lg-6">
                                        <div className="pisonumero form-group "><label
                                            htmlFor="pisonumero">Segundo nombre</label>
                                            <input type="text" className="form-control" name="secondname"/>
                                        </div>
                                    </div>

                                    <div className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                                        <div className="pisonumero form-group "><label
                                            htmlFor="pisonumero">Primer apellido</label>
                                            <input type="text" className="form-control" name="lastname"/>
                                        </div>
                                    </div>
                                    <div className="col col-12 col-sm-12 col-md-6 col-lg-6">
                                        <div className="pisonumero form-group "><label
                                            htmlFor="pisonumero">Segundo apellido</label>
                                            <input type="text" className="form-control" name="secondlastname"/>
                                        </div>
                                    </div>


                                    <div className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                                        <div className="pisonumero form-group "><label
                                            htmlFor="pisonumero">Genero</label>
                                            <input type="text" className="form-control" name="lastname"/>
                                        </div>
                                    </div>
                                    <div className="col col-12 col-sm-12 col-md-6 col-lg-6">
                                        <div className="pisonumero form-group "><label
                                            htmlFor="fechadenacimiento">Fecha de nacimiento</label>
                                            <input type="text" className="form-control" name="fechadenacimiento"/>
                                        </div>
                                    </div>

                                    <div className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                                        <div className="pisonumero form-group "><label
                                            htmlFor="tipodetelefono">Tipo de teléfono</label>
                                            <select name="tipodetelefono" id="tipodetelefono" className="form-control">
                                                <option value="">Seleccione</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col col-12 col-sm-12 col-md-6 col-lg-6">
                                        <div className="pisonumero form-group "><label
                                            htmlFor="telefono">Teléfono</label>
                                            <input type="text" className="form-control" name="telefono"/>
                                        </div>
                                    </div>

                                    <div className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                                        <div className="pisonumero form-group "><label
                                            htmlFor="email">Correo electrónico</label>
                                            <input type="text" className="form-control" name="email" id="email"/>
                                        </div>
                                    </div>
                                    <div className="col col-12 col-sm-12 col-md-6 col-lg-6">
                                        <div className="pisonumero form-group "><label
                                            htmlFor="ciudad">Ciudad o municipio</label>
                                            <input type="text" className="form-control" name="ciudad"/>
                                        </div>
                                    </div>

                                    <div className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                                        <div className="pisonumero form-group "><label
                                            htmlFor="adresstype">Tipo de dirección</label>
                                            <select name="adresstype" id="adresstype" className="form-control">
                                                <option value="">Seleccione</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col col-12 col-sm-12 col-md-6 col-lg-6">
                                        <div className="pisonumero form-group "><label
                                            htmlFor="address">Dirección</label>
                                            <input type="text" className="form-control" name="address"/>
                                        </div>
                                    </div>

                                </div>

                                <div className="row sarlaft">
                                    <div className="col col-12 col-sm-12 col-md-12 col-lg-12">
                                        <div className="sarlaft form-group">
                                            <label htmlFor="address">Es necesario el sarlaft</label>
                                            <span>Adjunta el Sarlaft diligenciado</span>
                                            <input type="file" className="form-control" name="sarlaft"/>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="buttons">
                                <button type="button" className="btn btn-primary"
                                >Continuar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    };
}