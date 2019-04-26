import React from 'react';
//Component
import BtnContinue from '../forms/btncontinue/BtnContinue';

import './Index.scss';
import {withRouter} from "react-router-dom";

class Index extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            step: parseInt(this.props.match.params.step),
            totalContent: 0
        };

    }

    addContent() {
        let total = this.state.totalContent + 1;
        this.setState({
            ...this.state,
            totalContent: total
        })
    }

    render() {
        if (this.state.step !== 2) return <div className="hide">&nbsp;</div>;
        return (
            <form autoComplete="off" className="index-form emision informacion-adicioonal">
                <div className="container">
                    <div className="row">
                        <div className="col col-sm-12 col-md-12 col-lg-12 title">
                            <h2>Cuéntanos más</h2>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col col-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="form-group"><label
                                htmlFor="pisonumero">¿Cuándo deseas que comience la póliza?</label>
                                <input type="text" className="form-control pickerDate" name="secondlastname"
                                       placeholder={"Selecciona la fecha de inicio de vigencia"}/>
                            </div>
                        </div>
                        <div className="col col-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="form-group "><label
                                htmlFor="pisonumero">Metros construidos de vivienda (Opcional)</label>
                                <input type="text" className="form-control" name="secondlastname"
                                       placeholder={"Ingresa el tamañó de la vivienda"}/>
                            </div>
                        </div>
                        <div className="col col-12 col-sm-12 col-md-12 col-lg-12">
                            <div className={"no-icon gridgrid form-group"}>
                                <label>El inmueble es utilizado como (opcional)</label>

                                <div className="row grid-select">

                                    <div className="col col-6 col-sm-12 col-md-4 col-lg-4">
                                        <div className={"select-item row"}>
                                            <div className="col col-12 no-padding">
                                                <i className="home-icon">&nbsp;</i>
                                            </div>
                                            <div className="col col-12 no-padding">
                                                <p>Vivienda permanente</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col col-6 col-sm-12 col-md-4 col-lg-4">
                                        <div className={"select-item row"}>
                                            <div className="col col-12 no-padding">
                                                <i className="summer">&nbsp;</i>
                                            </div>
                                            <div className="col col-12 no-padding">
                                                <p>Vivienda vacacional u ocasional</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col col-6 col-sm-12 col-md-4 col-lg-4">
                                        <div className={"select-item row"}>
                                            <div className="col col-12 no-padding">
                                                <i className="home-pay">&nbsp;</i>
                                            </div>
                                            <div className="col col-12 no-padding">
                                                <p>Vivienda en arriendo</p>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row row-full justify-content-center box-blue-full">
                        <div className="col col-sm-12 col-md-8 col-lg-8 text-center">
                            <h4>Relaciona los bienes individuales que superen los siguientes valores</h4>
                        </div>
                        <div className="col col-sm-12 col-md-6 col-lg-6">
                            <div className="row">
                                <div className="col col-sm-12 col-md-6 col-lg-6">
                                    <p><b>Contenidos</b>: $ 12.000.000</p>
                                    <p><b>Joyas</b>: $ 3.000.000</p>
                                    <p><b>Teléfonos Móviles:</b> Requiere relación detallada para todos</p>
                                </div>
                                <div className="col col-sm-12 col-md-6 col-lg-6">
                                    <p><b>Obras de Arte:</b> $ 3.000.000</p>
                                    <p><b>Contenidos Móviles:</b> $ 3.000.000</p>
                                </div>
                                <div className="col col-sm-12 col-md-12 col-lg-12 text-center">


                                    <div className="more-items" onClick={(e) => {
                                        this.addContent();
                                    }}>
                                        <button type="button" className="more-btn">+</button>
                                        <p>Agregar contenido</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col col-sm-12 col-md-12 col-lg-12 msj-bottom text-center">
                            <p>Es importante conocer este tipo de artículos, esto nos permite al momento del siniestro
                                responder de forma efectiva</p>
                        </div>
                    </div>

                    <div className="row row-full text-right">
                        <div className="col col-sm-12 col-md-12 col-lg-12">
                            <div className="more-info">
                                <p>Más información <span>?</span></p>
                            </div>
                        </div>
                    </div>

                    <div className="row text-center sujeta-block justify-content-center">
                        <div className="col col-sm-12 col-md-12 col-lg-12">
                            <h5>La póliza está sujeta a inspección en sitio</h5>
                            <p>Selecciona la persona con la cuál nos vamos a contactar para realizar la inspección en el
                                inmueble</p>
                        </div>
                        <div className="col col-sm-12 col-md-8 col-lg-8">
                            <div className={"no-icon gridgrid form-group"}>

                                <div className="row grid-select">

                                    <div className="col col-6 col-sm-12 col-md-4 col-lg-4">
                                        <div className={"select-item row"}>
                                            <div className="col col-12 no-padding">
                                                <i className="userperson">&nbsp;</i>
                                            </div>
                                            <div className="col col-12 no-padding">
                                                <p>Andrés Salamanca</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col col-6 col-sm-12 col-md-4 col-lg-4">
                                        <div className={"select-item row"}>
                                            <div className="col col-12 no-padding">
                                                <i className="userperson">&nbsp;</i>
                                            </div>
                                            <div className="col col-12 no-padding">
                                                <p>Juana Perez Gomez</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col col-6 col-sm-12 col-md-4 col-lg-4">
                                        <div className={"select-item row"}>
                                            <div className="col col-12 no-padding">
                                                <i className="userperson">&nbsp;</i>
                                            </div>
                                            <div className="col col-12 no-padding">
                                                <p>Mónica Gómez</p>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="col col-sm-12 col-md-12 col-lg-12 text-center">
                            <div className="more-items" onClick={(e) => {
                                this.togglePopUpPersona(1);
                            }}>
                                <button type="button" className="more-btn">+</button>
                                <p>Agregar persona</p>
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