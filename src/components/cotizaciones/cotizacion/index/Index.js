import React from 'react';
import './Index.scss';
import {withRouter} from "react-router-dom";
//Component
import Tab from "../tab/Tab";
import Btns from "../../../../components/globals/forms/cotizacion/btncontinue/BtnContinue";
import Links from "../../../../components/globals/forms/cotizacion/links/Links";

class Index extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            step: parseInt(this.props.match.params.step),
        };
    }

    render() {
        if (this.state.step !== 3) return <div></div>;
        return (
            <form autoComplete="off" className="index-form contizacion-form">
                <div className="container">
                    <div className="row">
                        <div className="col col-sm-12 col-md-12 col-lg-12 title">
                            <h2>Tu cotización</h2>
                            <p>Listo, te sugerimos un paquete recomendado, sin embargo puedes personalizarlo de acuerdo
                                a la necesidad, quita o agrega lo que consideras podría ser de utilidad en el futuro</p>
                        </div>
                    </div>

                    <div className="row tabs text-center">
                        <div className="col col-12 col-sm-12 col-md-4 col-lg-4 no-padding">
                            <div className="item-tab">
                                <span>Básica</span>
                                <p>$ 300.000</p>
                            </div>
                        </div>
                        <div className="col col-12 col-sm-12 col-md-4 col-lg-4 no-padding">
                            <div className="item-tab active">
                                <span>Media</span>
                                <p>$ 700.000</p>
                            </div>
                        </div>
                        <div className="col col-12 col-sm-12 col-md-4 col-lg-4 no-padding">
                            <div className="item-tab">
                                <span>Premium</span>
                                <p>$ 300.000</p>
                            </div>
                        </div>
                    </div>

                    <div className="tabs-header text-center">
                        <Tab/>
                    </div>

                    <div className="row">
                        <div
                            className="col col-12 col-sm-12 col-md-12 col-lg-12 form-action justify-content text-center">
                            <Links/>
                        </div>
                    </div>

                    <div className="row btns-bottom">
                        <div
                            className="col col-12 col-sm-12 col-md-12 col-lg-12 form-action justify-content text-center">
                            <Btns/>
                        </div>
                    </div>

                    <div className="row alert-contizacion">
                        <div
                            className="col col-12 col-sm-12 col-md-12 col-lg-12 form-action justify-content text-center">
                            <p><i>i</i>No olvides diligenciar el SARLAFT, si aún no lo tienes descarga el fotmato  <span>aquí</span></p>
                        </div>
                    </div>

                </div>
            </form>
        )
    }

}

export default withRouter(Index);