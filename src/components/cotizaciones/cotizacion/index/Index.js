import React, {Component} from 'react';
import './Index.scss';
import {withRouter} from "react-router-dom";
//Component
import SendMail from "../popups/sendmail/SendMail";
import Cards from "../cards/Cards";
import Tab from "../tab/Tab";
import Btns from "../forms/btncontinue/BtnContinue";
import Links from "../forms/links/Links";
import Plans from "../plans/Plans";
import store from "../../../../store";
import {toggleLoading} from "../../../../actions";

class Index extends Component {

    constructor(props) {
        super(props);
        this.state = {
            step: parseInt(this.props.match.params.step),
        };
        store.dispatch(toggleLoading(true));
    }

    render() {
        if (this.state.step !== 3) return <div className="hide">&nbsp;</div>;
        return (
            <form autoComplete="off" className="index-form contizacion-form">
                <div className="container">
                    <div className="row">
                        <div className="col col-sm-12 col-md-12 col-lg-12 title">
                            <h2>Tu cotización</h2>
                            <p>Listo, selecciona e ingresa un valor para los items que deseas asegurar</p>
                        </div>
                    </div>

                    <Cards/>

                    <Plans/>

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
                            <p><i>i</i>No olvides diligenciar el SARLAFT, si aún no lo tienes descarga el
                                formato <a
                                    href="https://www.libertycolombia.com.co/Personas/prodyserv/Bliblioteca-de-Documentos/Formulario_de_Conocimiento_del_Cliente_2017_Natural.PDF"
                                    rel="noopener noreferrer" target="_blank">aquí</a></p>
                        </div>
                    </div>

                </div>
                <SendMail/>
            </form>
        )
    }

}

export default withRouter(Index);