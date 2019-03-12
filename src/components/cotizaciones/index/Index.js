import React, { Component } from 'react';
import './Index.scss';

class Index extends Component {
    render() {
        return (
            <div className="index-form">
                <div className="container">
                    <div className="row">
                        <div className="col col-sm-12 col-md-12 col-lg-12 title">
                            <h2>Comencemos</h2>
                            <p>Ingresa la siguiente información, así sabremos si es viable continuar con el proceso de cotización</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col col-sm-6 col-md-6 col-lg-6 form-first">
                            <div className="form-group">
                                <label htmlFor="doc-type">Tipo de identificación</label>
                                <select name="doc-type" id="doc-type" className="form-control">
                                    <option value="">Selecciona</option>
                                    <option value="CC">Cédula de ciudadanía</option>
                                    <option value="PASS">Pasaporte</option>
                                </select>
                            </div>
                        </div>
                        <div className="col col-sm-6 col-md-6 col-lg-6 form-first">
                            <div className="form-group">
                                <label for="doc-type-value">Número de identificación</label>
                                <input name="doc-type-value" id="doc-type-value" type="text" className="form-control" placeholder="Ingresa la identificación" />
                            </div>
                        </div>
                        <div className="col col-sm-12 col-md-12 col-lg-12 form-action justify-content text-center">
                            <button type="button" className="btn btn-primary">Continuar</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Index;
