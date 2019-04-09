import React from 'react';
import './Tab.scss';
import {withRouter} from "react-router-dom";
import Masknumbermoney from "../../../../common/helpers/masknumbermoney/Masknumbermoney";
import Helpers from "../../../../common/helpers/helpers/Helpers";

//Component

class Tab extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            step: parseInt(this.props.match.params.step),
        };
    }

    toogleSlide(index){
        let className = "close_item";
        if ( Helpers.hasClass(".row_tab_"+index, className) ){
            Helpers.removeClass(".row_tab_"+index, className);
        } else{
            let el = document.querySelector(".row_tab_"+index+" .wrapper-box");
            el.style.height = el.clientHeight+"px";
            Helpers.addClass(".row_tab_"+index, className);
        }
    }

    render() {
        return (
            <div>

                <div className="first-content">
                    <div className="row">
                        <div className="col col-12 col-md-3 col-lg-3">
                            <p className="textdescript">Ver asistencias</p>
                        </div>
                        <div className="col col-12 col-md-6 col-lg-6">
                            <p className="centerdescription"><span>Financiación</span> $30.000 / 10 cuotas</p>
                        </div>
                        <div className="col col-12 col-md-3 col-lg-3">
                        </div>
                    </div>
                </div>
                <div className="wrapper-items">


                    <div className="row row-max tabs-cotizaciones row_tab_0">
                        <div className="col col-12 col-sm-12 col-md-12 col-lg-12 no-padding">
                            <div className="row" onClick={(e) => {
                                this.toogleSlide(0);
                            }}>
                                <div className="col col-12 col-sm-12 col-md-6 col-lg-6 text-left">
                                    <h4><span>10</span>Coberturas</h4>
                                </div>
                                <div className="col col-12 col-sm-12 col-md-6 col-lg-6 text-right">
                                    <div className="close-section closeclose">Ocultar <i></i></div>
                                    <div className="close-section open">Ver <i></i></div>
                                </div>
                            </div>

                            <div className="wrapper-box">
                                {[...Array(5)].map((x, i) =>
                                    <div className="rowor" key={i}>
                                        <div className="row">
                                            <div className="col col-12 col-sm-12 col-md-4 col-lg-4 first items-checkboxes">
                                                <div className="form-group">
                                                    <input type="checkbox" name="incendios" id="incendios"/>
                                                    <label htmlFor="incendios">Incendio Y Peligros Aliados</label>
                                                </div>
                                            </div>
                                            <div className="col col-12 col-sm-12 col-md-4 col-lg-4 middle">
                                                <div className={"contenidoasegudadovalor form-group"}>
                                                    <label htmlFor="contenidoasegudadovalor">Valor inmueble</label>
                                                    <input name="contenidoasegudadovalor" id="contenidoasegudadovalor" placeholder="$ 20.000.000"
                                                           type="text" className={"form-control"}/>
                                                </div>
                                                <div className={"contenidoasegudadovalor form-group"}>
                                                    <label htmlFor="contenidoasegudadovalor">Valor inmueble</label>
                                                    <input name="contenidoasegudadovalor" id="contenidoasegudadovalor" placeholder="$ 20.000.000"
                                                           type="text" className={"form-control"}/>
                                                </div>
                                                <div className={"contenidoasegudadovalor form-group"}>
                                                    <label htmlFor="contenidoasegudadovalor">Valor inmueble</label>
                                                    <input name="contenidoasegudadovalor" id="contenidoasegudadovalor" placeholder="$ 20.000.000"
                                                           type="text" className={"form-control"}/>
                                                </div>
                                            </div>
                                            <div className="col col-12 col-sm-12 col-md-4 col-lg-4 last">
                                                <div className={"pisonumero input-select form-group " + ((this.state.error) ? 'error' : '')}>
                                                    <label htmlFor="pisonumero">Deducible</label>
                                                    <select name="pisonumero" className="form-control" value={this.state.value}>
                                                        <option value="">Sin Deducible</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>

                    <div className="row row-max tabs-cotizaciones row_tab_1">
                        <div className="col col-12 col-sm-12 col-md-12 col-lg-12 no-padding">
                            <div className="row" onClick={(e) => {
                                this.toogleSlide(1);
                            }}>
                                <div className="col col-12 col-sm-12 col-md-6 col-lg-6 text-left">
                                    <h4><span>4</span>Asistencias</h4>
                                </div>
                                <div className="col col-12 col-sm-12 col-md-6 col-lg-6 text-right">
                                    <div className="close-section closeclose">Ocultar <i></i></div>
                                    <div className="close-section open">Ver <i></i></div>
                                </div>
                            </div>

                            <div className="wrapper-box asistencias">
                                    <div className="rowor">
                                        <div className="row">
                                            <div className="col col-12 col-sm-12 col-md-12 col-lg-12 asistencia items-checkboxes">
                                                <div className="form-group">
                                                    <input type="checkbox" name="incendios" id="incendios"/>
                                                    <div className="group">
                                                        <label htmlFor="incendios">Asistencia básica</label>
                                                        <p>plomería, electricidad, vidrios y cerrajería</p>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col col-12 col-sm-12 col-md-12 col-lg-12 items-checkboxes">
                                                            <input type="checkbox" name="incendios" id="incendios"/>
                                                            <div className="group">
                                                                <label htmlFor="incendios">Asistencia para el Hogar plus</label>
                                                                <p>Orientación jurídica, gastos mudanza y bodegaje por siniestro, gastos de Hotel, interrupción de viaje, servicio de des-inundación, celaduría, lavado y secado de cortinas.</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col col-12 col-sm-12 col-md-12 col-lg-12 items-checkboxes">
                                                            <input type="checkbox" name="incendios" id="incendios"/>
                                                            <div className="group">
                                                                <label htmlFor="incendios">Asistencia de salud</label>
                                                                <p>Orientación médica telefónica, servicio de ambulancia, acompañamiento a citas médicas tercera edad y traslado de maternas</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col col-12 col-sm-12 col-md-12 col-lg-12 items-checkboxes">
                                                            <input type="checkbox" name="incendios" id="incendios"/>
                                                            <div className="group">
                                                                <label htmlFor="incendios">Asistencia para mascotas</label>
                                                                <p>Orientación veterninaria telefónica, médico veterinario a domicilio, asistencia estética para mascotas (baño y peluquería)</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col col-12 col-sm-12 col-md-12 col-lg-12 items-checkboxes">
                                                            <input type="checkbox" name="incendios" id="incendios"/>
                                                            <div className="group">
                                                                <label htmlFor="incendios">Asistencia especializada</label>
                                                                <p>Jornada de aseo, servicio de retiro de escombros y profesional en casa</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            </div>

                        </div>
                    </div>



                </div>
            </div>
        )
    }

}

export default withRouter(Tab);