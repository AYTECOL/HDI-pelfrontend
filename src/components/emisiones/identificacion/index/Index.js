import React from 'react';
//Component
import BtnContinue from '../../../globals/forms/emision/identificacion/btncontinue/BtnContinue';

import './Index.scss';
import {withRouter} from "react-router-dom";

class Index extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            step: parseInt(this.props.match.params.step),
        };
    }

    render() {
        return (
            <form autoComplete="off" className="index-form emision">
                <div className="container">
                    <div className="row">
                        <div className="col col-sm-12 col-md-12 col-lg-12 title">
                            <h2>Cuéntanos sobre las personas</h2>
                            <p>Diligencia la siguiente información, agrega a los beneficiarios, asigna roles y no olvides ningún dato, puede ser importante en el futuro.</p>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col wrapper-more-selected">

                            <div className="row item-select">
                                <div className="col col-1">
                                    <div className="icon-image"></div>
                                </div>
                                <div className="col">
                                    <span>Rol</span>
                                    <p>Asegurado, tomador</p>
                                </div>
                                <div className="col">
                                    <span>Identificación</span>
                                    <p>1018465321-6</p>
                                </div>
                                <div className="col">
                                    <span>Razón social</span>
                                    <p>Constructores Viales…</p>
                                </div>
                                <div className="col">
                                    <span>Dirección</span>
                                    <p>Medellin calle 1233…</p>
                                </div>
                                <div className="col actions">
                                    <p>Modificar <span className="trash"></span></p>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="row">
                        <div className="col wrapper-more-items">
                            <div className="more-items">
                                <button className="more-btn">+</button>
                                <p>Agregar persona</p>
                            </div>
                            <div className="more-items">
                                <button className="more-btn">+</button>
                                <p>Agregar beneficiario oneroso</p>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div
                            className="col col-12 col-sm-12 col-md-12 col-lg-12 form-action justify-content text-center">
                            <BtnContinue/>
                        </div>
                    </div>
                </div>
            </form>
        )
    }

}

export default withRouter(Index);